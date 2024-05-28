/* eslint-disable @typescript-eslint/no-var-requires */
/* https://chatgpt.com/share/9db69229-664a-4ae3-bdce-03755afc1dc0 */
const fs = require('fs');
const path = require('path');

const isProd = process.env.ENVIRONMENT == 'production';

// Define the TSOA configuration
const tsoaConfig = {
  entryFile: 'src/app.ts',
  noImplicitAdditionalProperties: 'throw-on-extras',
  controllerPathGlobs: ['src/**/*[cC]ontroller.ts'],
  spec: {
    outputDirectory: 'build',
    specVersion: 3,
    schemes: ['http'],
    basePath: isProd ? '/vendorapi/v0' : '/v0',
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey',
        name: 'X-API-KEY',
        in: 'header',
      },
    },
  },
  routes: {
    routesDir: 'build',
    authenticationModule: './src/auth/expressAuth.ts',
  },
};

// Write the TSOA configuration to a file
const outputPath = path.resolve(__dirname, 'tsoa.json');
fs.writeFileSync(outputPath, JSON.stringify(tsoaConfig, null, 2));
console.log(`TSOA configuration written to ${outputPath}`);
