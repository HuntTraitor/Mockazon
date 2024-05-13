import { Controller, Route, Post, Body, Get, Query } from "tsoa";

import { ShopperService } from "./service";

@Route("shopper")
export class ShopperController extends Controller {
  // sub stands for subject and is the unique google identifier
  @Get("login")
  public async getUserWithSub(@Query() sub: string) {
    const user = await new ShopperService().getUserWithSub(sub);
    if (!user) {
      this.setStatus(400);
    }
    return user;
  }

  // sub stands for subject and is the unique google identifier
  @Post("signup")
  public async createUserWithSub(
    @Body() data: { sub: string; email: string; name: string }
  ) {
    const user = await new ShopperService().createUserWithSub(data);
    if (!user) {
      this.setStatus(409);
      return;
    }
    return {
      id: user.id,
      accessToken: user.accessToken,
      name: user.data.name,
      email: user.data.email,
      role: user.data.role,
      sub: user.data.sub,
    };
  }
}
