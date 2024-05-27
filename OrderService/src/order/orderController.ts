import {
  Body,
  Controller,
  Route,
  SuccessResponse,
  Query,
  Get,
  Post,
  Response,
  Delete,
  Put,
  Path,
} from 'tsoa';

import {
  Order,
  NewOrder,
  Quantity,
  ShopperOrder,
  ShopperOrderId,
  OrderProduct,
  OrderProductId,
} from '.';
import { OrderService } from './orderService';
import { UUID } from '../types';

@Route('order')
export class OrderController extends Controller {
  @Get('')
  @Response('404', 'Not Found')
  public async getOrders(
    @Query('productId') productId?: UUID,
    @Query('shopperId') shopperId?: UUID,
    @Query('vendorId') vendorId?: UUID
  ): Promise<Order[] | undefined> {
    return await new OrderService().getAllOrders(
      productId,
      shopperId,
      vendorId
    );
  }

  @Post('')
  @SuccessResponse('201', 'Order Created')
  public async createOrder(
    @Body() order: NewOrder,
    @Query() vendorId: UUID
  ): Promise<Order | undefined> {
    return await new OrderService().create(order, vendorId);
  }

  @Get('shopperOrder')
  public async getAllShopperOrders(
    @Query() shopperId: UUID
  ): Promise<ShopperOrder[]> {
    const orders = await new OrderService().getAllShopperOrders(shopperId);
    return orders;
  }

  @Get('{orderId}')
  @Response('404', 'Not Found')
  public async getOrder(@Path() orderId: UUID): Promise<Order | undefined> {
    const order = await new OrderService().getOrder(orderId);
    return order ?? this.setStatus(404);
  }

  @Delete('{orderId}')
  @Response('404', 'Not Found')
  public async deleteOrder(@Path() orderId: UUID): Promise<Order | undefined> {
    const order = await new OrderService().deleteOrder(orderId);
    return order ?? this.setStatus(404);
  }

  @Put('{orderId}')
  @Response('404', 'Not Found')
  @SuccessResponse('201', 'Updated')
  public async updateOrder(
    @Path() orderId: UUID,
    @Query('quantity') quantity?: Quantity,
    @Query('shipped') shipped?: boolean,
    @Query('delivered') delivered?: boolean
  ): Promise<Order | undefined> {
    const updates = {
      quantity: quantity,
      shipped: shipped,
      delivered: delivered,
    };
    const order = await new OrderService().updateOrder(orderId, updates);
    return order ?? this.setStatus(404);
  }

  @Get('shopperOrder/{orderId}')
  @Response('404', 'Not Found')
  public async getShopperOrder(
    @Path() orderId: UUID
  ): Promise<ShopperOrder | undefined> {
    const order = await new OrderService().getShopperOrder(orderId);
    return order ?? this.setStatus(404);
  }

  @Post('shopperOrder')
  @SuccessResponse('201', 'Shopper Order Created')
  public async createShopperOrder(
    @Body() order: ShopperOrder,
    @Query() shopperId: UUID
  ): Promise<(ShopperOrder & ShopperOrderId) | undefined> {
    return await new OrderService().createShopperOrder(order, shopperId);
  }

  @Post('shopperOrder/orderProduct')
  @SuccessResponse('201', 'Shopper Order Created')
  public async createOrderProduct(
    @Body() orderProduct: OrderProduct
  ): Promise<(OrderProduct & OrderProductId) | undefined> {
    return await new OrderService().createOrderProduct(orderProduct);
  }
}
