const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
console.log('Current directory:', __dirname);
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('All env vars starting with DATABASE:', Object.keys(process.env).filter(key => key.includes('DATABASE')));
