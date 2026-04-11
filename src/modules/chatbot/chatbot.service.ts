import Groq from "groq-sdk";
import config from "../../config";
import { prisma } from "../../lib/prisma";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type PublicContextPayload = {
  appOverview: {
    name: string;
    description: string;
    features: string[];
  };
  marketplaceSnapshot: {
    totalMedicines: number;
    activeMedicines: number;
    inStockMedicines: number;
    totalCategories: number;
    totalOrders: number;
  };
  bestSellingProducts: Array<{
    medicineId: string;
    name: string;
    manufacturer: string;
    stocks: number;
    isActive: boolean;
    totalSoldUnits: number;
  }>;
  availabilityMatches: Array<{
    medicineId: string;
    name: string;
    manufacturer: string;
    stocks: number;
    isAvailable: boolean;
    price: number;
    category: string;
  }>;
};

const MAX_HISTORY_CONTEXT = 10;

const groq = new Groq({
  apiKey: config.GROQ_API_KEY,
});

const projectContext = `You are Medica Assistant for the Medica application.

Project summary:
- Roles: CUSTOMER, SELLER, ADMIN.
- Core capabilities: medicines, orders, cart, category, reviews, seller management, admin controls.

Your responsibilities:
- Help users understand Medica features and how the app works.
- Answer with concise and practical user-facing guidance.
- Use only the provided public context data for statistics, product availability, and best-selling items.
- If asked something unknown, say that clearly instead of inventing details.
- Do not expose secrets, API keys, or sensitive data.
- Never mention API endpoints, backend routes, database tables, or technical implementation details in user responses.
- Keep answers focused on what users can do in the app.`;

const hasAvailabilityIntent = (message: string) => {
  const normalized = message.toLowerCase();
  return [
    "available",
    "availability",
    "in stock",
    "stock",
    "have ",
    "can i buy",
  ].some((token) => normalized.includes(token));
};

