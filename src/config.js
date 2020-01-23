require('dotenv').config();

const { Client } = require('pg');
const contentful = require('contentful-management');

const pgClient = new Client({
  user: process.env.pgUser,
  host: process.env.pgHost,
  database: process.env.pgDatabase,
  port: process.env.pgPort
});

const contentfulClient = contentful.createClient({
  accessToken: process.env.contentfulAccessToken,
  space: process.env.contentfulSpaceId,
  environment: process.env.contentfulEnvironmentId
});

module.exports = {
  pgClient,
  contentfulClient
};
