const fs = require('fs');

const { contentfulManagementClient, defaultLocale } = require('./config');

const langMap = (data) => {
  return {
    [defaultLocale]: data
  };
};

const dataForGallery = (gallery, images) => {
  return {
    fields: {
      name: langMap(gallery.title),
      identifier: langMap(gallery.slug),
      description: langMap(gallery.description),
      genre: langMap(gallery.topics),
      hasPart: langMap(images.map((id) => {
        return { sys: { type: 'Link', linkType: 'Entry', id } };
      })),
      datePublished: langMap(new Date(gallery.published_at))
    }
  };
};

const create = async(gallery, images) => {
  const data = dataForGallery(gallery, images);
  const contentfulConnection = await contentfulManagementClient.connect();

  const entry = await contentfulConnection.createEntry('imageGallery', data);
  entry.publish();

  return entry;
};

const cli = async(args) => {
  const galleryJsonPath = args[0];
  const imageIds = args[1];

  const galleryJson = await fs.readFileSync(galleryJsonPath, 'utf8');
  const gallery = JSON.parse(galleryJson);
  const images = imageIds.split(',');

  const entry = await create(gallery, images);

  console.log(JSON.stringify(entry, null, 2));
};

module.exports = {
  create,
  cli
};
