#!/usr/bin/env bash
#
# Stop on error
#
set -e

#
# Build distribution files on a plain Node.js box
#
npm install
npm run bower
npm run gulp