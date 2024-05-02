import {UUID} from 'src/types';
import {NewProduct, Product} from '.';
import {pool} from '../db';
export class ProductService {
  public async exists(productId: UUID, vendorId?: UUID) {
    let select = `SELECT * FROM product WHERE id = $1::UUID`;
    const values = [productId];

    if (vendorId) {
      select += ` AND vendor_id = $${values.length + 1}::UUID`;
      values.push(vendorId);
    }

    const query = {
      text: select,
      values,
    };

    const {rows} = await pool.query(query);
    return rows[0];
  }

  public async isActive(productId: UUID): Promise<boolean> {
    const select = `SELECT active FROM product WHERE id = $1::UUID`;
    const query = {
      text: select,
      values: [productId],
    };
    const {rows} = await pool.query(query);
    return rows[0].active;
  }

  public async create(
    product: NewProduct,
    vendor_id?: UUID
  ): Promise<Product | undefined> {
    if (vendor_id) {
      const insert = `INSERT INTO product(vendor_id, data) VALUES ($1::UUID, jsonb_build_object('name', $2::TEXT, 'price', $3::TEXT)) RETURNING *`;
      const query = {
        text: insert,
        values: [`${vendor_id}`, `${product.name}`, `${product.price}`],
      };
      const {rows} = await pool.query(query);
      return rows[0];
    }
    return undefined;
  }

  public async edit(
    productId: UUID,
    product: Product
  ): Promise<Product | undefined> {
    const update = `UPDATE product SET data = jsonb_build_object('name', $1::TEXT, 'price', $2::TEXT) WHERE id = $3::UUID RETURNING *`;
    const query = {
      text: update,
      values: [`${product.data.name}`, `${product.data.price}`, `${productId}`],
    };
    const {rows} = await pool.query(query);
    return rows[0];
  }

  public async activate(
    productId: UUID
  ): Promise<Product | undefined> {
    const update = `UPDATE product SET active = true WHERE id = $1::UUID RETURNING *`;
    const query = {
      text: update,
      values: [`${productId}`],
    };
    const {rows} = await pool.query(query);
    return rows[0];
  }

  public async deactivate(
    productId: UUID
  ): Promise<Product | undefined> {
    const update = `UPDATE product SET active = false WHERE id = $1::UUID RETURNING *`;
    const query = {
      text: update,
      values: [`${productId}`],
    };
    const {rows} = await pool.query(query);
    return rows[0];
  }

  public async getAll(
    vendorId?: UUID,
    active?: boolean,
    page: number = 1,
    pageSize: number = 25,
    search?: string,
    orderBy: string = 'posted_at',
    descending?: boolean
  ): Promise<Product[]> {
    // Base query
    let select = `SELECT * FROM product`;
    const values = [];
    const conditions = [];

    // Add conditions for each filter
    if (vendorId) {
      conditions.push(`vendor_id = $${values.length + 1}`);
      values.push(vendorId);
    }
    if (active) {
      conditions.push(`active = $${values.length + 1}`);
      values.push(active);
    }
    if (search) {
      conditions.push(`data->>'name' ILIKE $${values.length + 1}`);
      values.push(`%${search}%`);
    }

    // Append conditions to query
    if (conditions.length) {
      select += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Order by valid columns
    const validColumns = ['name', 'price', 'postedAt'];
    if (orderBy && validColumns.includes(orderBy)) {
      select += ` ORDER BY data->>'${orderBy}' ${descending ? 'DESC' : 'ASC'}`;
    }

    // Add limit and offset for pagination
    select += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(pageSize, (page - 1) * pageSize);

    const query = {
      text: select,
      values,
    };

    const {rows} = await pool.query(query);
    const products = rows.map((row) => row);
    return products;
  }

  public async getOne(productId: UUID): Promise<Product | undefined> {
    const select = `SELECT * FROM product WHERE id = $1::UUID`;
    const query = {
      text: select,
      values: [`${productId}`],
    };
    const {rows} = await pool.query(query);
    return rows[0];
  }
}
