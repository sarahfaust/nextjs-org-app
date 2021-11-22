import { connectOneTimeToDatabase } from './util/database';

connectOneTimeToDatabase();

const options = {};

if (process.env.NODE_ENV === 'production') {
  options.ssl = { rejectUnauthorized: false };
}

module.exports = options;
