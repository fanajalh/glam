const fs = require("fs");
const https = require("https");
const path = require("path");

const images = {
  // 6 Bahan Alami
  "ingredient-beras-ketan.jpg": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "ingredient-cengkeh.jpg": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80",
  "ingredient-pandan.jpg": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
  "ingredient-kunyit.jpg": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
  "ingredient-jeruk-nipis.jpg": "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80",
  "ingredient-kopi.jpg": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",

  // 3 DIY Mixers
  "diy-air-mawar.jpg": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
  "diy-susu.jpg": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
  "diy-tradisional.jpg": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",

  // Testimonial Before & After Pairs
  "testi-after-1.jpg": "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80",
  "testi-before-1.jpg": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
  "testi-after-2.jpg": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
  "testi-before-2.jpg": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  "testi-after-3.jpg": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
  "testi-before-3.jpg": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",

  // Ritual, Heritage, & Storage
  "tradisi-bugis.jpg": "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1000&q=80",
  "ritual-spa.jpg": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1000&q=80",
  "fresh-storage.jpg": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",

  // 3 Bundling Package visual thumbnails
  "package-single.jpg": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
  "package-duo.jpg": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
  "package-trio.jpg": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",

  // 8 Steps Usage Thumbnails
  "step-1.jpg": "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80",
  "step-2.jpg": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
  "step-3.jpg": "https://images.unsplash.com/photo-1608248597359-28105741865a?auto=format&fit=crop&w=600&q=80",
  "step-4.jpg": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
  "step-5.jpg": "https://images.unsplash.com/photo-1512290900672-1f55b9e0750f?auto=format&fit=crop&w=600&q=80",
  "step-6.jpg": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
  "step-7.jpg": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
  "step-8.jpg": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80"
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
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  for (const [filename, url] of Object.entries(images)) {
    const dest = path.join(imagesDir, filename);
    // If already downloaded and > 5KB, skip to save time
    if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
      console.log(`[SKIP] ${filename} already exists`);
      continue;
    }
    try {
      const size = await download(url, dest);
      console.log(`[OK] ${filename} - ${(size / 1024).toFixed(1)} KB`);
    } catch (e) {
      console.error(`[ERR] ${filename} - ${e.message}`);
    }
  }
}

run();
