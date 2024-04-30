import {
  Body,
  Controller,
  Post,
  Response,
  Request,
  Route,
  Security,
  SuccessResponse,
  Path,
} from 'tsoa'

import {Order, NewOrder} from '.'
import { OrderService } from './orderService';
import * as express from 'express';

@Route('order')
export class OrderController extends Controller {
  @Post('{productId}')
  // @Security("jwt", ["Vendor"])
  @Response('401', 'Unauthorized')
  @SuccessResponse('201', 'Order Created')
  public async createOrder(
    @Path() productId: string,
    @Body() order: NewOrder,
    @Request() request: express.Request
  ): Promise<Order|undefined> {
    return await new OrderService().create(productId, order)
    // if (request.user !== undefined) {
    //   return await new OrderService().create(productId, order)
    // } else {
    //   this.setStatus(401)
    // }
  }
}