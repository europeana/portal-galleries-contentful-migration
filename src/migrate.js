const { migrationOptions } = require('./config');
const { create } = require('./create');
const { image } = require('./image');
const { load } = require('./load');
const { metadata } = require('./metadata');

const recordIdFromPortalUrl = (url) => {
  return url.match(/\/record(\/[^/]+\/[^/.?#]+)/)[1];
};

const migrateGallery = async(sourceGallery) => {
  console.log(`Migrating gallery ${sourceGallery.slug}`);

  const recordIds = sourceGallery['image_portal_urls'].map((url) => recordIdFromPortalUrl(url));

  console.log('- Fetching metadata from Record API');
  const imagesMetadata = await metadata(recordIds);

  console.log('- Creating Contentful entries for images');
  const imageEntrySysIds = [];
  for (const imageMetadata of imagesMetadata) {
    console.log(`  - For Record ID ${imageMetadata.identifier}`);
    const imageEntry = await image(imageMetadata);
    console.log(`    - sys.id: ${imageEntry.sys.id}`);
    imageEntrySysIds.push(imageEntry.sys.id);
  }

  console.log('- Creating Contentful entry for gallery');
  const galleryEntry = await create(sourceGallery, imageEntrySysIds);
  console.log(`  - sys.id: ${galleryEntry.sys.id}`);
  return galleryEntry;
};

const galleryIsToBeMigrated = (sourceGallery) => {
  return !Array.isArray(migrationOptions.gallerySlugs) ||
    migrationOptions.gallerySlugs.includes(sourceGallery.slug);
};

const migrate = async() => {
  console.log('Loading galleries from PostgreSQL');

  const sourceGalleries = await load();

  for (const sourceGallery of sourceGalleries) {
    if (galleryIsToBeMigrated(sourceGallery)) await migrateGallery(sourceGallery);
  }
};

const cli = async() => {
  await migrate();
};

module.exports = {
  migrate,
  cli
};
