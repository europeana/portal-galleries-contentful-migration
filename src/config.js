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
  accessToken: process.env.contentfulAccessToken
});
contentfulClient.connect = async function() {
  const space = await this.getSpace(process.env.contentfulSpaceId);
  const environment = await space.getEnvironment(process.env.contentfulEnvironmentId);
  return environment;
};

module.exports = {
  pgClient,
  contentfulClient
};
