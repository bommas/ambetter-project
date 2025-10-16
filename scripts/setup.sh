#!/bin/bash

echo "🚀 Setting up Ambetter Health Plan Search Application - Phase 1"
echo "=============================================================="

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

# Start services with Docker Compose
echo "🐳 Starting Elasticsearch and RabbitMQ..."
docker-compose up -d

# Wait for Elasticsearch to be ready
echo "⏳ Waiting for Elasticsearch to be ready..."
sleep 30

# Test Elasticsearch connection
echo "🔍 Testing Elasticsearch connection..."
curl -s http://localhost:9200/_cluster/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Elasticsearch is ready"
else
    echo "❌ Elasticsearch is not responding. Please check the logs:"
    echo "   docker-compose logs elasticsearch"
    exit 1
fi

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
echo "1. Start the Next.js development server:"
echo "   npm run dev"
echo ""
echo "2. Open your browser and go to:"
echo "   http://localhost:3000"
echo ""
echo "3. Go to the Admin page to start crawling:"
echo "   http://localhost:3000/admin"
echo ""
echo "4. Click 'Start Crawl' to extract and index health plan data"
echo ""
echo "Services running:"
echo "- Elasticsearch: http://localhost:9200"
echo "- RabbitMQ Management: http://localhost:15672 (guest/guest)"
echo "- Next.js App: http://localhost:3000"
