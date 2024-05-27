import { Controller, Route, Post, Body, Get, Query, Response } from "tsoa";

import { ShopperService } from "./service";
import { CreateUserInput, LoginInput, ShippingAddress } from ".";
import { SessionUser } from "../types";

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

  @Get("check")
  @Response("401", "Unauthorized")
  public async check(
    @Query() accessToken: string,
  ): Promise<SessionUser | undefined> {
    return new ShopperService()
      .check(accessToken)
      .then(
        async (
          account: SessionUser | undefined,
        ): Promise<SessionUser | undefined> => {
          return account;
        },
      )
      .catch(() => {
        this.setStatus(401);
        return undefined;
      });
  }

  @Get("shippinginfo")
  public async getShippingInfo(@Query() userId: string) {
    const userData = await new ShopperService().getShippingInfo(userId);
    if (!userData) {
      this.setStatus(404);
    }
    return userData;
  }

  @Post("shippinginfo")
  public async createShippingInfo(
    @Query() userId: string,
    @Body() shippingInfo: ShippingAddress,
  ) {
    try {
      const userData = await new ShopperService().createShippingInfo({
        userId,
        shippingInfo,
      });
      return userData;
    } catch (error) {
      this.setStatus(404);
    }
  }
}
