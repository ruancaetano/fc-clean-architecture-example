import express, { Request, Response } from "express";
import { NotificationError } from "../../../domain/@shared/notifications/notification.error";
import { CreateProductUseCase } from "../../../usecases/product/create/create-product.usecase";
import { FindProductUseCase } from "../../../usecases/product/find/find-product.usecase";
import { ListProductUseCase } from "../../../usecases/product/list/list-product.usecase";
import { UpdateProductUseCase } from "../../../usecases/product/update/update-product.usecase";
import { ProductRepository } from "../../product/repositories/sequelize/product.repository";

export const productsRoute = express.Router();

productsRoute.get("/", async (req: Request, res: Response) => {
  const productRepository = new ProductRepository();
  const usecase = new ListProductUseCase(productRepository);
  try {
    const output = await usecase.execute(null);
    return res.status(200).json(output);
  } catch (err) {
    return res.status(500).json(err);
  }
});

productsRoute.get("/:id", async (req: Request, res: Response) => {
  const productRepository = new ProductRepository();
  const usecase = new FindProductUseCase(productRepository);

  try {
    const id = req.params.id;

    const output = await usecase.execute({
      id,
    });
    return res.status(200).json(output);
  } catch (err) {
    if ((err as Error).message === "Product not found") {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(500).json(err);
  }
});

productsRoute.post("/", async (req: Request, res: Response) => {
  const productRepository = new ProductRepository();
  const usecase = new CreateProductUseCase(productRepository);

  try {
    const productDto = {
      name: req.body.name,
      price: req.body.price,
    };

    const output = await usecase.execute(productDto);
    return res.status(201).json(output);
  } catch (err) {
    const status = err instanceof NotificationError ? 400 : 500;
    return res.status(status).json({
      message: (err as Error).message || "Internal Server Error",
    });
  }
});

productsRoute.put("/", async (req: Request, res: Response) => {
  const productRepository = new ProductRepository();
  const usecase = new UpdateProductUseCase(productRepository);

  try {
    const productDto = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
    };

    const output = await usecase.execute(productDto);
    return res.status(200).json(output);
  } catch (err) {
    const status = err instanceof NotificationError ? 400 : 500;
    return res.status(status).json({
      message: (err as Error).message || "Internal Server Error",
    });
  }
});
