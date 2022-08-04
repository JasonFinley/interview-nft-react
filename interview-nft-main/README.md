# Arcade Galaxy Interview NFT

NFT token following [ERC721](https://eips.ethereum.org/EIPS/eip-721) standard.

Please copy .env.example file as .env and fill in the necessary information

Run tests

```shell
npm run test
```

Deploy NFT contract to testnet
```shell
npm run deploy
```

# Interview tasks

Please create a web server providing:

* Websocket API endpoint that pushes incoming ERC721 Transfer event info.
* HTTP API endpoint that one can query previous ERC721 Transfer events since the server started(Please stores previous Transfer event info into a DB).
* HTTP API endpoint that takes in token ID and responses with the owner address of the ID.
* HTTP API endpoint that takes in an address and mints a token for the address by triggering the mint function in the NFT contract.(Optional: allow only members for minting, which requires the server to provide authentication mechanism for membership management)
