const { pool } = require('../models/db');
const responseHandler = require('../utils/responseHandler');

exports.handleWebhook = async (req, res) => {
    const { requestId, imageUrls, status } = req.body;

    try {
        if (!Array.isArray(imageUrls) || !['processed', 'failed'].includes(status)) {
            return responseHandler.error(res, 'Invalid request data');
        }

        const updatePromises = imageUrls.map(imageUrl => 
            pool.query(
                'UPDATE images SET status = $1 WHERE request_id = $2 AND original_image_url = $3',
                [status, requestId, imageUrl]
            )
        );
        await Promise.all(updatePromises);

        // Optionally, update the request status
        const failedCountResult = await pool.query(
            'SELECT COUNT(*) FROM images WHERE request_id = $1 AND status = $2',
            [requestId, 'failed']
        );

        if (parseInt(failedCountResult.rows[0].count, 10) > 0) {
            await pool.query('UPDATE requests SET status = $1 WHERE id = $2', ['failed', requestId]);
        } else {
            await pool.query('UPDATE requests SET status = $1 WHERE id = $2', ['completed', requestId]);
        }

        responseHandler.success(res, { message: 'Webhook processed' });
    } catch (error) {
        responseHandler.error(res, 'Failed to process webhook');
    }
};
