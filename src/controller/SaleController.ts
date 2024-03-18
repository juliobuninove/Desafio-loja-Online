import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const createSale = async (req: Request, res: Response) => {
  try {
    const { products, userSellerId } = req.body;
    const { id } = req.user;

    const productsByDatabase = await prisma.product.findMany({
      where: {
        id: { in: products.map((product: any) => product.id) },
      },
    });

    const productWithQuantity = productsByDatabase.map((product) => {
      const { id, name, description, price } = product;
      const quantity = products.find((p: any) => p.id === product.id).quantity;
      return {
        id,
        name,
        description,
        price,
        quantity,
      };
    });

    let total = 0;
    for (const product of productWithQuantity) {
      total += product.price * parseInt(product.quantity);
    }

    const sale = await prisma.sale.create({
      data: {
        total_value: total,
        Buyer: { connect: { id } },
        saleProduct: {
          create: productWithQuantity.map((product) => ({
            Product: { connect: { id: product.id } },
            quantity: product.quantity,
          })),
        },
      },
      include: {
        saleProduct: true,
      },
    });

    productWithQuantity.map(async (product) => {
      await prisma.product.updateMany({
        where: {
          id: product.id,
        },
        data: {
          amount: {
            decrement: parseInt(product.quantity),
          },
        },
      });
    });

    return res
      .status(201)
      .json({ sale, message: "Purchase made successfully" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getAllSale = async (req: Request, res: Response) => {
  try {
    const sales = await prisma.sale.findMany({
      select: {
        id: true,
        total_value: true,
        Buyer: {
          select: {
            id: true,
            name: true,
          },
        },
        saleProduct: {
          select: {
            Product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
            quantity: true,
          },
        },
        created_at: true,
      },
    });

    return res.status(200).json(sales);
  } catch (error) {}
};

export const getAllSalesbyBuyer = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const sales = await prisma.sale.findMany({
      where: {
        buyerId: id,
      },
      select: {
        id: true,
        total_value: true,
        Buyer: {
          select: {
            id: true,
            name: true,
          },
        },
        saleProduct: {
          select: {
            Product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
            quantity: true,
          },
        },
        created_at: true,
      },
    });

    return res.status(200).json(sales);
  } catch (error) {}
};
