import { Controller, Route, Response, Post, Body, SuccessResponse } from "tsoa";

import { CreateVendor, Vendor } from "./index";
import { VendorService } from "./service";
import { Authenticated, Credentials } from "../types";

@Route("vendor")
export class VendorController extends Controller {
  @Post("login")
  @Response("401", "Unauthorised")
  public async login(
    @Body() credentials: Credentials,
  ): Promise<Authenticated | undefined> {
    return new VendorService()
      .login(credentials)
      .then(
        async (
          user: Authenticated | undefined,
        ): Promise<Authenticated | undefined> => {
          if (!user) {
            this.setStatus(401);
          }
          return user;
        },
      );
  }

  @Post("signup")
  @SuccessResponse("201", "Account Created")
  public async createVendor(
    @Body() credentials: CreateVendor,
  ): Promise<Vendor | undefined> {
    const user = await new VendorService().createVendorAccount(credentials);
    if (!user) {
      this.setStatus(400);
      return;
    }
    return {
      id: user.id,
      name: user.data.name,
      email: user.data.email,
      role: user.data.role,
    };
  }
}