const normalizeSearchTerm = (value: string) =>
  value
    .replace(/\b(medicine|product|item|called|name)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

const extractAvailabilityQuery = (message: string): string | null => {
  const patterns = [
    /is\s+(.+?)\s+(available|in stock)/i,
    /availability\s+of\s+(.+)/i,
    /do\s+you\s+have\s+(.+)/i,
    /can\s+i\s+buy\s+(.+)/i,
    /looking\s+for\s+(?:a\s+)?(?:medicine\s+)?(?:called\s+)?(.+)/i,
    /need\s+(?:a\s+)?(?:medicine\s+)?(?:called\s+)?(.+)/i,
    /find\s+(?:a\s+)?(?:medicine\s+)?(?:called\s+)?(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    const query = match?.[1]?.trim();
    if (query) {
      const normalized = normalizeSearchTerm(query.replace(/[?.,!;:]/g, ""));
      if (normalized) {
        return normalized;
      }
    }
  }

  return null;
};

const buildAvailabilityDirectResponse = (
  latestUserMessage: string,
  availabilityMatches: PublicContextPayload["availabilityMatches"],
) => {
  if (!hasAvailabilityIntent(latestUserMessage)) {
    return null;
  }

  const query = extractAvailabilityQuery(latestUserMessage);
  if (!query) {
    return "At this moment, I could not identify the medicine name clearly. Please share the exact medicine name.";
  }

  if (!availabilityMatches.length) {
    return `At this moment, \"${query}\" is not available on this website.`;
  }

  const exactMatch = availabilityMatches.find(
    (item) => item.name.toLowerCase() === query.toLowerCase(),
  );
  const selected = exactMatch || availabilityMatches[0];

  if (!selected?.isAvailable) {
    return `At this moment, \"${selected?.name}\" is listed but out of stock.`;
  }

  return `Yes, at this moment \"${selected.name}\" is available on this website. Current stock: ${selected.stocks}.`;
};

const getBestSellingProducts = async () => {
  const grouped = await prisma.orderItems.groupBy({
    by: ["medicineId"],
    where: {
      order: {
        status: {
          not: "CANCELLED",
        },
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 8,
  });

  if (!grouped.length) {
    return [];
  }

  const ids = grouped.map((item) => item.medicineId);
  const medicines = await prisma.medicines.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
      name: true,
      manufacturer: true,
      stocks: true,
      isActive: true,
    },
  });

  const medicineMap = new Map(
    medicines.map((medicine) => [medicine.id, medicine]),
  );

  return grouped
    .map((item) => {
      const medicine = medicineMap.get(item.medicineId);
      if (!medicine) return null;

      return {
        medicineId: medicine.id,
        name: medicine.name,
        manufacturer: medicine.manufacturer,
        stocks: medicine.stocks,
        isActive: medicine.isActive,
        totalSoldUnits: item._sum.quantity || 0,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
};

const getAvailabilityMatches = async (message: string) => {
  if (!hasAvailabilityIntent(message)) {
    return [];
  }

  const searchTerm = extractAvailabilityQuery(message);

  if (!searchTerm) {
    return [];
  }

  const matches = await prisma.medicines.findMany({
    where: {
      isActive: true,
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      manufacturer: true,
      stocks: true,
      price: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    take: 5,
    orderBy: [
      {
        stocks: "desc",
      },
      {
        views: "desc",
      },
    ],
  });

  return matches.map((item) => ({
    medicineId: item.id,
    name: item.name,
    manufacturer: item.manufacturer,
    stocks: item.stocks,
    isAvailable: item.stocks > 0,
    price: Number(item.price),
    category: item.category.name,
  }));
};

const getPublicProjectContext = async (
  message: string,
): Promise<PublicContextPayload> => {
  const [
    totalMedicines,
    activeMedicines,
    inStockMedicines,
    totalCategories,
    totalOrders,
    bestSellingProducts,
    availabilityMatches,
  ] = await Promise.all([
    prisma.medicines.count(),
    prisma.medicines.count({ where: { isActive: true } }),
    prisma.medicines.count({ where: { isActive: true, stocks: { gt: 0 } } }),
    prisma.category.count(),
    prisma.orders.count(),
    getBestSellingProducts(),
    getAvailabilityMatches(message),
  ]);

  return {
    appOverview: {
      name: "Medica",
      description: "Medicine Management and E-commerce application",
      features: [
        "Medicine browsing and search",
        "Featured and top-viewed products",
        "Cart and order processing",
        "Customer reviews",
        "Seller inventory management",
        "Role-based admin controls",
      ],
    },
    marketplaceSnapshot: {
      totalMedicines,
      activeMedicines,
      inStockMedicines,
      totalCategories,
      totalOrders,
    },
    bestSellingProducts,
    availabilityMatches,
  };
};

const createChatCompletion = async (messages: ChatMessage[]) => {
  if (!config.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in environment variables");
  }

  const latestUserMessage =
    [...messages].reverse().find((item) => item.role === "user")?.content || "";

  const publicContext = await getPublicProjectContext(latestUserMessage);

  const availabilityDirectResponse = buildAvailabilityDirectResponse(
    latestUserMessage,
    publicContext.availabilityMatches,
  );

  if (availabilityDirectResponse) {
    return availabilityDirectResponse;
  }

  const safeHistory = messages.slice(-MAX_HISTORY_CONTEXT);

  let content = "";

  try {
    const completion = await groq.chat.completions.create({
      model: config.GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: `${projectContext}\n\nPublic Context (JSON):\n${JSON.stringify(publicContext)}`,
        },
        ...safeHistory,
      ],
      temperature: 0.2,
      max_tokens: 700,
      top_p: 1,
    });

    content = completion.choices?.[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Groq request failed", error);
    throw new Error("Failed to communicate with AI service");
  }

  if (!content) {
    throw new Error("Failed to generate AI response");
  }

  return content;
};

export const ChatbotService = {
  createChatCompletion,
};
