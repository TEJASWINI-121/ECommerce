/**
 * scripts/fixProductImageMapping.js
 *
 * Usage (PowerShell):
 *  $env:MONGODB_URI="mongodb://localhost:27017/ecommerce"; node scripts/fixProductImageMapping.js
 *
 * This script:
 *  - Reads files under public/images/<category>/
 *  - Normalizes filenames and product names
 *  - Tries to match product => best image files based on name tokens
 *  - Updates product.images with the matched local image URLs (e.g. /images/electronics/iphone-14-0.jpg)
 *
 * IMPORTANT: backup your DB before running.
 */

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
const IMAGES_ROOT = path.join(process.cwd(), 'public', 'images'); // adjust if your images live elsewhere
const MAX_IMAGES_PER_PRODUCT = 3;

function normalizeText(s = '') {
  return s
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Walk directory recursively and return list of files with relative path and normalized filename
function listImageFiles(rootDir) {
  const results = [];
  if (!fs.existsSync(rootDir)) return results;

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else {
        const rel = path.relative(rootDir, full); // category/filename.ext or deeper
        const parts = rel.split(path.sep);
        const category = parts[0] || 'uncategorized';
        results.push({
          fullPath: full,
          relPath: rel.replace(/\\/g, '/'),
          webPath: `/images/${rel.replace(/\\/g, '/')}`, // used in DB
          filename: path.basename(full, path.extname(full)),
          normalized: normalizeText(path.basename(full, path.extname(full)))
        });
      }
    }
  }
  walk(rootDir);
  return results;
}

(async function main() {
  console.log('Connecting to MongoDB:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, {});

  // Product schema - minimal fields used for updating; matches your project schema
  const productSchema = new mongoose.Schema({}, { strict: false });
  const Product = mongoose.model('Product', productSchema, 'products');

  // Load image files
  console.log('Scanning local images...');
  const files = listImageFiles(IMAGES_ROOT);
  console.log(`Found ${files.length} local image files under ${IMAGES_ROOT}`);

  // Build quick lookup by token -> files containing token
  const tokenIndex = new Map();
  for (const f of files) {
    const tokens = f.normalized.split(' ').filter(Boolean);
    for (const t of tokens) {
      if (!tokenIndex.has(t)) tokenIndex.set(t, new Set());
      tokenIndex.get(t).add(f);
    }
  }

  // Cursor over products to avoid memory spikes
  const cursor = Product.find({}).cursor();
  let count = 0;
  let updatedCount = 0;
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    count++;
    const name = (doc.name || doc.title || '').toString();
    const category = (doc.category || 'uncategorized').toString();
    const normName = normalizeText(name);
    const tokens = normName.split(' ').filter(Boolean);

    // collect candidate file matches; prefer files in same category directory
    const candidateScores = new Map(); // file.webPath -> score

    for (const t of tokens) {
      const set = tokenIndex.get(t);
      if (!set) continue;
      for (const f of set) {
        // prefer same category if available
        let score = candidateScores.get(f.webPath) || 0;
        score += 1; // base score per token match
        if (f.relPath.startsWith(category + '/')) score += 2; // boost for same category
        candidateScores.set(f.webPath, score);
      }
    }

    // If no token matches, optionally fallback to brand or category-only images
    // e.g., check brand token, first token, or if category-specific images exist
    if (candidateScores.size === 0) {
      // try single-token fallback (first word)
      const first = tokens[0];
      if (first) {
        const set = tokenIndex.get(first);
        if (set) {
          for (const f of set) candidateScores.set(f.webPath, (candidateScores.get(f.webPath) || 0) + 1);
        }
      }
    }

    // Build ranked list
    const ranked = [...candidateScores.entries()].sort((a, b) => b[1] - a[1]).map(r => r[0]);
    if (ranked.length > 0) {
      const newImages = ranked.slice(0, MAX_IMAGES_PER_PRODUCT);
      // Only update if different
      const existing = Array.isArray(doc.images) ? doc.images : [];
      const same = existing.length === newImages.length && existing.every((v, i) => v === newImages[i]);
      if (!same) {
        await Product.updateOne({ _id: doc._id }, { $set: { images: newImages } });
        updatedCount++;
        console.log(`Updated "${name}" -> ${newImages.join(', ')}`);
      }
    } else {
      // no match found; skip (keeps existing images)
      // We can optionally set a category placeholder if desired
      // console.log(`No match for "${name}"`);
    }

    if (count % 100 === 0) {
      console.log(`Processed ${count} products... updated ${updatedCount}`);
    }
  }

  console.log(`Done. Processed ${count} products. Updated ${updatedCount}.`);
  await mongoose.disconnect();
  process.exit(0);
})();