/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import http from 'http';
import supertest from 'supertest';

import * as db from './db';
import requestHandler from './requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen();
  return db.reset();
});

afterAll(done => {
  db.shutdown(() => {
    server.close(done);
  });
});

test('should return error', async () => {
  await supertest(server).get('/invalidurl').expect(404);
});
