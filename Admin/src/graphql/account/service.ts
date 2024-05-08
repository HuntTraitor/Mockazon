import type { Account } from './schema';

/**
 * Service for Book
 */
export class AccountService {
  /**
   * Retrieves all books.
   * @return {Promise<Account[]>} A promise that resolves to an array of books.
   */
  async all(): Promise<Account[]> {
    const res = await fetch('http://localhost:3014/api/v0/account');
    return res.json();
  }
}
