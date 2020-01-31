const { contentfulManagementClient, contentfulDelieveryClient } = require('./config');

const defaultLangCode = 'en-GB';

const deleteEntry = async(id) => {
  const contentfulManagementConnection = await contentfulManagementClient.connect();
  let entry = await contentfulManagementConnection.getEntry(id).catch((e) => {
    console.log(`couldn't load entry: ${id}\n` + e.toString());
    return;
  });

  if (entry.sys.publishedVersion) {
    console.log(`unpublish ${entry.sys.contentType.sys.id}`);
    entry = await entry.unpublish().catch((e) => {
      console.log('error unpublishing ' + JSON.stringify(e));
    });
  }

  console.log(`delete ${entry.sys.contentType.sys.id}`);
  await entry.delete().catch(async(e) => {
    console.log('error deleting'  + JSON.stringify(e));
  });
};

// https://stackoverflow.com/a/46842181/738371
async function asyncFilter(arr, callback) {
  const fail = Symbol();
  return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i=>i!==fail);
}

const clean = async() => {
  const contentfulDeliveryConnection = await contentfulDelieveryClient;
  const entries = await contentfulDeliveryConnection.getEntries({
    'locale': defaultLangCode,
    'content_type': 'imageGallery',
    'include': 4
  })
    .then((response) => {
      return response.items;
    })
    .catch((e) => {
      console.log('error retrieving gallery data. \n' + JSON.stringify(e));
    });
  for (let index = 0; index < entries.length; index++) {
    // delete any associated record cards
    if (entries[index].fields.hasPart) {
      let cards = await asyncFilter(entries[index].fields.hasPart, (async(card) => {
        const cardUsageCount = await contentfulDeliveryConnection.getEntries({
          'links_to_entry': card.sys.id
        })
          .then((response) => {
            return response.items.length;
          })
          .catch((e) => {
            console.log('error retrieving card usage data. \n' + JSON.stringify(e));
            return 0;
          });
        return cardUsageCount === 1;
      }));

      for (let nestedIndex = 0; nestedIndex < cards.length; nestedIndex++) {
        await deleteEntry(cards[nestedIndex].sys.id);
      }
    }

    await deleteEntry(entries[index].sys.id);
  }
};

const cli = async() => {
  await clean();
  console.log('Clean complete');
};

module.exports = {
  clean,
  cli
};
