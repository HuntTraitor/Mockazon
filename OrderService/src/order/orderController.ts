import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  SuccessResponse,
  Path,
  Get,
} from 'tsoa'

import {Order, NewOrder} from '.'
import { OrderService } from './orderService';

@Route('order')
export class OrderController extends Controller {

  @Get('{productId}')
  @Response('404', 'Not Found')
  public async getOrders(
    @Path() productId: string
  ): Promise<Order[]|undefined> {
    return await new OrderService().getOrdersByProductId(productId)
  }

  @Post('{productId}')
  @SuccessResponse('201', 'Order Created')
  public async createOrder(
    @Path() productId: string,
    @Body() order: NewOrder,
  ): Promise<Order|undefined> {
    return await new OrderService().create(productId, order)
  }
}