import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { CustomerModel } from "../customer/repositories/sequelize/customer.model";
import { customerRoute } from "./routes/customer.route";

export const app: Express = express();
app.use(express.json());

app.use("/customers", customerRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  await sequelize.addModels([CustomerModel]);
  await sequelize.sync();
}
setupDb();
