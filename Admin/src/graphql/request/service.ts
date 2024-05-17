import type { Request } from './schema';

/**
 * Service for Account
 */
export class RequestService {
  /**
   * Retrieves all books.
   * @return {Promise<Request[]>} A promise that resolves to an array of books.
   */
  async all(): Promise<Request[]> {
    const res = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/requests`
    );
    return res.json();
  }
}
