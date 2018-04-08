Pin Stack Decoder
==================

A web app that assists in decoding pin stacks from disassembled lock in order to
determine various compatible keys.

Try it out: https://farlepet.github.io/pin-stack-decoder/

Currently supported formats:
 * Best/Sargent/Other SFIC
   * A2, A3, A4

To add more keys, edit `src/pindata.json` If you have a key specification you would
like for me to add, just contact me, or edit pindata.json and send me a pull request.

Build and run
=============

Build requirements:
 * `sassc`
 * `make`
 * `tsc`: Typescript

Building:
 1. Run `tsc` to build typescript
 2. Run `make scss-compile` to build stylesheets
 3. Run `make copy-web` to copy static content

To run, just point a web browser to `./dist/index.html`