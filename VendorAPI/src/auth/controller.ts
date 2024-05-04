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
import { Credentials, Authenticated, Buisness } from ".";
import { AuthService } from "./service";
import * as express from "express";
import { ApiKey } from "../types";
import { VendorInfo } from ".";

@Route("request")
export class AuthController extends Controller {
  @Post()
  @Response("401", "Unauthorized")
  public async request(
    @Body() vendor: VendorInfo,
    @Body() buisness: Buisness,
  ): Promise<{"message": string}> {
    return {
      "message": "Request sent sucessfully!"
    };
  }
}
