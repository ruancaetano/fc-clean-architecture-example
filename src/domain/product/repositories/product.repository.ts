
import RepositoryInterface from "../../@shared/repositories/repository.interface";
import { Product } from "../entities/product.entity";

export interface ProductRespositoryInterface
  extends RepositoryInterface<Product> {}
