// ./example/myRollup/rollup.config.js
const path = require("path");
const { rollup } = require("../../src/rollup");

const bundle = rollup({
  input: path.resolve(__dirname, "index.js"),
  output: {
    format: "es",
    filename: "lib/helloworld.js",
  },
});