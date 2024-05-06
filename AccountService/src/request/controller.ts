import { Controller, Get, Put, Route } from "tsoa";

import { User } from "../types";
import { RequestService } from "./service";

@Route("request")
export class RequestController extends Controller {
  // fetch all exsiting user accounts
  @Get("")
  public async getAll(): Promise<User[]> {
    return new RequestService().getAll();
  }  

  // create new inbound request || takes: {account_id} to be requested
  @Put("{id}/request")
  public async request(id: string): Promise<void> {
    return new RequestService().request(id);
  }

  // approve inbound request || takes: {account_id} to be approved
  @Put("{id}/approve")
  public async approve(id: string): Promise<void> {
    return new RequestService().approve(id);
  }

  // reject inbound request || takes: {account_id} to be rejected
  @Put("{id}/reject")
  public async reject(id: string): Promise<void> {
    return new RequestService().reject(id);
  }
}
