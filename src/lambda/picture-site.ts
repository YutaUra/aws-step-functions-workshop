import { Handler } from "aws-lambda";
import { launchChromium } from "playwright-aws-lambda";

export const handler: Handler<{ url: string }> = async (event) => {
  const browser = await launchChromium();
  const page = await browser.newPage();
  await page.goto(event.url);
  const title = await page.title();

  await page.close();
  await browser.close();

  console.log("title:", title);
  return title;
};
