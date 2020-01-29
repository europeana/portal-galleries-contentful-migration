const { pgClient } = require('./config');

const sql = `
select
  g.id,
  g.slug,
  g.published_at,
  g.image_portal_urls,
  gt.title,
  gt.description
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
    gallery['image_portal_urls'] = gallery['image_portal_urls'].filter((imagePortalUrl) => {
      return !imagePortalUrl.includes('?view=');
    });
  }
  return galleries;
};

module.exports = async() => {
  await pgClient.connect();
  const galleries = await pgClient.query(sql);
  await pgClient.end();

  return excludeImagesFromHasViews(galleries);
};
