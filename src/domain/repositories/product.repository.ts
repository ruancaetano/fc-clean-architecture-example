import { Product } from "../entities/product.entity";
import RepositoryInterface from "./repository.interface";

export interface ProductRespositoryInterface
  extends RepositoryInterface<Product> {}
