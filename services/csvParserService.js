const fs = require('fs');
const csv = require('csv-parser');
const { v4: uuidv4 } = require('uuid');
const imageProcessingService = require('./imageProcessingService');
const { pool } = require('../models/db');

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

exports.processCSV = async (filePath) => {
    const requestId = uuidv4();

    await pool.query('INSERT INTO requests (id, status) VALUES ($1, $2)', [requestId, 'processing']);

    return new Promise((resolve, reject) => {
        const tasks = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {

                const imageUrls = row['Input Image Urls']
                    .split(',')
                    .map(url => url.trim())
                    .filter(url => url.startsWith('http') && isValidUrl(url));

                if (imageUrls.length === 0) {
                    console.error(`No valid URLs found for product: ${row['Product Name']}`);
                    return;
                }

                tasks.push(imageProcessingService.processImages(requestId, row['Product Name'], imageUrls));
            })
            .on('end', async () => {
                try {
                    await Promise.all(tasks);
                    await pool.query('UPDATE requests SET status = $1 WHERE id = $2', ['completed', requestId]);
                    resolve(requestId);
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (error) => reject(error));
    });
};
