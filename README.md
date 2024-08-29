Here’s how to enhance the `README.md` to include details about the database schema, API documentation, asynchronous workers, and a link to the Postman collection:

---

# CSV Image Processing System

## Overview

This project is a system for processing image data from CSV files. The system allows users to upload a CSV file containing image URLs, processes the images asynchronously, and provides status updates on the processing progress.

## Features

- **CSV Upload**: Accepts CSV files with image URLs and product information.
- **Image Processing**: Compresses images by 50% of their original quality.
- **Status Tracking**: Provides status updates for each processing request.
- **Webhook Support**: Handles webhooks for post-processing notifications.

## Database Schema

The database schema includes tables to store product and image data, as well as track the status of each processing request.

### Requests Table

- **Table Name**: `requests`
- **Columns**:
  - `id` (UUID, Primary Key): Unique identifier for each request.
  - `status` (VARCHAR): Status of the request (e.g., 'processing', 'completed', 'failed').

### Images Table

- **Table Name**: `images`
- **Columns**:
  - `id` (SERIAL, Primary Key): Unique identifier for each image entry.
  - `request_id` (UUID, Foreign Key): References the `id` in the `requests` table.
  - `original_image_url` (VARCHAR): URL of the original image.
  - `processed_image_url` (VARCHAR): URL of the processed image.
  - `status` (VARCHAR): Status of the image processing (e.g., 'processed', 'failed').

## API Documentation

### Upload API

- **Endpoint**: `POST /api/upload`
- **Description**: Upload a CSV file to process images.
- **Request Body**: Form-data with a file field.
- **Response**: JSON with the unique `requestId`.
  - Example: `{ "success": true, "data": { "requestId": "uuid" } }`

### Status API

- **Endpoint**: `GET /api/status/:requestId`
- **Description**: Get the status of a processing request.
- **Parameters**: 
  - `requestId` (UUID) - The unique ID returned from the upload request.
- **Response**: JSON with the current status of the request.
  - Example: `{ "success": true, "data": { "status": "completed" } }`

### Webhook API

- **Endpoint**: `POST /api/webhook`
- **Description**: Receives webhook notifications from the image processing service.
- **Request Body**: JSON with `requestId`, `imageUrls`, and `status`.
- **Response**: JSON confirming the receipt of the webhook.
  - Example: `{ "success": true, "message": "Webhook processed" }`

## Asynchronous Workers Documentation

### CSV Parser Service

- **Function**: `processCSV(filePath)`
- **Description**: Parses the CSV file, validates URLs, and initiates image processing tasks.
- **Responsibilities**:
  - Validate CSV format.
  - Parse image URLs.
  - Queue image processing tasks.
  - Update request status upon completion.

### Image Processing Service

- **Function**: `processImages(requestId, productName, imageUrls)`
- **Description**: Processes images by compressing them and storing results.
- **Responsibilities**:
  - Fetch images from URLs.
  - Compress and save images.
  - Update the database with processed image details.
  - Handle errors and update statuses.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL (or your chosen database)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/jainkarun8/csv_process.git
   cd csv_process
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up the Database**

   Create the necessary tables using the provided schema or your preferred database management tools.

4. **Run the Application**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

### Postman Collection

You can test the APIs using the Postman collection available 

