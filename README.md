# portal-galleries-contentful-migration
Node.js scripts to migrate Portal galleries to from SQL to Contentful

## Configuration

Copy .env.example to .env and populate all variables.

## Usage

### List galleries source data

To read galleries from the SQL database and output as JSON:
```
npm run gallery list
```
### Fetch record metadata

To fetch metadata from the Europeana Record API and output as JSON:
```
npm run gallery metadata europeana_id1,europeana_id2,europeana_id3
```

### Create gallery entry

To create one image gallery entry in Contentful:
```
npm run gallery create tmp/gallery.json imageSydId1,imageSysId2,imageSysId3
```
Where `tmp/gallery.json` is the path to a file containing dumped data from
the SQL db for one gallery, and `imageSydId1,imageSysId2,imageSysId3` are the
Contentful sys IDs of pre-created automated records cards for the gallery's
images.
