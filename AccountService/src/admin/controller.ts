import { Controller, Get, Put, Route } from "tsoa";

import { User, UUID } from "../types";
import { AdminService } from "./service";

@Route("admin")
export class AdminController extends Controller {
  

  // fetch all exsiting user accounts
  @Get("accounts")
  public async accounts(): Promise<User[]> {
    return new AdminService().accounts();
  }

  @Get("requests")
  public async requests(): Promise<User[]> {
    return new AdminService().requests();
  }

  // suspend an existing account
  @Put("{id}/suspend")
  public async suspend(id: UUID): Promise<void> {
    console.log(id);
    return new AdminService().suspend(id);
  }

  // resume a suspended account
  @Put("{id}/resume")
  public async resume(id: UUID): Promise<void> {
    console.log(id);
    return new AdminService().resume(id);
  }

  // approve inbound request || takes: {account_id} to be approved
  @Put("requests/{id}/approve")
  public async approve(id: string): Promise<void> {
    return new AdminService().approve(id);
  }

  // reject inbound request || takes: {account_id} to be rejected
  @Put("requests/{id}/reject")
  public async reject(id: string): Promise<void> {
    return new AdminService().reject(id);
  }
}
