const loadGalleries = require('./src/load');

const listGalleries = async() => {
  const galleries = await loadGalleries();
  console.log(JSON.stringify(galleries.rows, null, 2));
};

const act = async(scope, action) => {
  switch (`${scope}/${action}`) {
    case 'gallery/list':
      await listGalleries();
      break;
    default:
      console.log(`Unknown action: ${scope} ${action}`);
      process.exit(1);
  }
};

const scope = process.argv[2];
const action = process.argv[3];
act(scope, action);
