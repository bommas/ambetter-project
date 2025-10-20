#!/bin/bash

echo "🚀 Setting up Ambetter Health Plan Search Application - Phase 1"
echo "=============================================================="
echo "Using Elastic Crawler for robust web crawling"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one from .env.example:"
    echo "   cp .env.example .env"
    echo ""
    echo "Then add your Elasticsearch Serverless credentials:"
    echo "   ELASTIC_ENDPOINT=your_endpoint_here"
    echo "   ELASTIC_API_KEY=your_api_key_here"
    exit 1
fi

echo "✅ .env file found"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    echo "   You can start Docker Desktop from Applications or run:"
    echo "   open -a Docker"
    exit 1
fi

echo "✅ Docker is running"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start RabbitMQ with Docker Compose
echo "🐳 Starting RabbitMQ..."
docker-compose up -d

# Wait for RabbitMQ to be ready
echo "⏳ Waiting for RabbitMQ to be ready..."
sleep 10

# Test RabbitMQ connection
echo "🐰 Testing RabbitMQ connection..."
curl -s http://localhost:15672 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ RabbitMQ is ready"
else
    echo "❌ RabbitMQ is not responding. Please check the logs:"
    echo "   docker-compose logs rabbitmq"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Make sure your .env file has your Elasticsearch Serverless credentials:"
echo "   ELASTIC_ENDPOINT=your_endpoint_here"
echo "   ELASTIC_API_KEY=your_api_key_here"
echo ""
echo "2. Start the Next.js development server:"
echo "   npm run dev"
echo ""
echo "3. Open your browser and go to:"
echo "   http://localhost:3000"
echo ""
echo "4. Go to the Admin page to start crawling:"
echo "   http://localhost:3000/admin"
echo ""
echo "5. Click 'Start Crawl' to extract and index health plan data"
echo ""
echo "Alternative: Run crawler manually:"
echo "   ./scripts/run-crawler.sh"
echo ""
echo "Services running:"
echo "- Elasticsearch Serverless: Your serverless instance (configured via .env)"
echo "- RabbitMQ Management: http://localhost:15672 (guest/guest)"
echo "- Next.js App: http://localhost:3000"
echo "- Elastic Crawler: Available via Docker"
