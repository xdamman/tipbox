Steps to use Docker/docker-compose to run your own tipbox

1. Edit .env and update with your own variables
1. Build the image and create a new PGP key
  - docker-compose build server
  - docker-compose run --rm server node ./server/utils/keygen.js
1. Run all the services
  - `docker-compose up -d`

