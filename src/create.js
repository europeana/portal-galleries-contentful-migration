const { contentfulClient } = require('./config');

const langMap = (data, locale = 'en-GB') => {
  return {
    [locale]: data
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

module.exports = async(gallery, images) => {
  const data = dataForGallery(gallery, images);
  const contentfulConnection = await contentfulClient.connect();

  const entry = await contentfulConnection.createEntry('imageGallery', data);
  await entry.publish();

  return entry;
};
