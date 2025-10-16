# Docker Crawler for GCP

## Quick Start

### 1. Clone the repository on your GCP instance:
```bash
git clone https://github.com/bommas/ambetter-project.git
cd ambetter-project
```

### 2. Set up environment variables:
```bash
export ELASTIC_ENDPOINT="https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud"
export ELASTIC_API_KEY="Z2t5cDdwa0JWVEtzRW5CbkhjbDc6c05ReVZ4NFZIQVdyYnppNlB3V1NxUQ=="
```

### 3. Run the Docker crawler:
```bash
docker run --rm \
  -v "$(pwd)/crawler-config.yml:/config/crawler-config.yml" \
  -e ELASTIC_ENDPOINT="$ELASTIC_ENDPOINT" \
  -e ELASTIC_API_KEY="$ELASTIC_API_KEY" \
  docker.elastic.co/integrations/crawler:latest \
  jruby bin/crawler crawl /config/crawler-config.yml
```

## What it will do:
- Crawl Ambetter health plan PDFs from Texas
- Extract plan information (name, type, county, tobacco use, etc.)
- Index data into Elasticsearch Serverless
- Create searchable health plan database

## Monitor Progress:
- Check the terminal output for crawling progress
- Visit the QA dashboard at your Next.js app URL
- Use the search API to test results

## Expected Results:
- Health plan documents indexed
- Search functionality working
- Ready for Phase 2 (React frontend)
