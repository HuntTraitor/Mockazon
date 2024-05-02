import {
  Post,
  Route,
  Response,
  Body,
  Controller,
  Get,
  Security,
  Request,
} from "tsoa";
import { Credentials, Authenticated } from ".";
import { AuthService } from "./service";
import * as express from "express";

@Route("login")
export class AuthController extends Controller {
  @Post()
  @Response("401", "Unauthorized")
  public async login(
    @Body() credentials: Credentials,
  ): Promise<Authenticated | undefined> {
    return new AuthService().login(credentials);
  }
}
