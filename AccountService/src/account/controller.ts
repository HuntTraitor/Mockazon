import { Controller, Get, Route } from "tsoa";

import { User } from ".";
import { UserService } from "./service";

@Route("user")
export class UserController extends Controller {
  @Get("")
  public async getAll(): Promise<User[]> {
    return new UserService().getAll();
  }
}
