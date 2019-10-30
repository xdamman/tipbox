Attempting to upgrade

`docker build . -t tipbox/server`

Run yarn install to grab the latest node modules
`docker run --rm -it -v $(pwd):/app tipbox/server yarn install`

Run the build process
`docker run --rm -it -v $(pwd):/app tipbox/server yarn run build`

Run the server
`docker run --rm -it -v $(pwd):/app tipbox/server yarn run start`


## What's not working

Gulp process needs to be updated
Keybase doesn't seem to play nicely with browserify(Libsodium issue)

