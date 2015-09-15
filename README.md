# Tipbox

Share a unique URL to receive anonymous tips.

## Main features
- Nothing to install for the tipsters, they just need to open the unique URL generated at the creation of the Tipbox.
- Support for photo/document upload.
- Stateless, no logs in production (no information is ever saved).
- Unique information about the Tipbox is in the hash of the URL so that no one can tell who opened a particular Tipbox by monitoring the network traffic.
- PGP encryption between the frontend and the backend so that men-in-the-middle can't read the content of the requests sent to the backend.
- Support for End-To-End encryption with PGP.
- Automatically fetches the PGP key of the recipient from public key servers at the creation of the tipbox if one exists (you need to manually verify and select it to avoid spoofing).

## Disclaimer
*This is open source software, use at your own risk.*

There is always a tradeoff between ease of use and security (that's why you don't live in a bunker). By not requiring your potential sources to install an app, there is a risk that a hacker could tamper with the files served to them to include a key logger. Depending on your threat model, this may or may not matter. It’s all about finding the appropriate tool for the job. 
[Read more about the security of Tipbox](https://tipbox.is#security).

## How install

### Setting up the keys for testing

    PASSPHRASE=1234 IDENTITY="<tips@tipbox.in>" node ./server/utils/keygen.js
    # Will generate private and public keys under the 'keys' directory

### Running the server with the keys

    PGP_PASSPHRASE=1234 npm start


### Locally for development:

After cloning this repo, simply run

    npm install --dev
    npm run dev

This will serve the static files from `frontend/src` and watch for any change.
When any file in `frontend/src/less/` or `frontend/src/js/*` changes, `gulp` will run the `less` and the `browserify` tasks.


### In production mode

   	npm install;
   	npm run build;
   	NODE_ENV=tipbox.is npm start;

This will serve the static files from `frontend/dist`.

## Generating an invitation URL
During the private beta, an invitation code is required to create a tipbox. 
You can generate one with the following command line:

    NODE_ENV=production PGP_PASSPHRASE=1234 HMAC_KEY=[HMAC_KEY of the server] node invite.js [email address]

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

<h3>Who is behind this?</h3>
<p>Xavier Damman (<a href="https://twitter.com/xdamman">@xdamman</a>) and Mark Percival (<a href="https://twitter.com/mdp">@mdp</a>)</p>
<p>This is an open source project. Contributions are welcome! <a href="https://github.com/xdamman/tipbox">https://github.com/xdamman/tipbox</a>.
