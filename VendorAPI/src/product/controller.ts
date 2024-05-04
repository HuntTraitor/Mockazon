import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  Query,
  Request,
  Response,
  Route,
  SuccessResponse,
  Path,
} from "tsoa";
import { NewProduct, Product } from ".";
import { UUID } from "../types";
import { ProductService } from "./service";
import * as express from "express";

@Route("product")
export class ProductController extends Controller {
  @Post()
  @Response("401", "Unauthorised")
  @SuccessResponse("201", "Product Created")
  public async createProduct(
    @Body() product: NewProduct,
    @Request() request: express.Request,
  ): Promise<Product | undefined> {
    return await new ProductService().create(product, request.user?.id);
  }

  @Put("{productId}")
  @SuccessResponse("200", "Product Updated")
  @Response("404", "Product Not Found")
  public async editProduct(
    @Path() productId: UUID,
    @Body() product: NewProduct,
  ): Promise<Product | undefined> {
    return await new ProductService().edit(productId, product);
  }

  @Put('{productId}/setActiveStatus')
  @SuccessResponse('200', 'Product Status Updated')
  @Response('404', 'Product Not Found')
  public async setActiveStatus(
    @Path() productId: UUID,
    @Query() active: boolean
  ): Promise<Product | undefined> {
    return await new ProductService().setActiveStatus(productId, active);
  }
}
