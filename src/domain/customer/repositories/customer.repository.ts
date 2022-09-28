import RepositoryInterface from "../../@shared/repositories/repository.interface";
import { Customer } from "../entities/customer.entity";

export interface CustomerRespositoryInterface
  extends RepositoryInterface<Customer> {}
