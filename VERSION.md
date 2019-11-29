# v2.0.0-beta1

- Moved entire stack to Docker in order to make it easier to build and run the project
- Updated all the NPM modules, moved to Yarn to help provide a lockfile for future-proofing future builds.
- Move from SKS to keys.openpgp.org. SKS servers suffered an attack which left many user with a large number of fake keys. It's also fairly unreliable or slow.
- Reproducible and verifiable builds
    - Subresource integrety on all style and script assets
    - SHA256 of frontend/dist/index.html listed in VERSION.md for comparison and auditing
    - Users can build with Docker and get the same hash
- Removed any external scripts, and ability to load anything inline or external to the current domain via CSP
- Minor bugfixes and website updates