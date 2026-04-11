import Groq from "groq-sdk";
import config from "../../config";
import { prisma } from "../../lib/prisma";

export type SearchInsight = {
  normalizedQuery: string;
  intent:
    | "medicine_search"
    | "availability"
    | "symptom"
    | "brand"
    | "category"
    | "general";
  suggestedKeywords: string[];
  categoryHints: string[];
  manufacturerHints: string[];
};

const groq = config.GROQ_API_KEY
  ? new Groq({ apiKey: config.GROQ_API_KEY })
  : null;

const MAX_AI_KEYWORDS = 8;
const MAX_SIMILAR_RESULTS = 5;

const dedupeStrings = (values: Array<string | undefined>) => [
  ...new Set(
    values
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value)),
  ),
];

const safeJsonParse = (value: string) => {
  try {
    return JSON.parse(value) as Partial<SearchInsight>;
  } catch {
    return null;
  }
};

const sanitizeInsight = (
  insight: Partial<SearchInsight> | null,
): SearchInsight | null => {
  if (!insight?.normalizedQuery) {
    return null;
  }

  const intent =
    insight.intent &&
    [
      "medicine_search",
      "availability",
      "symptom",
      "brand",
      "category",
      "general",
    ].includes(insight.intent)
      ? insight.intent
      : "medicine_search";

  return {
    normalizedQuery: insight.normalizedQuery.trim().slice(0, 120),
    intent,
    suggestedKeywords: dedupeStrings(
      (insight.suggestedKeywords || []).slice(0, MAX_AI_KEYWORDS),
    ),
    categoryHints: dedupeStrings(
      (insight.categoryHints || []).slice(0, MAX_AI_KEYWORDS),
    ),
    manufacturerHints: dedupeStrings(
      (insight.manufacturerHints || []).slice(0, MAX_AI_KEYWORDS),
    ),
  };
};

const getSemanticSearchInsight = async (
  search: string,
): Promise<SearchInsight | null> => {
  if (!groq) {
    return null;
  }

  const prompt = `Convert the user's medicine search text into a structured semantic search object.
Return ONLY valid JSON with this exact shape:
{
  "normalizedQuery": string,
  "intent": "medicine_search" | "availability" | "symptom" | "brand" | "category" | "general",
  "suggestedKeywords": string[],
  "categoryHints": string[],
  "manufacturerHints": string[]
}

Rules:
- Use short search-friendly keywords.
- If the user mentions symptoms, infer medicine-related terms that would help find matching medicines.
- If the user mentions a brand/product name, keep it in normalizedQuery and suggestedKeywords.
- Do not add markdown, explanation, or extra text.
- Do not mention backend or APIs.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: config.GROQ_MODEL,
      temperature: 0,
      max_tokens: 220,
      top_p: 1,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: search },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content?.trim() || "";
    const parsed = safeJsonParse(raw);
    return sanitizeInsight(parsed);
  } catch (error) {
    console.error("Semantic search AI error", error);
    return null;
  }
};

const buildSearchTerms = (search: string, insight: SearchInsight | null) => {
  const terms = [
    search,
    insight?.normalizedQuery,
    ...(insight?.suggestedKeywords || []),
    ...(insight?.categoryHints || []),
    ...(insight?.manufacturerHints || []),
  ];

  return dedupeStrings(terms).slice(0, MAX_AI_KEYWORDS);
};

const buildSearchConditions = (terms: string[]) =>
  terms.flatMap((term) => [
    {
      name: {
        contains: term,
        mode: "insensitive" as const,
      },
    },
    {
      description: {
        contains: term,
        mode: "insensitive" as const,
      },
    },
    {
      manufacturer: {
        contains: term,
        mode: "insensitive" as const,
      },
    },
  ]);

const getSimilarMedicines = async (payload: {
  terms: string[];
  excludeIds: string[];
  categoryId?: string | undefined;
}) => {
  const orConditions = buildSearchConditions(payload.terms);

  const similar = await prisma.medicines.findMany({
    where: {
      isActive: true,
      stocks: { gt: 0 },
      ...(payload.excludeIds.length
        ? {
            id: {
              notIn: payload.excludeIds,
            },
          }
        : {}),
      ...(payload.categoryId
        ? {
            categoryId: payload.categoryId,
          }
        : {}),
      ...(orConditions.length
        ? {
            OR: orConditions,
          }
        : {}),
    },
    take: MAX_SIMILAR_RESULTS,
    orderBy: [{ views: "desc" }, { createdAt: "desc" }],
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const transformedSimilar = similar.map((medicine) => ({
    ...medicine,
    price: Number(medicine.price),
  }));

  if (transformedSimilar.length > 0) {
    return transformedSimilar;
  }

  return prisma.medicines
    .findMany({
      where: {
        isActive: true,
        stocks: { gt: 0 },
        ...(payload.excludeIds.length
          ? {
              id: {
                notIn: payload.excludeIds,
              },
            }
          : {}),
        ...(payload.categoryId
          ? {
              categoryId: payload.categoryId,
            }
          : {}),
      },
      take: MAX_SIMILAR_RESULTS,
      orderBy: [{ views: "desc" }, { createdAt: "desc" }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    .then((items) =>
      items.map((medicine) => ({
        ...medicine,
        price: Number(medicine.price),
      })),
    );
};

export const medicineSearchAi = {
  getSemanticSearchInsight,
  buildSearchTerms,
  getSimilarMedicines,
};
