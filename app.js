import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

// Function to convert and optimize an image to WebP format
async function convertToWebP(inputDir, outputDir, maxWidth, maxHeight, quality) {
    // Read the input directory
    const files = await fs.promises.readdir(inputDir);

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Process each file in the input directory
    for (const file of files) {
        const imagePath = path.join(inputDir, file);
        const outputFilename = path.join(outputDir, `${path.parse(file).name}.webp`);

        await sharp(imagePath)
            .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: quality })
            .toFile(outputFilename);

        await imagemin([outputFilename], {
            destination: outputDir,
            plugins: [imageminWebp({ quality: quality })]
        });

        console.log(`Image converted to WebP format: ${file}`);
    }

    console.log('All images converted successfully!');
}

// Usage example
const inputDir = './inputImages'; // Replace with the path of the input directory
const outputDir = './outputImages'; // Replace with the path of the output directory
const maxWidth = 800; // Maximum width of the converted images
const maxHeight = 600; // Maximum height of the converted images
const quality = 80; // Quality of the converted images (0 to 100)

convertToWebP(inputDir, outputDir, maxWidth, maxHeight, quality);
