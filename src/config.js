require('dotenv').config();

const { Client } = require('pg');
const contentfulManagement = require('contentful-management');
const contetnfulDelivery = require('contentful');

const pgClient = new Client({
  connectionString: process.env['PG_URL']
});

const contentfulManagementClient = contentfulManagement.createClient({
  accessToken: process.env['CTF_CMA_ACCESS_TOKEN']
});

contentfulManagementClient.connect = async function() {
  const space = await this.getSpace(process.env['CTF_SPACE_ID']);
  const environment = await space.getEnvironment(process.env['CTF_ENVIRONMENT_ID']);
  return environment;
};

const contentfulDelieveryClient = contetnfulDelivery.createClient({
  accessToken: process.env['CTF_CDA_ACCESS_TOKEN'],
  space: process.env['CTF_SPACE_ID'],
  environment: process.env['CTF_ENVIRONMENT_ID']
});

const europeanaRecordApiKey = process.env['EUROPEANA_RECORD_API_KEY'];

const migrationOptions = {
  gallerySlugs: process.env['MIGRATE_GALLERY_SLUGS'] ? process.env['MIGRATE_GALLERY_SLUGS'].split(',') : false
};

module.exports = {
  pgClient,
  contentfulManagementClient,
  contentfulDelieveryClient
  defaultLocale: 'en-GB',
  europeanaRecordApiKey,
  migrationOptions
};
