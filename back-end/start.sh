#!/bin/bash

# Render startup script
echo "🚀 Starting FocoTotal Backend..."

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Start the application
echo "🌟 Starting server..."
node src/server.js