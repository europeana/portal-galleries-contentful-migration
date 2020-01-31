const fs = require('fs');

const { contentfulClient, defaultLocale } = require('./config');

const locales = require('../data/locales');

// ## l10n
// - if the data argument is a lang map:
//   - then for each language in it:
//     - if it is a UI language of portal.js:
//       - normalise code to iso 'en-GB' format
//       - add to return value keyed by normalised code
//   - if 'en-GB' is still not present, pick a value for it from: und, def, anything
// - if not a lang map, return the value as an object keyed with 'en-GB' only
// - arrays of strings should be concatenated with '; '
const localise = (data) => {
  if (typeof data !== 'object') {
    return {
      [defaultLocale]: stringify(data)
    };
  }

  const map = {};
  for (const locale in data) {
    if (locales[locale]) {
      map[locales[locale]] = stringify(data[locale]);
    }
  }

  // TODO: prefer record's LANGUAGE over def and und?
  if (!map[defaultLocale]) {
    if (data['def']) {
      map[defaultLocale] = stringify(data['def']);
    } else if (data['und']) {
      map[defaultLocale] = stringify(data['und']);
    } else {
      map[defaultLocale] = stringify(Object.values(data)[0]);
    }
  }

  return map;
};

const stringify = (value) => {
  let string;
  if (typeof value === 'string') {
    string = value;
  } else if (Array.isArray(value)) {
    string = value.join('; ');
  } else {
    throw new Error(`Unhandled value type: ${value}`);
  }
  return string;
};

const dataForImage = (metadata) => {
  return {
    fields: {
      identifier: localise(metadata.identifier),
      name: localise(metadata.name),
      creator: localise(metadata.creator),
      provider: localise(metadata.provider),
      thumbnailUrl: localise(metadata.thumbnailUrl)
    }
  };
};

const image = async(metadata) => {
  const data = dataForImage(metadata);

  const contentfulConnection = await contentfulClient.connect();

  const entry = await contentfulConnection.createEntry('automatedRecordCard', data);
  await entry.publish();

  return entry;
};

const cli = async(args) => {
  const metadataJsonPath = args[0];
  const metadataJson = await fs.readFileSync(metadataJsonPath, 'utf8');
  const metadata = JSON.parse(metadataJson);

  const imageEntry = await image(metadata);

  console.log(JSON.stringify(imageEntry, null, 2));
};

module.exports = {
  image,
  cli
};
