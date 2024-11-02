import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();

if (process.env) {
  global.secret = process.env;
} else {
  console.error("Environment Variables not found");
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});