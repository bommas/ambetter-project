#!/bin/bash

echo "🚀 Running Elastic Crawler for Ambetter Health Plans"
echo "=================================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one from .env.example:"
    echo "   cp .env.example .env"
    echo ""
    echo "Then add your Elastic Cloud credentials:"
    echo "   ELASTIC_CLOUD_ID=your_cloud_id_here"
    echo "   ELASTIC_API_KEY=your_api_key_here"
    exit 1
fi

# Load environment variables
source .env

# Check if required variables are set
if [ -z "$ELASTIC_CLOUD_ID" ] || [ -z "$ELASTIC_API_KEY" ]; then
    echo "❌ Missing required environment variables:"
    echo "   ELASTIC_CLOUD_ID and ELASTIC_API_KEY must be set in .env file"
    exit 1
fi

echo "✅ Environment variables loaded"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"

# Run the Elastic Crawler
echo "🐳 Starting Elastic Crawler..."
echo "Target: https://www.ambetterhealth.com/en/tx/2025-brochures-epo/"
echo ""

docker run --rm \
  -v "$(pwd)/crawler-config.yml:/config/crawler-config.yml" \
  -e ELASTIC_CLOUD_ID="$ELASTIC_CLOUD_ID" \
  -e ELASTIC_API_KEY="$ELASTIC_API_KEY" \
  docker.elastic.co/integrations/crawler:latest \
  jruby bin/crawler crawl /config/crawler-config.yml

echo ""
echo "🎉 Crawler execution completed!"
echo ""
echo "Next steps:"
echo "1. Check your Elastic Cloud console to see the indexed documents"
echo "2. Use the search API to query the health-plans index"
echo "3. Go to http://localhost:3000/admin to manage the application"
