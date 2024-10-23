# Pin Insights

## Overview

Pin Insights is a web application that allows users to connect their Pinterest accounts and receive personalized reviews based on the pins they have saved. The application utilizes the Pinterest API for fetching user pins and employs Google's Gemini model for generating insightful reviews based on images.

## Features

- **Pinterest Authentication**: Securely log in with your Pinterest account.
- **Fetch Pins**: Retrieve and display your saved pins.
- **Collective Review Generation**: Get a thoughtful review based on the themes and descriptions of your saved pins.
- **Image Analysis**: Analyze images from your pins to provide a detailed review.

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- Docker (for running Appwrite)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/pin-insights.git
   cd pin-insights

2. Install dependencies:

    ```bash
    npm install

3. Appwrite backend

    ```bash
    docker run -d --init -p 3000:80 \
    -e _APP_ENV=development \
    -e _APP_DEBUG=true \
    -e _APP_DOMAIN=http://localhost:3000 \
    -e _APP_DOMAIN_TARGET=http://localhost:3000 \
    -e _APP_INTERNAL_DOMAIN=http://localhost \
    -e _APP_API_KEY=YOUR_API_KEY_HERE \
    appwrite/appwrite:latest
    ```

4. Start using `npm run dev`

5. Open your browser and navigate to http://localhost:5172.

