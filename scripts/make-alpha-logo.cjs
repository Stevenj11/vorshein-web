const sharp = require("sharp");

async function main() {
  const srcPath = "public/brand/logo-mark.jpeg";
  const outPath = "public/brand/logo-mark-alpha.png";

  const { data, info } = await sharp(srcPath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0, p = 0; i < data.length; i += channels, p += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const alpha = 255 - luminance;
    out[p] = 255;
    out[p + 1] = 255;
    out[p + 2] = 255;
    out[p + 3] = Math.round(alpha);
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outPath);

  console.log(`wrote ${outPath} (${width}x${height})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
