import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(3002, () => {
  console.log(`Server Running on port 3002`);
  console.log('Auth API Testing UI: http://localhost:3002/docs/');
});
