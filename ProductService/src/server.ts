import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(3011, () => {
  console.log(`Product Service Server Running on port 3011`);
  console.log(
    `Product Service API Testing UI: http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/docs/`
  );
});
