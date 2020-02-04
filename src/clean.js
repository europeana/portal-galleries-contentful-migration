const { contentfulManagementClient, contentfulDelieveryClient, defaultLocale } = require('./config');

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
    throw `Failed on ${id}`;
  });
};

// https://stackoverflow.com/a/46842181/738371
async function asyncFilter(arr, callback) {
  const fail = Symbol();
  return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i=>i!==fail);
}

// Returns true where a card is used exactly once, otherwise false.
async function deletableCard(card, contentfulDeliveryConnection) {
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
}

const getEntryPage = async(contentfulDeliveryConnection) => {
  const entries = await contentfulDeliveryConnection.getEntries({
    'locale': defaultLocale,
    'content_type': 'imageGallery',
    'include': 2
  })
    .then((response) => {
      return response.items;
    })
    .catch((e) => {
      console.log('error retrieving gallery data. \n' + JSON.stringify(e));
    });
  return entries || [];
}
const clean = async() => {
  const contentfulDeliveryConnection = await contentfulDelieveryClient;
  let entries;
  while ((entries = await getEntryPage(contentfulDeliveryConnection)).length > 0) {
    console.log(`Procesing ${entries.length} galleries for deletion.`);
    for (let index = 0; index < entries.length; index++) {
      console.log(`Processing gallery ${entries[index].sys.id}`);
      // delete any associated record cards
      if (entries[index].fields.hasPart) {
        let cards = await asyncFilter(entries[index].fields.hasPart, (card) => {
          return deletableCard(card, contentfulDeliveryConnection);
        });
        for (let nestedIndex = 0; nestedIndex < cards.length; nestedIndex++) {
          await deleteEntry(cards[nestedIndex].sys.id);
        }
      }
      await deleteEntry(entries[index].sys.id);
    }
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
