import { Handler } from "aws-lambda";
import { launchChromium } from "playwright-aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const handler: Handler<{ url: string; id: string }> = async (event) => {
  const s3 = new S3Client({});
  const browser = await launchChromium();
  const page = await browser.newPage();
  await page.goto(event.url);

  await page.waitForTimeout(1000 * 3); // 画像が blur で徐々にレンダリングされるため、余裕を持って3秒ほど待つ
  const buffer = await page.screenshot({ type: "png" });

  const key = `${event.id}/${encodeURIComponent(event.url)}.png`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env["BUCKET_NAME"],
      Key: key,
      Body: buffer,
    })
  );

  await page.close();
  await browser.close();

  return key;
};
