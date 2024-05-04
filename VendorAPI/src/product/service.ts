/**
 * This service must communicate with the ProductService
 */

import { UUID } from "../types";
import type { NewProduct, Product } from "./index";

export class ProductService {
  async create(product: NewProduct, vendor_id?: UUID): Promise<Product> {
    console.log(`http://${process.env.MICROSERVICE_URL||'localhost'}:3011/api/v0/product?vendorId=b6aaab8e-8e76-4415-92d9-fcbf493777b2`)
    return new Promise((resolve, reject) => {
      fetch(`http://${process.env.MICROSERVICE_URL||'localhost'}:3011/api/v0/product?vendorId=b6aaab8e-8e76-4415-92d9-fcbf493777b2`, {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json()
        })
        .then((authenticated) => {
          resolve(authenticated)
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        })
    })
  }

  async setActiveStatus(productId: UUID, active: boolean): Promise<Product> {
    return new Promise((resolve, reject) => {
      fetch(`http://${process.env.MICROSERVICE_URL||'localhost'}:3011/api/v0/product/${productId}/setActiveStatus?active=${active}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json()
        })
        .then((authenticated) => {
          resolve(authenticated)
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        })
    })
  }
}
