import {
  Route,
  Controller,
  SuccessResponse,
  Body,
  Response,
  Request,
  Put,
  Get,
} from 'tsoa';
import { Order, UpdateOrder } from '.';
import { OrderService } from './service';

@Route('order')
export class OrderController extends Controller {
  @Get()
  @Response('401', 'Unauthorized')
  @SuccessResponse('200', 'Orders Found')
  public async getOrders(
    @Request() request: Express.Request
  ): Promise<Order[] | undefined> {
    return await new OrderService().getOrders(request.user?.id);
  }

  // @Post()
  // @Response('401', 'Unauthorized')
  // @SuccessResponse('201', 'Order Created')
  // public async createOrder(
  //   @Body() order: NewOrder,
  //   @Request() request: Express.Request
  // ): Promise<Order | undefined> {
  //   return await new OrderService().create(order, request.user?.id);
  // }

  @Put('{orderId}')
  @Response('401', 'Unauthorized')
  @SuccessResponse('201', 'Order Updated')
  public async updateOrder(
    orderId: string,
    @Body() order: UpdateOrder
  ): Promise<Order | undefined> {
    return await new OrderService().update(orderId, order);
  }
}
