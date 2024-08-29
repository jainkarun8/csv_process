const { pool } = require('../models/db');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Process images from URLs
exports.processImages = async (requestId, productName, imageUrls) => {
    const outputUrls = [];

    try {
        const outputDir = 'processed_images';
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        for (const imageUrl of imageUrls) {
            const outputImageUrl = `${imageUrl}-processed`;
            outputUrls.push(outputImageUrl);

            try {
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const imageBuffer = Buffer.from(response.data, 'binary');

                const processedImage = await sharp(imageBuffer)
                .resize({ width: 800 }) // Or other desired dimensions
                .jpeg({ quality: 50 }) // Compress by 50% for JPEG images
                .toBuffer();

                const outputPath = path.join(outputDir, path.basename(outputImageUrl));
                fs.writeFileSync(outputPath, processedImage);

                await pool.query(
                    'INSERT INTO images (request_id, original_image_url, processed_image_url, status) VALUES ($1, $2, $3, $4)',
                    [requestId, imageUrl, outputImageUrl, 'processed']
                );
            } catch (error) {
                console.error(`Error processing image URL: ${imageUrl}`, error.message);
                await pool.query(
                    'INSERT INTO images (request_id, original_image_url, status) VALUES ($1, $2, $3)',
                    [requestId, imageUrl, 'failed']
                );
            }
        }

        await pool.query(
            'UPDATE requests SET status = $1 WHERE id = $2',
            ['completed', requestId]
        );

    } catch (error) {
        await pool.query(
            'UPDATE requests SET status = $1 WHERE id = $2',
            ['failed', requestId]
        );

        for (const imageUrl of imageUrls) {
            await pool.query(
                'INSERT INTO images (request_id, original_image_url, status) VALUES ($1, $2, $3)',
                [requestId, imageUrl, 'failed']
            );
        }

        throw error;
    }
};
