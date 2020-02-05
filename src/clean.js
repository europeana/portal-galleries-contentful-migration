const { contentfulManagementClient, contentfulPreviewClient, defaultLocale } = require('./config');

let contentfulManagementConnection;
(async function() {
  contentfulManagementConnection = await Promise.resolve(contentfulManagementClient.connect());
})();
const contentfulPreviewConnection = contentfulPreviewClient;

const deleteEntry = async(id) => {
  let entry = await contentfulManagementConnection.getEntry(id).catch(() => {
    console.log(`- couldn't load entry "${id}" skipping deletion`);
    return;
  });
  if (!entry) return;
  if (entry.sys.publishedVersion) {
    console.log(`- Unpublishing ${entry.sys.contentType.sys.id}`);
    entry = await entry.unpublish().catch((e) => {
      console.log('error unpublishing ' + JSON.stringify(e));
    });
  }

  console.log(`- Deleting ${entry.sys.contentType.sys.id}`);
  entry.delete().catch(async(e) => {
    console.log('error deleting'  + JSON.stringify(e));
    throw `Failed on ${id}`;
  });
};

// Returns true where a card is used exactly once, otherwise false.
async function deletableCard(card) {
  const cardUsageCount = await contentfulPreviewConnection.getEntries({
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

const getEntriesPage = async() => {
  const entries = await contentfulPreviewConnection.getEntries({
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
};

const clean = async() => {
  let entries;
  let totalIndex = 0; // Just used for logging
  while ((entries = await getEntriesPage()).length > 0) {
    console.log(`Procesing ${entries.length} galleries for deletion.`);
    for (const entry of entries) {
      totalIndex++;
      console.log(`Processing gallery ${entry.sys.id} (${totalIndex})`);
      // delete any associated record cards
      if (entry.fields.hasPart) {
        for (const card of entry.fields.hasPart) {
          const deletable = await deletableCard(card);
          if (deletable) await deleteEntry(card.sys.id);
        }
      }
      await deleteEntry(entry.sys.id);
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
