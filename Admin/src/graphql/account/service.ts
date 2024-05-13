import type { Account } from './schema';

/**
 * Service for Account
 */
export class AccountService {
  /**
   * Retrieves all books.
   * @return {Promise<Account[]>} A promise that resolves to an array of books.
   */
  async all(): Promise<Account[]> {
    const res = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/accounts`
    );
    return res.json();
  }
}
