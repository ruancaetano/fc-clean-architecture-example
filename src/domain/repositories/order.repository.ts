import { Order } from "../entities/order.entity";
import RepositoryInterface from "./repository.interface";

export interface OrderRespositoryInterface extends RepositoryInterface<Order> {}
