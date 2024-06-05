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

  public async approve(id: string): Promise<Account> {
    return new Promise(resolve => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/requests/${id}/approve`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then(res => {
          return res.json();
        })
        .then(json => {
          resolve(json);
        });
    });
  }

  public async reject(id: string): Promise<Account> {
    return new Promise(resolve => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/requests/${id}/reject`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then(res => {
          return res.json();
        })
        .then(json => {
          resolve(json);
        });
    });
  }

  public async suspend(id: string): Promise<Account> {
    return new Promise(resolve => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/account/${id}/suspend`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then(res => {
          return res.json();
        })
        .then(json => {
          resolve(json);
        });
    });
  }

  public async resume(id: string): Promise<Account> {
    return new Promise(resolve => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/account/${id}/resume`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then(res => {
          return res.json();
        })
        .then(json => {
          resolve(json);
        });
    });
  }
}
