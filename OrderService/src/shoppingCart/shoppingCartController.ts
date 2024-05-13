import {
  Body,
  Controller,
  Route,
  SuccessResponse,
  Query,
  Post,
  Get,
} from 'tsoa';

import { ShoppingCart, ShoppingCartInput, ShoppingCartItem } from '.';
import { ShoppingCartService } from './shoppingCartService';
import { UUID } from '../types';

@Route('shoppingCart')
export class ShoppingCartController extends Controller {
  @Post('')
  @SuccessResponse('201', 'Added to Shopping Cart')
  public async addToShoppingCart(
    @Body() order: ShoppingCartInput,
    @Query() vendorId: UUID
  ): Promise<ShoppingCartItem | undefined> {
    return await new ShoppingCartService().create(order, vendorId);
  }

  @Get('')
  public async getShoppingCart(
    @Query() shopperId: UUID
  ): Promise<ShoppingCart | undefined> {
    return await new ShoppingCartService().getShoppingCart(shopperId);
  }
}
