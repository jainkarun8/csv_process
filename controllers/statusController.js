const { pool } = require('../models/db');
const responseHandler = require('../utils/responseHandler');

exports.getStatus = async (req, res) => {
    const { requestId } = req.params;

    try {
        console.log(`Request ID: ${requestId}`);  // Debugging log

        const result = await pool.query('SELECT status FROM requests WHERE id = $1', [requestId]);

        if (result.rows.length === 0) {
            console.log('Request ID not found'); // Debugging log
            return responseHandler.notFound(res, 'Request ID not found');
        }

        const { status } = result.rows[0];
        console.log(`Status: ${status}`); // Debugging log
        responseHandler.success(res, { status });
    } catch (error) {
        console.error('Error retrieving status:', error); // Debugging log
        responseHandler.error(res, 'Failed to retrieve status');
    }
};

