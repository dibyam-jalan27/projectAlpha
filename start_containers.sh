#!/bin/bash

# Start the Docker daemon
dockerd &

# Wait for the Docker daemon to start
until docker info >/dev/null 2>&1; do sleep 1; done

# Build and run the inner container (backend)
docker pull python