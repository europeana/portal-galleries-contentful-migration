const action = process.argv[2];

const migrate = require('./src/migrate');

switch (action) {
  case 'migrate':
    migrate();
    break;
  default:
    console.log(`Unknown action: ${action}`);
    process.exit(1);
}
