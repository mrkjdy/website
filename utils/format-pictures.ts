import { basename, dirname, extname } from "$std/path/mod.ts";
import sharp from "sharp";

for (const imagePath of Deno.args) {
  const imageDirname = dirname(imagePath);
  const imageBasename = basename(imagePath, extname(imagePath));
  if (!imagePath.endsWith(".avif")) {
    await sharp(imagePath)
      .avif()
      .toFile(`${imageDirname}/${imageBasename}.avif`);
  }
  if (!imagePath.endsWith(".jpeg")) {
    await sharp(imagePath)
      .jpeg()
      .toFile(`${imageDirname}/${imageBasename}.jpeg`);
  }
}
