import { Controller, Route, Post, Body } from "tsoa";

import { ShopperService } from "./service";
import { CreateUserInput, LoginInput } from ".";

@Route("shopper")
export class ShopperController extends Controller {
  // sub stands for subject and is the unique google identifier
  @Post("login")
  public async login(@Body() loginInput: LoginInput) {
    const { sub, email, password } = loginInput;

    if (sub || (email && password)) {
      const user = await new ShopperService().login(loginInput);
      if (!user) {
        this.setStatus(404);
      }
      return user;
    } else {
      this.setStatus(400);
    }
  }

  // sub stands for subject and is the unique google identifier
  @Post("signup")
  public async createUser(@Body() data: CreateUserInput) {
    const { name, email, sub, password } = data;

    if (!name || !email || (name && !sub && !password) || (sub && password)) {
      this.setStatus(400);
      return;
    }

    const user = await new ShopperService().createUser(data);
    if (!user) {
      this.setStatus(409);
      return;
    }

    return { id: user.id, accessToken: user.accessToken, ...user.data };
  }
}
