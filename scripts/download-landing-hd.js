const fs = require("fs");
const https = require("https");
const path = require("path");

const items = {
  "hero-bg-hd.jpg": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1920&q=85",
  "mission-model-hd.jpg": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=85",
  "feature-hero-hd.jpg": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=1400&q=85",
  "promise-transparency.jpg": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
  "promise-botanicals.jpg": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80",
  "promise-responsibility.jpg": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
  "promise-performance.jpg": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error("Status " + res.statusCode));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => {
        file.close(() => {
          const stats = fs.statSync(dest);
          resolve(stats.size);
        });
      });
    }).on("error", reject);
  });
}

async function run() {
  const imagesDir = path.join(process.cwd(), "public", "images");
  for (const [filename, url] of Object.entries(items)) {
    const dest = path.join(imagesDir, filename);
    try {
      const size = await download(url, dest);
      console.log(`[OK] ${filename} - ${(size / 1024).toFixed(1)} KB`);
    } catch (e) {
      console.error(`[ERR] ${filename} - ${e.message}`);
    }
  }
}

run();

