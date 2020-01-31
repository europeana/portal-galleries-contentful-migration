require('dotenv').config();

const { Client } = require('pg');
const contentful = require('contentful-management');

const pgClient = new Client({
  connectionString: process.env['PG_URL']
});

const contentfulClient = contentful.createClient({
  accessToken: process.env['CTF_CMA_ACCESS_TOKEN']
});
contentfulClient.connect = async function() {
  const space = await this.getSpace(process.env['CTF_SPACE_ID']);
  const environment = await space.getEnvironment(process.env['CTF_ENVIRONMENT_ID']);
  return environment;
};

module.exports = {
  pgClient,
  contentfulClient
};
