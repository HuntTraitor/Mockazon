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
} from 'tsoa'

import {Order, NewOrder} from '.'
import { OrderService } from './orderService';
import { UUID } from '../types';

@Route('order')
export class OrderController extends Controller {

  @Get('')
  @Response('404', 'Not Found')
  public async getOrders(
    @Query() productId: UUID
  ): Promise<Order[]|undefined> {
    return await new OrderService().getOrdersByProductId(productId)
  }

  @Post('')
  @SuccessResponse('201', 'Order Created')
  public async createOrder(
    @Query() productId: UUID,
    @Body() order: NewOrder,
  ): Promise<Order|undefined> {
    return await new OrderService().create(productId, order)
  }
}