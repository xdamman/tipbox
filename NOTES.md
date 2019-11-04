Attempting to upgrade

`docker build . -t tipbox/server`

Run yarn install to grab the latest node modules
`docker run --rm -it -v $(pwd):/app tipbox/server yarn install`

Run the build process
`docker run --rm -it -v $(pwd):/app tipbox/server yarn run build`

Generate Keys
`docker run --rm -it -v $(pwd):/app tipbox/server bash -c 'PASSPHRASE=1234 IDENTITY="<tips@tipbox.in>" node ./server/utils/keygen.js'`

Run the server
`docker run --rm -it -p 4000:3000 -e PASSPHRASE=1234 -e HOST=tipbox.d.mdp.im -e PORT=4000 -v $(pwd):/app tipbox/server yarn start`


## What's not working

- Gulp process needs to be updated
  - I've stripped out anything that didn't work (uglify, uncss), so I'm sure I've broken something
- Keybase doesn't seem to play nicely with browserify(Libsodium issue)
  - https://github.com/keybase/node-nacl/blob/master/CHANGELOG.md#v110-2019-02-18
  - I added 'ignore' to Gulp, but haven't tested the encryption


