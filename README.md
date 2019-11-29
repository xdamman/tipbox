# Tipbox

[![Backers on Open Collective](https://opencollective.com/tipbox/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/tipbox/sponsors/badge.svg)](#sponsors)

Share a unique URL to receive anonymous tips (with end-to-end PGP encryption).
Try it at https://tipbox.is

## Main features
- Nothing to install for the tipsters, they just need to open the unique URL generated at the creation of the Tipbox.
- Support for photo/document upload.
- Stateless, no logs in production (no information is ever saved).
- Support for End-To-End encryption with PGP.
- PGP encryption between the frontend and the backend so reduce the risk of leaking information to passive man-in-the-middle.
- Automatically fetches the PGP key of the recipient from public key server (fingerprint is included in the URL to prevent alteration).

## Disclaimer
*This is open source software, use at your own risk.*

There is always a tradeoff between ease of use and security. By not requiring your potential sources to install an app, there is a greater risk of exposure. Depending on your threat model, this may or may not matter. It’s all about finding the appropriate tool for the job. 
[Read more about the security of Tipbox](https://tipbox.is#security).

## Installation and development

### Setup for production

We use Docker and docker-compose to run run the entire stack (HTTPS with certs from LetsEncrypt, Express/Node Server, SMTP Server) with a minimal setup

1. Start by altering .env with your settings
    - You'll need to pick a passphrase for your local PGP key and an HMAC key for validating the URLs
1. Build the image and create a new PGP key
  - `docker-compose build server`
  - Run the keygen script to create your keys, `docker-compose run --rm server node ./server/utils/keygen.js`. This will be saved in `/data/keys`
  - `docker-compose run --rm server yarn build`
1. Run the server. Ensure you have the proper DNS records pointing domain you selected in .env to the server you're running this on. Caddy will automatically generated and confirm the domain SSL certificate from LetsEncrypt using this DNS record.
    `docker-compose up -d`

### Locally for development:

After cloning this repo, simply run

    docker-compose -f docker-compose.dev.yml build
    docker-compose -f docker-compose.dev.yml node ./server/utils/keygen.js
    docker-compose -f docker-compose.dev.yml up

Visit http://localhost:3000 in order to view the development version of the site.

This will serve the static files from `frontend/src` and watch for any change.
When any file in `frontend/src/less/` or `frontend/src/js/*` changes, `gulp` will run the `less` and the `browserify` tasks.

# Validating the version of Tipbox being served

In order to validate that the version of Tipbox has not been altered, it's possible to compare the sha256 hash of index.html with the one checked into this repository. All external script and style assets utilize [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) hashes, meaning that any changes to the underlying Javascript or CSS will result in a different cryptographic hash for the page.

1. Find the version of the page being served. It will be listed in the footer, at the very bottom of the page.
1. Get the hash of the current page being served. For example, if you want to check the version on https://tipbox.is, run the following
`curl https://tipbox.is | openssl dgst -sha256`
1. Compare this hash to the hash listed in VERSION.md available in this repository.
1. Alternatively, you can also compute the hash yourself with
`curl https://raw.githubusercontent.com/xdammon/tipbox/vVERSION/frontend/dist/index.html | openssl dgst -sha256` where VERSION is the version of the page your checking against.

## Frontend tests with Nightwatch

### Getting started

#### Install Selenium

Download the [selenium-server-standalone-2.44.0.jar](http://selenium-release.storage.googleapis.com/2.44/selenium-server-standalone-2.44.0.jar) and move it to `test/lib/selenium-server-standalone-2.44.0.jar`

On MacOSX Yosemite, you might also need to install Java (yes, I know... don't look at me this way...). You can download it from [this page](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).

#### Install the Chrome Driver

Download the chrome driver from http://chromedriver.storage.googleapis.com/, unzip it and move it to `test/lib/chromedriver`


#### Install nightwatch

    npm install -g nightwatch

And finally, you can run the tests:

    nightwatch --config test/nightwatch.json
    
Or simply put, `npm run test`


## Who is behind this?
<p>Xavier Damman (<a href="https://twitter.com/xdamman">@xdamman</a>), Mark Percival (<a href="https://twitter.com/mdp">@mdp</a>) and Thomas Gouverneur (<a href="https://twitter.com/tgouverneur">@tgouverneur</a>).</p>
<p>This is an open source project. Contributions are welcome! <a href="https://github.com/xdamman/tipbox">https://github.com/xdamman/tipbox</a>.

## Contributors

This project exists and survives thanks to all the people who contribute. [[Contribute]](blob/master/CONTRIBUTING.md).
<a href="graphs/contributors"><img src="https://opencollective.com/tipbox/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! [[Become a backer](https://opencollective.com/tipbox#backer)]

<a href="https://opencollective.com/tipbox#backers" target="_blank"><img src="https://opencollective.com/tipbox/backers.svg?width=890"></a>


## Sponsors

Thank you to all our sponsors! (please ask your company to also support this open source project by [[becoming a sponsor](https://opencollective.com/tipbox#sponsor))

<a href="https://opencollective.com/tipbox/sponsor/0/website" target="_blank"><img src="https://opencollective.com/tipbox/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/tipbox/sponsor/1/website" target="_blank"><img src="https://opencollective.com/tipbox/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/tipbox/sponsor/2/website" target="_blank"><img src="https://opencollective.com/tipbox/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/tipbox/sponsor/3/website" target="_blank"><img src="https://opencollective.com/tipbox/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/tipbox/sponsor/4/website" target="_blank"><img src="https://opencollective.com/tipbox/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/tipbox/sponsor/5/website" target="_blank"><img src="https://opencollective.com/tipbox/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/tipbox/sponsor/6/website" target="_blank"><img src="https://opencollective.com/tipbox/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/tipbox/sponsor/7/website" target="_blank"><img src="https://opencollective.com/tipbox/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/tipbox/sponsor/8/website" target="_blank"><img src="https://opencollective.com/tipbox/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/tipbox/sponsor/9/website" target="_blank"><img src="https://opencollective.com/tipbox/sponsor/9/avatar.svg"></a>


