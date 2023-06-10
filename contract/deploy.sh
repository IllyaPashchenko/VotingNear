#!/bin/sh

echo ">> Deploying contract"

# https://docs.near.org/tools/near-cli#near-dev-deploy
near delete near-vote-project.illya-pashchenko.testnet illya-pashchenko.testnet
near create-account near-vote-project.illya-pashchenko.testnet --masterAccount illya-pashchenko.testnet
near dev-deploy --wasmFile build/votes.wasm --initFunction initialize --initArgs '{}'
