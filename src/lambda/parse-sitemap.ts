import { Handler } from "aws-lambda";
import Sitemapper from "sitemapper";

export const handler: Handler<{ sitemapUrl: string }> = async (event) => {
  // TODO: event.sitemapUrl 解析して、 URL の配列を返す
  const sitemap = new Sitemapper({});
  const { sites } = await sitemap.fetch(event.sitemapUrl);

  console.log(sites);
  return sites;
};
