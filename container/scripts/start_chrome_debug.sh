#!/bin/bash
# Script to start Chrome with remote debugging port for E2E testing in Git Bash

# Check if Chrome is already running with debug port
if netstat -an | grep :9222 > /dev/null; then
    echo "Chrome is already running with debug port 9222"
    exit 0
fi

# Start Chrome with remote debugging port
echo "Starting Chrome with remote debugging port 9222..."
"/c/Program Files/Google/Chrome/Application/chrome.exe" \
    --remote-debugging-port=9222 \
    --no-first-run \
    --no-default-browser-check \
    --disable-extensions \
    --disable-plugins \
    --user-data-dir="/d/temp/chrome_debug_user_data" \
    > /d/temp/chrome_debug.log 2>&1 &

# Wait for Chrome to start
sleep 5

# Verify Chrome is running
if netstat -an | grep :9222 > /dev/null; then
    echo "Chrome successfully started with debug port 9222"
    echo "Chrome debug log available at: /d/temp/chrome_debug.log"
else
    echo "Failed to start Chrome with debug port 9222"
    echo "Check /d/temp/chrome_debug.log for details"
    exit 1
fi