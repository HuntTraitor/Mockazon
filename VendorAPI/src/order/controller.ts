import { Route, Controller, Post, SuccessResponse, Body, Response, Request } from 'tsoa';
import { NewOrder, Order } from '.';
import { OrderService } from './service';

@Route('order')
export class OrderController extends Controller {
  @Post()
  @Response('401', 'Unauthorized')
  @SuccessResponse('201', 'Order Created')
  public async createOrder(
    @Body() order: NewOrder,
    @Request() request: Express.Request
  ): Promise<Order|undefined> {
    return await new OrderService().create(order, request.user?.id)
  }
}
