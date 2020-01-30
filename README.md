# portal-galleries-contentful-migration
Node.js scripts to migrate Portal galleries to from SQL to Contentful

## Configuration

Copy .env.example to .env and populate all variables.

## Usage

### List galleries

To read galleries from the SQL database and output as JSON:
```
npm run gallery list
```

### Fetch record metadata

To fetch metadata from the Europeana Record API and output as JSON:
```
npm run gallery metadata europeana_id1,europeana_id2,europeana_id3
```
