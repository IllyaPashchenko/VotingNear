#!/bin/sh

echo ">> Building contract"

near-sdk-js build src/votes.ts build/votes.wasm
