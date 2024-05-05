import { Controller, Get, Route } from "tsoa";

import { User } from ".";
import { AccountService } from "./service";

@Route("account")
export class AccountController extends Controller {
  @Get("")
  public async getAll(): Promise<User[]> {
    return new AccountService().getAll();
  }
}
