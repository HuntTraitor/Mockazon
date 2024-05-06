import { Controller, Get, Put, Route } from "tsoa";

import { User, UUID } from "../types";
import { AccountService } from "./service";

@Route("account")
export class AccountController extends Controller {
  // fetch all exsiting user accounts
  @Get("")
  public async getAll(): Promise<User[]> {
    return new AccountService().getAll();
  }  

  // suspend an existing account
  @Put("{id}/suspend")
  public async suspend(id: UUID): Promise<void> {
    console.log(id);
    return new AccountService().suspend(id);
  }

  // resume a suspended account
  @Put("{id}/resume")
  public async resume(id: UUID): Promise<void> {
    console.log(id);
    return new AccountService().resume(id);
  }
}
