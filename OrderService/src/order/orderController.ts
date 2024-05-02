import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  SuccessResponse,
  Path,
  Query,
  Get,
  Delete,
  Put,
} from "tsoa";

import { Order, NewOrder, Quantity } from ".";
import { OrderService } from "./orderService";
import { UUID } from "../types";

@Route("order")
export class OrderController extends Controller {
  @Get("")
  @Response("404", "Not Found")
  public async getOrders(
    @Query("productId") productId?: UUID,
    @Query("accountId") accountId?: UUID,
  ): Promise<Order[] | undefined> {
    return await new OrderService().getAllOrders(productId, accountId);
  }

  @Post("")
  @SuccessResponse("201", "Order Created")
  public async createOrder(
    @Body() order: NewOrder,
  ): Promise<Order | undefined> {
    return await new OrderService().create(order);
  }

  @Get("{orderId}")
  @Response("404", "Not Found")
  public async getOrder(@Path() orderId: UUID): Promise<Order | undefined> {
    const order = await new OrderService().getOrder(orderId);
    return order ?? this.setStatus(404);
  }

  @Delete("{orderId}")
  @Response("404", "Not Found")
  public async deleteOrder(@Path() orderId: UUID): Promise<Order | undefined> {
    const order = await new OrderService().deleteOrder(orderId);
    return order ?? this.setStatus(404);
  }

  @Put("{orderId}")
  @Response("404", "Not Found")
  @SuccessResponse("201", "Updated")
  public async updateOrder(
    @Path() orderId: UUID,
    @Query("quantity") quantity?: Quantity,
    @Query("shipped") shipped?: boolean,
    @Query("delivered") delivered?: boolean,
  ): Promise<Order | undefined> {
    const updates = {
      quantity: quantity,
      shipped: shipped,
      delivered: delivered,
    };
    const order = await new OrderService().updateOrder(orderId, updates);
    return order ?? this.setStatus(404);
  }
}
