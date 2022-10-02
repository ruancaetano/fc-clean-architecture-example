import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { CustomerModel } from "../customer/repositories/sequelize/customer.model";
import { ProductModel } from "../product/repositories/sequelize/product.model";
import { customersRoute } from "./routes/customers.route";
import { productsRoute } from "./routes/products.route";

export const app: Express = express();
app.use(express.json());

app.use("/customers", customersRoute);
app.use("/products", productsRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  await sequelize.addModels([CustomerModel, ProductModel]);
  await sequelize.sync();
}
setupDb();
