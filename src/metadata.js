const axios = require('axios');
const { europeanaRecordApiKey } = require('./config');

const europeanaRecordApiOrigin = 'https://api.europeana.eu';
const europeanaRecordApiSearchUrl = `${europeanaRecordApiOrigin}/api/v2/search.json`;

const imageMetadata = (item) => {
  return {
    identifier: item.id,
    name: item.dcTitleLangAware || item.dcDescriptionLangAware,
    creator: item.dcCreatorLangAware,
    provider: item.dataProvider,
    thumbnailUrl: item.edmPreview
  };
};

const metadata = async(ids) => {
  const query = 'europeana_id:("' + ids.join('" OR "') + '")';

  const response = await axios.get(europeanaRecordApiSearchUrl, {
    params: {
      query,
      profile: 'minimal',
      wskey: europeanaRecordApiKey
    }
  });

  return response.data.items.map((item) => imageMetadata(item));
};

const cli = async(args) => {
  const ids = args[0].split(',');
  const galleryMetadata = await metadata(ids);
  console.log(JSON.stringify(galleryMetadata, null, 2));
};

module.exports = {
  metadata,
  cli
};
