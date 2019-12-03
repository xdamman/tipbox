#!/bin/bash

SERVER_PUBLIC_KEY=./public_keys/tipbox.is.publickey.json yarn build
echo "Tipbox.is shasum - $(shasum -a 256 frontend/dist/index.html)"
