import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  SuccessResponse,
  Path,
} from 'tsoa'

import {Order, NewOrder} from '.'
import { OrderService } from './orderService';

@Route('order')
export class OrderController extends Controller {
  @Post('{productId}')
  @Response('401', 'Unauthorized')
  @SuccessResponse('201', 'Order Created')
  public async createOrder(
    @Path() productId: string,
    @Body() order: NewOrder,
  ): Promise<Order|undefined> {
    return await new OrderService().create(productId, order)
  }
}