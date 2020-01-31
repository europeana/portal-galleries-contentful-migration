const gallery = {
  list: require('./src/load').cli,
  create: require('./src/create').cli,
  migrate: require('./src/migrate').cli
};

const act = async(scope, action, args) => {
  if (scope === 'gallery') {
    if (gallery[action]) return await gallery[action](args);
  }

  console.log(`Unknown action: ${scope} ${action}`);
  process.exit(1);
};

const scope = process.argv[2];
const action = process.argv[3];
act(scope, action, process.argv.slice(4));
