import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Query,
  Put,
  Response,
  Get,
  Path,
} from 'tsoa';
import { NewProduct, Product, NewReview, Review } from '.';
import { UUID } from '../types';
import { ProductService } from './productService';

@Route('product')
export class ProductController extends Controller {
  @Get()
  @SuccessResponse('200', 'Products Retrieved')
  public async getProducts(
    @Query() vendorId?: UUID,
    @Query() active?: boolean,
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() search?: string,
    @Query() orderBy?: string,
    @Query() descending?: boolean
  ): Promise<Product[] | undefined> {
    return await new ProductService().getAll(
      vendorId,
      active,
      page,
      pageSize,
      search,
      orderBy,
      descending
    );
  }

  @Get('{productId}')
  @SuccessResponse('200', 'Product Retrieved')
  @Response('404', 'Product Not Found')
  public async getProduct(
    @Path() productId: UUID
  ): Promise<Product | undefined> {
    const product = await new ProductService().getOne(productId);
    if (!product) {
      this.setStatus(404);
    }
    return product;
  }

  @Get('suggestions')
  @SuccessResponse('200', 'Suggestions Retrieved')
  @Response('400', 'Bad Request')
  @Response('404', 'No Suggestions Found')
  public async getSearchSuggestions(
    @Query() search: string
  ): Promise<string[] | undefined> {
    console.log(`Received search query: ${search}`);
    if (!search) {
      console.error('Search query is required');
      this.setStatus(400);
      return;
    }
    try {
      const suggestions = await new ProductService().getSearchSuggestions(
        search
      );
      console.log(`Suggestions found: ${suggestions}`);
      return suggestions;
    } catch (error) {
      console.error('Error retrieving suggestions:', error);
      this.setStatus(500);
      return;
    }
  }

  @Post()
  @SuccessResponse('201', 'Product Created')
  public async createProduct(
    @Body() product: NewProduct,
    @Query() vendorId: UUID
  ): Promise<Product | undefined> {
    // FIXME: Do we want to stop duplicate products from being created? As in same vendor ID same name?
    // Could address this in the Vendor API.
    return await new ProductService().create(product, vendorId);
  }

  @Put('{productId}')
  @SuccessResponse('200', 'Product Updated')
  @Response('404', 'Product Not Found')
  public async editProduct(
    @Body() product: NewProduct,
    @Path() productId: UUID
  ): Promise<Product | undefined> {
    // FIXME: Should ownership be checked in the microservice?
    const updatedProduct = await new ProductService().edit(productId, product);
    if (!updatedProduct) {
      this.setStatus(404);
    }
    return updatedProduct;
  }

  @Put('{productId}/setActiveStatus')
  @SuccessResponse('200', 'Product Status Updated')
  @Response('404', 'Product Not Found')
  public async setActiveStatus(
    @Path() productId: UUID,
    @Query() active: boolean
  ): Promise<Product | undefined> {
    if (!(await new ProductService().getOne(productId))) {
      this.setStatus(404);
      return undefined;
    }
    if (active) {
      return await new ProductService().activate(productId);
    } else {
      return await new ProductService().deactivate(productId);
    }
  }

  @Post('{productId}/review')
  @SuccessResponse('201', 'Review Created')
  @Response('404', 'Product Not Found')
  public async createReview(
    @Path() productId: UUID,
    @Body() review: NewReview,
    @Query() userId: UUID
  ): Promise<Review | undefined> {
    if (!(await new ProductService().getOne(productId))) {
      this.setStatus(404);
      return undefined;
    }
    return await new ProductService().createReview(productId, review, userId);
  }

  @Get('{productId}/review')
  @SuccessResponse('200', 'Reviews Retrieved')
  @Response('404', 'Product Not Found')
  public async getReviews(
    @Path() productId: UUID
  ): Promise<Review[] | undefined> {
    if (!(await new ProductService().getOne(productId))) {
      this.setStatus(404);
      return undefined;
    }
    return await new ProductService().getReviews(productId);
  }
}
