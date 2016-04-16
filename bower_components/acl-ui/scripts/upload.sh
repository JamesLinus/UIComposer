#!/usr/bin/env bash
#
# Upload distribution assets to an S3 bucket, so they can be used globally.
#

if [ ! -e "scripts/upload.sh" ]; then
  echo "This script must be executed within the top-level directory (using ./scripts/upload.sh)".
  exit -1
fi

#
# Stop on error
#
set -e

#
# Push out to S3 bucket. Be careful to set permissions appropriately.
#
aws s3 sync --acl public-read dist s3://acl-ui/