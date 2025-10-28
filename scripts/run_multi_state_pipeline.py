#!/usr/bin/env python3
"""
Multi-State Ambetter Health Plans Pipeline Runner

This script orchestrates the complete data pipeline:
1. Runs the multi-state processor to crawl and extract data from TX and FL
2. Indexes all data into Elasticsearch
3. Provides progress tracking and error handling
"""

import subprocess
import sys
import time
import os
from datetime import datetime

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*70}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(70)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*70}{Colors.ENDC}\n")

def print_step(step_num, title):
    print(f"\n{Colors.CYAN}{Colors.BOLD}[Step {step_num}] {title}{Colors.ENDC}")
    print(f"{Colors.CYAN}{'-'*70}{Colors.ENDC}")

def print_success(message):
    print(f"{Colors.GREEN}✅ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}❌ {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ️  {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠️  {message}{Colors.ENDC}")

def run_command(command, description):
    """Run a shell command and handle errors"""
    print_info(f"Running: {description}")
    print(f"{Colors.CYAN}Command: {command}{Colors.ENDC}")
    
    try:
        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True
        )
        
        # Stream output in real-time
        for line in process.stdout:
            print(line, end='')
        
        process.wait()
        
        if process.returncode == 0:
            print_success(f"{description} completed successfully")
            return True
        else:
            print_error(f"{description} failed with exit code {process.returncode}")
            return False
            
    except Exception as e:
        print_error(f"Error running {description}: {str(e)}")
        return False

def main():
    start_time = time.time()
    
    print_header("Multi-State Ambetter Health Plans Pipeline")
    print_info(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print_info(f"Processing States: Texas (TX), Florida (FL)")
    print_info(f"Working Directory: {os.getcwd()}")
    
    # Check prerequisites
    print_step(1, "Checking Prerequisites")
    
    # Check if Node.js is installed
    node_check = subprocess.run(['which', 'node'], capture_output=True)
    if node_check.returncode != 0:
        print_error("Node.js is not installed. Please install Node.js first.")
        sys.exit(1)
    print_success("Node.js found")
    
    # Check if pdftotext is installed
    pdftotext_check = subprocess.run(['which', 'pdftotext'], capture_output=True)
    if pdftotext_check.returncode != 0:
        print_warning("pdftotext not found. Installing poppler-utils...")
        if sys.platform == 'darwin':  # macOS
            run_command('brew install poppler', 'Install poppler')
        else:  # Linux
            run_command('sudo apt-get install -y poppler-utils', 'Install poppler-utils')
    else:
        print_success("pdftotext found")
    
    # Step 2: Run Multi-State Processor
    print_step(2, "Running Multi-State Processor (TX + FL)")
    print_info("This will:")
    print_info("  • Crawl Texas EPO brochures page for PDFs")
    print_info("  • Crawl Texas health plans page for general info")
    print_info("  • Crawl Florida health plans page for PDFs and info")
    print_info("  • Extract text from all PDFs")
    print_info("  • Index everything into Elasticsearch")
    
    success = run_command(
        'node scripts/multi-state-processor.js',
        'Multi-State PDF and Content Processor'
    )
    
    if not success:
        print_error("Pipeline failed during multi-state processing")
        sys.exit(1)
    
    # Calculate duration
    duration = time.time() - start_time
    minutes = int(duration // 60)
    seconds = int(duration % 60)
    
    # Final summary
    print_header("Pipeline Complete!")
    print_success(f"Total Duration: {minutes}m {seconds}s")
    print_info(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    print(f"\n{Colors.CYAN}{'='*70}{Colors.ENDC}")
    print(f"{Colors.BOLD}Next Steps:{Colors.ENDC}")
    print("  1. Verify data: curl -X GET 'http://localhost:9200/health-plans/_count'")
    print("  2. Test search: npm run dev")
    print("  3. Navigate to: http://localhost:3000")
    print(f"{Colors.CYAN}{'='*70}{Colors.ENDC}\n")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print_warning("\n\nPipeline interrupted by user")
        sys.exit(1)
    except Exception as e:
        print_error(f"\n\nFatal error: {str(e)}")
        sys.exit(1)

