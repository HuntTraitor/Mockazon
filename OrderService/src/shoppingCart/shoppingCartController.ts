import {
  Body,
  Controller,
  Route,
  SuccessResponse,
  Query,
  Post,
  Get,
  Delete,
} from 'tsoa';

import {
  ShoppingCart,
  ShoppingCartInput,
  ShoppingCartItem,
  ShoppingCartRemoveInput,
} from '.';
import { ShoppingCartService } from './shoppingCartService';
import { UUID } from '../types';

@Route('shoppingCart')
export class ShoppingCartController extends Controller {
  @Post('')
  @SuccessResponse('201', 'Added to Shopping Cart')
  public async addToShoppingCart(
    @Body() order: ShoppingCartInput
  ): Promise<ShoppingCartItem | undefined> {
    return await new ShoppingCartService().addToShoppingCart(order);
  }

  @Get('')
  public async getShoppingCart(
    @Query() shopperId: UUID
  ): Promise<ShoppingCart | undefined> {
    return await new ShoppingCartService().getShoppingCart(shopperId);
  }

  @Delete('')
  @SuccessResponse('201', 'Removed from Shopping Cart')
  public async removeFromShoppingCart(
    @Body() order: ShoppingCartRemoveInput
  ): Promise<ShoppingCartRemoveInput | undefined> {
    return await new ShoppingCartService().removeFromShoppingCart(order);
  }
}
