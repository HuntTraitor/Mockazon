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
import * as express from 'express';
import { NewProduct, Product } from '.';
import { ProductService } from './productService';
@Route('product')
export class ProductController extends Controller {
  @Post()
  @Response('401', 'Unauthorised')
  @SuccessResponse('201', 'Product Created')
  public async createProduct(
    @Body() product: NewProduct,
    @Request() request: express.Request
  ): Promise<Product|undefined> {
    return await new ProductService().create(product, request.user?.id);
  }
}