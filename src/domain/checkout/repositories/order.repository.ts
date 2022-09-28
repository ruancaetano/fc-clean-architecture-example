import RepositoryInterface from "../../@shared/repositories/repository.interface";
import { Order } from "../entities/order.entity";

export interface OrderRespositoryInterface extends RepositoryInterface<Order> {}
