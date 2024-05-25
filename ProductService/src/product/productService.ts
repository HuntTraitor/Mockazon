import { UUID } from 'src/types';
import { NewProduct, Product, NewReview, Review } from '.';
import { pool } from '../db';

export class ProductService {
  public async create(
    product: NewProduct,
    vendor_id: UUID
  ): Promise<Product | undefined> {
    const insert = `INSERT INTO product(vendor_id, data) VALUES (
      $1::UUID, jsonb_build_object(
        'name', $2::TEXT, 
        'price', $3::TEXT,
        'properties', $4::JSONB
      )
    ) RETURNING *`;
    const query = {
      text: insert,
      values: [
        `${vendor_id}`,
        `${product.name}`,
        `${product.price}`,
        JSON.stringify(product.properties),
      ],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async edit(
    productId: UUID,
    product: NewProduct
  ): Promise<Product | undefined> {
    const update = `
      UPDATE product 
      SET data = jsonb_build_object(
        'name', $1::TEXT, 
        'price', $2::TEXT,
        'properties', $4::JSONB
      ) WHERE id = $3::UUID 
      RETURNING *
    `;
    const query = {
      text: update,
      values: [
        `${product.name}`,
        `${product.price}`,
        `${productId}`,
        JSON.stringify(product.properties),
      ],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async activate(productId: UUID): Promise<Product | undefined> {
    const update = `UPDATE product SET active = true, posted = NOW() AT TIME ZONE 'UTC' WHERE id = $1::UUID RETURNING *`;
    const query = {
      text: update,
      values: [`${productId}`],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async deactivate(productId: UUID): Promise<Product | undefined> {
    const update = `UPDATE product SET active = false WHERE id = $1::UUID RETURNING *`;
    const query = {
      text: update,
      values: [`${productId}`],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async getAll(
    vendorId?: UUID,
    active?: boolean,
    page: number = 1,
    pageSize: number = 25,
    search?: string,
    orderBy: string = 'posted',
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
    if (active !== undefined) {
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
    const validColumns = ['price', 'posted'];
    if (orderBy && validColumns.includes(orderBy)) {
      if (orderBy === 'price') {
        select += ` ORDER BY (data->>'${orderBy}')::numeric ${descending ? 'DESC' : 'ASC'}`;
      } else {
        select += ` ORDER BY ${orderBy} ${descending ? 'DESC' : 'ASC'}`;
      }
    }

    // Add limit and offset for pagination
    select += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(pageSize, (page - 1) * pageSize);

    const query = {
      text: select,
      values,
    };

    const { rows } = await pool.query(query);
    const products = rows.map(row => row);
    return products;
  }

  public async getOne(productId: UUID): Promise<Product | undefined> {
    const select = `SELECT * FROM product WHERE id = $1::UUID`;
    const query = {
      text: select,
      values: [`${productId}`],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async createReview(
    productId: UUID,
    review: NewReview,
    userId: UUID
  ): Promise<Review | undefined> {
    const insert = `
    WITH new_review AS (
      INSERT INTO review(reviewer_id, data)
      VALUES ($1::UUID, jsonb_build_object(
          'rating', $2::INT,
          'comment', $3::TEXT
      ))
      RETURNING *
    ), inserted_review AS (
      INSERT INTO product_review(reviewer_id, product_id)
      VALUES ($1::UUID, $4::UUID)
      RETURNING *
    )
    SELECT 
      r.id,
      pr.product_id,
      pr.reviewer_id,
      r.created,
      r.data
    FROM
      new_review r
    JOIN
      inserted_review pr ON r.reviewer_id = pr.reviewer_id
    `;

    const query = {
      text: insert,
      values: [`${userId}`, review.rating, review.comment, `${productId}`],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async getReviews(productId: UUID): Promise<Review[] | undefined> {
    const select = `
    SELECT
      r.id,
      pr.product_id,
      pr.reviewer_id,
      r.created,
      r.data
    FROM
        product_review pr
    JOIN
        review r ON pr.reviewer_id = r.reviewer_id
    WHERE
        pr.product_id = $1::UUID
    `;
    const query = {
      text: select,
      values: [`${productId}`],
    };
    const { rows } = await pool.query(query);
    return rows.map(row => row);
  }

  public async getSearchSuggestions(search: string): Promise<string[]> {
    const select = `SELECT DISTINCT data->>'name' FROM product WHERE data->>'name' ILIKE $1::TEXT LIMIT 10`;
    const query = {
      text: select,
      values: [`${search}%`],
    };

    const { rows } = await pool.query(query);
    let suggestions: string[] = rows.map(row => row.name);

    if (suggestions?.length < 10) {
      const select = `SELECT DISTINCT data->>'name' FROM product WHERE data->>'name' ILIKE $1::TEXT LIMIT 10`;
      const query = {
        text: select,
        values: [`%${search}%`],
      };
      const { rows } = await pool.query(query);
      suggestions.push(...rows.map(row => row.name));
      suggestions = suggestions.filter((value, index, self) => self.indexOf(value) === index);
      suggestions = suggestions.slice(0, 10);
    }

    return suggestions;
  }
}
