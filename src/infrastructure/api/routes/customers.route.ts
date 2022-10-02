import express, { Request, Response } from "express";
import { NotificationError } from "../../../domain/@shared/notifications/notification.error";
import { CreateCustomerUseCase } from "../../../usecases/customer/create/create-customer.usecase";
import { FindCustomerUseCase } from "../../../usecases/customer/find/find-customer.usecase";
import { ListCustomerUseCase } from "../../../usecases/customer/list/list-customer.usecase";
import { UpdateCustomerUseCase } from "../../../usecases/customer/update/update-customer.usecase";
import { CustomerRepository } from "../../customer/repositories/sequelize/customer.repository";
import { ListCustomerPresenter } from "../presenters/list-customer.presenter";

export const customersRoute = express.Router();

customersRoute.get("/", async (req: Request, res: Response) => {
  const customerRepository = new CustomerRepository();
  const usecase = new ListCustomerUseCase(customerRepository);
  try {
    const output = await usecase.execute(null);

    res.format({
      json: async () => res.status(200).send(output),
      xml: async () =>
        res.status(200).send(ListCustomerPresenter.toXML(output)),
    });
    return res
  } catch (err) {
    return res.status(500).json(err);
  }
});

customersRoute.get("/:id", async (req: Request, res: Response) => {
  const customerRepository = new CustomerRepository();
  const usecase = new FindCustomerUseCase(customerRepository);

  try {
    const id = req.params.id;

    const output = await usecase.execute({
      id,
    });
    return res.status(200).json(output);
  } catch (err) {
    if ((err as Error).message === "Customer not found") {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

customersRoute.post("/", async (req: Request, res: Response) => {
  const customerRepository = new CustomerRepository();
  const usecase = new CreateCustomerUseCase(customerRepository);

  try {
    const customerDto = {
      name: req.body.name,
      address: {
        street: req.body.address.street,
        number: req.body.address.number,
        city: req.body.address.city,
        state: req.body.address.state,
        zipcode: req.body.address.zipcode,
      },
    };

    const output = await usecase.execute(customerDto);
    return res.status(201).json(output);
  } catch (err) {
    const status = err instanceof NotificationError ? 400 : 500;
    return res.status(status).json({
      message: (err as Error).message || "Internal Server Error",
    });
  }
});

customersRoute.put("/", async (req: Request, res: Response) => {
  const customerRepository = new CustomerRepository();
  const usecase = new UpdateCustomerUseCase(customerRepository);

  try {
    const customerDto = {
      id: req.body.id,
      name: req.body.name,
      address: {
        street: req.body.address.street,
        number: req.body.address.number,
        city: req.body.address.city,
        state: req.body.address.state,
        zipcode: req.body.address.zipcode,
      },
    };

    const output = await usecase.execute(customerDto);
    return res.status(200).json(output);
  } catch (err) {
    const status = err instanceof NotificationError ? 400 : 500;
    return res.status(status).json({
      message: (err as Error).message || "Internal Server Error",
    });
  }
});
