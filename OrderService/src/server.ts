import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(3012, () => {
  console.log(`Order Service Server Running on port 3012`);
  console.log(
    `Order Service API Testing UI: http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/docs/`
  );
});
