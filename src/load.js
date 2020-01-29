const { pgClient } = require('./config');

const sql = `
select
  g.id,
  g.slug,
  g.published_at,
  g.image_portal_urls,
  gt.title,
  gt.description,
  array(
    select
      json_build_object(
        'europeana_record_id', europeana_record_id,
        'url', url
      ) image
    from
      gallery_images gi
    where
      gi.gallery_id = g.id
    order by
      position asc
  ) images
from
  galleries g
  left join gallery_translations gt on gt.gallery_id = g.id
  and gt.locale = 'en'
where
  state = 1
order by
  g.id asc
`;

const excludeImagesFromHasViews = (galleries) => {
  for (const gallery of galleries.rows) {
    for (const imagePortalUrl of gallery.image_portal_urls) {
      if (imagePortalUrl.includes('?view=')) {
        // TODO
      }
    }
  }
  return galleries;
};

module.exports = async() => {
  await pgClient.connect();
  const galleries = await pgClient.query(sql);
  await pgClient.end();

  return excludeImagesFromHasViews(galleries);
};
