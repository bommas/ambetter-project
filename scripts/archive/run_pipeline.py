#!/usr/bin/env python3
"""
Ambetter Health Plan Data Pipeline
==================================
This script orchestrates the complete data pipeline:
1. Run Elastic Crawler to discover and index web content
2. Run PDF Processor to extract and index PDF content
"""

import subprocess
import sys
import time
import json
import requests
from pathlib import Path

# Configuration
ELASTIC_ENDPOINT = "https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud"
ELASTIC_API_KEY = "Z2t5cDdwa0JWVEtzRW5CbkhjbDc6c05ReVZ4NFZIQVdyYnppNlB3V1NxUQ=="
INDEX_NAME = "health-plans"

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🚀 {description}")
    print(f"Command: {' '.join(command)}")
    print("-" * 50)
    
    try:
        result = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent
        )
        print("✅ Success!")
        if result.stdout:
            print("Output:", result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        if e.stdout:
            print("Stdout:", e.stdout)
        if e.stderr:
            print("Stderr:", e.stderr)
        return False

def check_elasticsearch_connection():
    """Check if Elasticsearch is accessible"""
    print("\n🔍 Checking Elasticsearch connection...")
    
    try:
        # Use /_info endpoint for serverless Elasticsearch
        response = requests.get(
            f"{ELASTIC_ENDPOINT}/",
            headers={
                "Authorization": f"ApiKey {ELASTIC_API_KEY}",
                "Content-Type": "application/json"
            },
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Elasticsearch connection successful")
            return True
        else:
            print(f"❌ Elasticsearch connection failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Elasticsearch connection error: {e}")
        return False

def check_docker():
    """Check if Docker is running"""
    print("\n🐳 Checking Docker...")
    
    try:
        result = subprocess.run(
            ["docker", "ps"],
            capture_output=True,
            text=True,
            check=True
        )
        print("✅ Docker is running")
        return True
    except subprocess.CalledProcessError:
        print("❌ Docker is not running or not accessible")
        return False

def run_crawler():
    """Run the Elastic Crawler"""
    print("\n🕷️  Starting Elastic Crawler...")
    
    # Start Docker Compose services
    docker_compose_cmd = [
        "docker-compose", "up", "-d", "rabbitmq"
    ]
    
    if not run_command(docker_compose_cmd, "Starting RabbitMQ service"):
        return False
    
    # Wait for RabbitMQ to be ready
    print("⏳ Waiting for RabbitMQ to be ready...")
    time.sleep(10)
    
    # Run the crawler
    crawler_cmd = [
        "docker-compose", "up", "elastic-crawler"
    ]
    
    return run_command(crawler_cmd, "Running Elastic Crawler")

def run_pdf_processor():
    """Run the PDF Processor"""
    print("\n📄 Starting PDF Processor...")
    
    pdf_processor_cmd = [
        "node", "scripts/pdf-processor.js"
    ]
    
    return run_command(pdf_processor_cmd, "Running PDF Processor")

def check_indexed_data():
    """Check what data was indexed"""
    print("\n📊 Checking indexed data...")
    
    try:
        # Get document count
        count_response = requests.get(
            f"{ELASTIC_ENDPOINT}/{INDEX_NAME}/_count",
            headers={
                "Authorization": f"ApiKey {ELASTIC_API_KEY}",
                "Content-Type": "application/json"
            },
            timeout=10
        )
        
        if count_response.status_code == 200:
            count_data = count_response.json()
            total_docs = count_data.get('count', 0)
            print(f"📊 Total documents in index: {total_docs}")
            
            # Get sample documents
            search_response = requests.get(
                f"{ELASTIC_ENDPOINT}/{INDEX_NAME}/_search?size=3",
                headers={
                    "Authorization": f"ApiKey {ELASTIC_API_KEY}",
                    "Content-Type": "application/json"
                },
                timeout=10
            )
            
            if search_response.status_code == 200:
                search_data = search_response.json()
                hits = search_data.get('hits', {}).get('hits', [])
                
                print(f"📄 Sample documents:")
                for i, hit in enumerate(hits, 1):
                    source = hit.get('_source', {})
                    title = source.get('title', 'No title')
                    doc_type = source.get('plan_type', 'unknown')
                    print(f"  {i}. {title} ({doc_type})")
            
            return True
        else:
            print(f"❌ Failed to get document count: {count_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error checking indexed data: {e}")
        return False

def cleanup():
    """Clean up Docker containers"""
    print("\n🧹 Cleaning up Docker containers...")
    
    cleanup_cmd = [
        "docker-compose", "down"
    ]
    
    run_command(cleanup_cmd, "Stopping Docker containers")

def main():
    """Main pipeline execution"""
    print("🎯 Ambetter Health Plan Data Pipeline")
    print("=" * 50)
    
    # Pre-flight checks
    if not check_docker():
        print("❌ Docker is required but not running. Please start Docker Desktop.")
        sys.exit(1)
    
    if not check_elasticsearch_connection():
        print("❌ Cannot connect to Elasticsearch. Please check your credentials.")
        sys.exit(1)
    
    try:
        # Step 1: Run Crawler
        print("\n" + "="*50)
        print("STEP 1: RUNNING ELASTIC CRAWLER")
        print("="*50)
        
        if not run_crawler():
            print("❌ Crawler failed. Stopping pipeline.")
            sys.exit(1)
        
        print("✅ Crawler completed successfully!")
        
        # Step 2: Run PDF Processor
        print("\n" + "="*50)
        print("STEP 2: RUNNING PDF PROCESSOR")
        print("="*50)
        
        if not run_pdf_processor():
            print("❌ PDF Processor failed. Stopping pipeline.")
            sys.exit(1)
        
        print("✅ PDF Processor completed successfully!")
        
        # Step 3: Check Results
        print("\n" + "="*50)
        print("STEP 3: CHECKING RESULTS")
        print("="*50)
        
        check_indexed_data()
        
        print("\n🎉 Pipeline completed successfully!")
        print("✅ All data has been indexed and is ready for search!")
        
    except KeyboardInterrupt:
        print("\n⚠️  Pipeline interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Pipeline failed with error: {e}")
        sys.exit(1)
    finally:
        cleanup()

if __name__ == "__main__":
    main()
