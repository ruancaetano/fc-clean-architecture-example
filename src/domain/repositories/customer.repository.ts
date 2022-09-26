import { Customer } from "../entities/customer.entity";
import { Product } from "../entities/product.entity";
import RepositoryInterface from "./repository.interface";

export interface CustomerRespositoryInterface
  extends RepositoryInterface<Customer> {}
