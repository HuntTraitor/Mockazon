import {
  Route,
  Controller,
  SuccessResponse,
  Body,
  Response,
  Request,
  Put,
  Get,
  Security,
  Query,
} from 'tsoa';
import { Order, UpdateOrder } from '.';
import { OrderService } from './service';
import { AuthService } from '../auth/service';

@Route('order')
export class OrderController extends Controller {
  @Get()
  @Response('401', 'Unauthorized')
  @Security('ApiKeyAuth')
  @SuccessResponse('200', 'Orders Found')
  public async getOrders(
    @Request() request: Express.Request
  ): Promise<Order[] | undefined> {
    console.log('request.user!.id', request.user!.id);
    return await new OrderService().getOrders(request.user!.id);
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
  @Security('ApiKeyAuth')
  @SuccessResponse('201', 'Order Updated')
  public async updateOrder(
    orderId: string,
    @Body() order: UpdateOrder,
    @Request() request: Express.Request
  ): Promise<Order | undefined> {
    if (await new AuthService().checkOwnership(request.user!.id, orderId) === false) {
      this.setStatus(404);
      return undefined;
    }
    return await new OrderService().update(orderId, order);
  }

  @Put('{orderId}/shipped')
  @Response('401', 'Unauthorized')
  @Security('ApiKeyAuth')
  @SuccessResponse('201', 'Order Shipping Status Updated')
  public async setShipped(
    orderId: string,
    @Query() shipped: boolean,
    @Request() request: Express.Request
  ): Promise<Order | undefined> {
    if (await new AuthService().checkOwnership(request.user!.id, orderId) === false) {
      this.setStatus(404);
      return undefined;
    }
    return await new OrderService().setShipped(orderId, shipped);
  }

  @Put('{orderId}/delivered')
  @Response('401', 'Unauthorized')
  @Security('ApiKeyAuth')
  @SuccessResponse('201', 'Order Delivery Status Updated')
  public async setDelivered(
    orderId: string,
    @Query() delivered: boolean,
    @Request() request: Express.Request
  ): Promise<Order | undefined> {
    if (await new AuthService().checkOwnership(request.user!.id, orderId) === false) {
      this.setStatus(404);
      return undefined;
    }
    return await new OrderService().setDelivered(orderId, delivered);
  }
}
