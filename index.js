const loadGalleries = require('./src/load');
const loadMetadata = require('./src/metadata');

const listGalleries = async() => {
  const galleries = await loadGalleries();
  console.log(JSON.stringify(galleries.rows, null, 2));
};

const listMetadata = async(args) => {
  const ids = args[0].split(',');
  const metadata = await loadMetadata(ids);
  console.log(JSON.stringify(metadata, null, 2));
};

const act = async(scope, action, args) => {
  switch (`${scope}/${action}`) {
    case 'gallery/list':
      await listGalleries();
      break;
    case 'gallery/metadata':
      await listMetadata(args);
      break;
    default:
      console.log(`Unknown action: ${scope} ${action}`);
      process.exit(1);
  }
};

const scope = process.argv[2];
const action = process.argv[3];
act(scope, action, process.argv.slice(4));
