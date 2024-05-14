import {
  Controller,
  Get,
  Put,
  Route,
  Post,
  Response,
  Body,
  /*Query*/
} from "tsoa";

import { UUID, User } from "../types";
import { AdminService } from "./service";
import { Authenticated, Credentials } from "../types";
import { Account } from "./index";
// import { SessionUser } from "../types";

@Route("admin")
export class AdminController extends Controller {
  @Post("login")
  @Response("401", "Unauthorised")
  public async login(
    @Body() credentials: Credentials,
  ): Promise<Authenticated | undefined> {
    return new AdminService()
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

  // Not sure if this is necessary for now

  // @Get('check')
  // @Response("401", "Unauthorized")
  // public async check(
  //   @Query() accessToken: string
  // ): Promise<SessionUser | undefined> {
  //   return new AdminService()
  //     .check(accessToken)
  //     .then(
  //       async (
  //         account: SessionUser | undefined
  //       ): Promise<SessionUser | undefined> => {
  //         return account;
  //       }
  //     )
  //     .catch(() => {
  //       this.setStatus(401);
  //       return undefined;
  //     });
  // }

  // fetch all exsiting user accounts
  @Get("accounts")
  public async accounts(): Promise<Account[]> {
    return new AdminService().accounts();
  }

  // fetch all existing vendor requests
  @Get("requests")
  public async requests(): Promise<User[]> {
    return new AdminService().requests();
  }

  // suspend an existing account
  @Put("account/{id}/suspend")
  public async suspend(id: UUID): Promise<void> {
    console.log(id);
    return new AdminService().suspend(id);
  }

  // resume a suspended account
  @Put("account/{id}/resume")
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
