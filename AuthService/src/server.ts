import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(3010, () => {
  console.log(`Auth Service Server Running on port 3010`);
  console.log(
    `Auth Service API Testing UI: http://${process.env.MICROSERVICE_URL || 'localhost'}:3010/api/v0/docs/`
  );
});
