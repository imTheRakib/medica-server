import { prisma } from "../../lib/prisma";

const getCartItems = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
    },
  });

  if (!cart) {
    return null;
  }

  // Calculate total price
  const totalPrice = cart.items.reduce((total: number, item) => {
    return total + item.medicine.price.toNumber() * item.quantity;
  }, 0);

  return {
    cart,
    totalItems: cart.items.length,
    totalQuantity: cart.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice,
  };
};

const addtoCart = async (
  userId: string,
  medicineId: string,
  quantity: number,
) => {
  const medicine = await prisma.medicines.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  if (medicine.stocks < quantity) {
    throw new Error("Insufficient stock available");
  }

  // get or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  // Check if item already exists in cart
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_medicineId: {
        cartId: cart.id,
        medicineId,
      },
    },
  });

  let cartItem;

  if (existingCartItem) {
    // Update existing item
    const newQuantity = existingCartItem.quantity + quantity;

    if (medicine.stocks < newQuantity) {
      throw new Error("Insufficient stock available");
    }

    cartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: newQuantity },
      include: {
        medicine: true,
      },
    });
  } else {
    // Create new cart item
    cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        medicineId,
        quantity,
      },
      include: {
        medicine: true,
      },
    });
  }

  return cartItem;
};

const updateCartItem = async (
  userId: string,
  cartItemId: string,
  quantity: number,
) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: {
      cart: true,
      medicine: true,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  if (cartItem.cart.userId !== userId) {
    throw new Error("You don't have permission to update this item");
  }

  if (cartItem.medicine.stocks < quantity) {
    throw new Error("Insufficient stock available");
  }

  const updatedCartItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: {
      medicine: true,
    },
  });

  return updatedCartItem;
};

const removeFromCart = async (userId: string, cartItemId: string) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: {
      cart: true,
      medicine: true,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  if (cartItem.cart.userId !== userId) {
    throw new Error("You don't have permission to remove this item");
  }

  // delete the cart item
  const deletedItem = await prisma.cartItem.delete({
    where: { id: cartItemId },
    include: {
      medicine: true,
    },
  });

  return deletedItem;
};

const clearCart = async (userId: string) => {
  // get cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  //delete entire cart
  const deletedCart = await prisma.cart.delete({
    where: { id: cart.id },
    include: {
      items: true,
    },
  });

  return {
    deletedCount: deletedCart.items.length,
    message: "Cart completely removed",
  };
};

export const CartService = {
  getCartItems,
  addtoCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
