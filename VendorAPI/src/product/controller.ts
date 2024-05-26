import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Response,
  Route,
  SuccessResponse,
  Security,
} from 'tsoa';
import { NewProduct, Product } from '.';
import { ProductService } from './service';
import * as express from 'express';

@Route('product')
export class ProductController extends Controller {
  @Get()
  @Security('ApiKeyAuth')
  @SuccessResponse('200', 'Products Retrieved')
  public async getProducts(
    @Request() request: express.Request,
    @Query() active?: boolean,
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() search?: string,
    @Query() orderBy?: string,
    @Query() descending?: boolean
  ): Promise<Product[] | undefined> {
    return await new ProductService().getProducts(
      request.user?.id,
      active,
      page,
      pageSize,
      search,
      orderBy,
      descending
    );
  }

  @Post()
  @Security('ApiKeyAuth')
  @Response('401', 'Unauthorised')
  @SuccessResponse('201', 'Product Created')
  public async createProduct(
    @Body() product: NewProduct,
    @Request() request: express.Request
  ): Promise<Product | undefined> {
    return await new ProductService().create(product, request.user?.id);
  }

  // @Put('{productId}')
  // @SuccessResponse('200', 'Product Updated')
  // @Response('404', 'Product Not Found')
  // public async editProduct(
  //   @Path() productId: UUID,
  //   @Body() product: NewProduct
  // ): Promise<Product | undefined> {
  //   return await new ProductService().edit(productId, product);
  // }

  // @Put('{productId}/setActiveStatus')
  // @SuccessResponse('200', 'Product Status Updated')
  // @Response('404', 'Product Not Found')
  // public async setActiveStatus(
  //   @Path() productId: UUID,
  //   @Query() active: boolean
  // ): Promise<Product | undefined> {
  //   return await new ProductService().setActiveStatus(productId, active);
  // }

  // @Get('{productId}/review')
  // @SuccessResponse('200', 'Product Reviews Retrieved')
  // @Response('404', 'Product Not Found')
  // public async getProductReviews(
  //   @Path() productId: UUID
  // ): Promise<Product | undefined> {
  //   return await new ProductService().getProductReviews(productId);
  // }
}
