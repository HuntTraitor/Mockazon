import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(3013, () => {
  console.log(`Key Service Server Running on port 3013`);
  console.log(
    `Key Service Auth API Testing UI: http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/docs/`
  );
});
