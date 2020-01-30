const fs = require('fs');

const loadGalleries = require('./src/load');
const createGallery = require('./src/create');

const listGalleries = async() => {
  const galleries = await loadGalleries();
  console.log(JSON.stringify(galleries.rows, null, 2));
};

const createGalleryFromFiles = async(galleryJsonPath, imageIds) => {
  const galleryJson = await fs.readFileSync(galleryJsonPath, 'utf8');
  const gallery = JSON.parse(galleryJson);
  const images = imageIds.split(',');
  const entry = await createGallery(gallery, images);
  console.log(JSON.stringify(entry, null, 2));
};

const act = async(scope, action, args) => {
  switch (`${scope}/${action}`) {
    case 'gallery/list':
      await listGalleries();
      break;
    case 'gallery/create':
      await createGalleryFromFiles(args[0], args[1]);
      break;
    default:
      console.log(`Unknown action: ${scope} ${action}`);
      process.exit(1);
  }
};

const scope = process.argv[2];
const action = process.argv[3];
act(scope, action, process.argv.slice(4));
