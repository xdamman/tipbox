# v2.0.0-beta5

- Moved entire stack to Docker in order to make it easier to build and run the project
- Updated all the NPM modules, moved to Yarn to help provide a lockfile for future-proofing future builds.
- Move from SKS to keys.openpgp.org. SKS servers suffered an attack which left many user with a large number of fake keys. It's also fairly unreliable or slow.
- Reproducible and verifiable builds
    - Subresource integrety on all style and script assets
    - SHA256 of frontend/dist/index.html listed in VERSION.md for comparison and auditing
    - Users can build with Docker and get the same hash if they have the server public key
- Removed any external scripts, and ability to load anything inline or external to the current domain via CSP
- ESLint everything
- Minor bugfixes and website updates

### Hashes:
    - tipbox.is: b21747edac9acc2fb7daaf414cf0c3dc1b5645fac73fdfa0852d95032942ac96 

