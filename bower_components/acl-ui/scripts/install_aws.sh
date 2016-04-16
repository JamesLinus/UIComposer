#!/usr/bin/env bash
#
# Stop on error
#
set -e

#
# Install AWS's CLI tool for access to AWS altogether
#
curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
unzip awscli-bundle.zip
sudo ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws