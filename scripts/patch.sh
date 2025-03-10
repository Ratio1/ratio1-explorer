#!/bin/bash

set -e  # Exit on error

git checkout main

npm version patch -m "Release %s"

git push origin main --follow-tags