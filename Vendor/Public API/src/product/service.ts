/**
 * This service must communicate with the ProductService
 */

import { UUID } from '../types'
import type { NewProduct, Product } from './index'

export class ProductService{
  async create(product:NewProduct, vendor_id?: UUID): Promise<Product> {
    const res = await fetch('http://localhost:3013/api/v0/product', {
        method: 'POST',
        body: JSON.stringify(product, vendor_id),
    })
    return res.json()
  }
}