import { Body, Controller, Get, Post, Query, Request, Response, Route, SuccessResponse } from "tsoa";
import { NewProduct, Product } from ".";
import { ProductService } from "./service";
import * as express from "express";

@Route("product")
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