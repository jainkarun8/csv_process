const csvParserService = require('../services/csvParserService');
const responseHandler = require('../utils/responseHandler');
const fs = require('fs');

exports.uploadCSV = async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return responseHandler.error(res, 'Input file is missing');
        }
        // Process the CSV file
        const requestId = await csvParserService.processCSV(req.file.path);
        // Clean up uploaded file after processing
        fs.unlinkSync(req.file.path);

        responseHandler.success(res, { requestId });
    } catch (error) {
        responseHandler.error(res, error.message);
    }
};
