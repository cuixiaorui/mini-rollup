const { Bundle } = require("./Bundle");

exports.rollup = (config) => {
  const bundle = new Bundle({
    config,
  });

  bundle.build();

  return bundle;
};
