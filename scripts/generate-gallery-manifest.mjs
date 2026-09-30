import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryRoot = path.join(projectRoot, "assets", "gallery");
const manifestPath = path.join(galleryRoot, "gallery.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function collectImages(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const images = [];

    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            images.push(...await collectImages(entryPath));
        } else if (imageExtensions.has(path.extname(entry.name).toLowerCase())) {
            images.push(entryPath);
        }
    }

    return images;
}

const files = (await collectImages(galleryRoot)).sort((first, second) => {
    const firstRelative = path.relative(galleryRoot, first);
    const secondRelative = path.relative(galleryRoot, second);
    const firstNested = firstRelative.includes(path.sep);
    const secondNested = secondRelative.includes(path.sep);
    if (firstNested !== secondNested) return firstNested ? 1 : -1;
    return firstRelative.localeCompare(secondRelative, undefined, { numeric: true, sensitivity: "base" });
});

const seenHashes = new Set();
const images = [];

for (const file of files) {
    const contents = await readFile(file);
    const hash = createHash("sha256").update(contents).digest("hex");
    if (seenHashes.has(hash)) continue;
    seenHashes.add(hash);

    const relativePath = path.relative(galleryRoot, file).split(path.sep).map(encodeURIComponent).join("/");
    images.push(`assets/gallery/${relativePath}`);
}

await writeFile(manifestPath, `${JSON.stringify({ images }, null, 2)}\n`);
console.log(`Gallery manifest generated with ${images.length} unique images.`);