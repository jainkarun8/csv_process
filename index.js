const express = require('express');
const requestRoutes = require('./routes/requestRoutes');
const statusRoutes = require('./routes/statusRoutes');
const webhookRoutes = require('./routes/webhookRoutes'); 

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', requestRoutes);
app.use('/api', statusRoutes);
app.use('/api', webhookRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
