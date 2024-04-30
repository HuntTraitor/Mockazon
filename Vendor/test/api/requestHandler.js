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
/*
#######################################################################
#                   DO NOT MODIFY THIS FILE
#######################################################################
*/

const glob = require('glob');
const path = require('path');
const { apiResolver } = require('next/dist/server/api-utils/node/api-resolver');

const rootPath = path.resolve('.');
const nextPagesDirectory = `${rootPath}/src/pages`;

const handlers = glob
  .sync(`${nextPagesDirectory}/api/**/*.ts`)
  .map(handler => handler.slice(nextPagesDirectory.length, -3));

const mapping = {};
handlers.forEach(handler => {
  mapping[handler] = require(`${nextPagesDirectory}${handler}`);
});

const requestHandler = (request, response) => {
  return apiResolver(
    Object.assign(request, { connection: { remoteAddress: 'localhost' } }),
    response,
    {},
    mapping[request.url],
    undefined,
    true
  );
};

export default requestHandler;
