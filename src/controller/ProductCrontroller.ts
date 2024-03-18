import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, amount } = req.body;
    const { accessName } = req.params;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        amount,
        Access: {
          connect: {
            name: accessName,
          },
        },
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, amount } = req.body;
    const { productId } = req.params;

    const isProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!isProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description,
        price,
        amount,
      },
    });

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const Products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        amount: true,
      },
    });

    return res.status(201).json(Products);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getOneProducts = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        amount: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return res.status(200).json({message: "Product deleted successfully"});
  } catch (error) {
    return res.status(400).json(error);
  }
};