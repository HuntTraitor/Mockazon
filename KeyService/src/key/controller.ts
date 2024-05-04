import {  Controller, Get, Path, Post, Query, Response, Route, SuccessResponse } from "tsoa";

import { Key } from ".";

@Route('key')
export class KeyController extends Controller {
  @Post("{key}")
  @SuccessResponse('201', 'Accepted')
  public async accept(
    @Path() key: Key,
  ): Promise<Key | undefined> {
    return key;
  }
}