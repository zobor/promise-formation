const { build } = require("esbuild");

const options = {
  entryPoints: ["./src/index.ts"],
  minify: process.env.NODE_ENV === "production",
  bundle: true,
  outfile: "./lib/index.js"
};

build(options).catch(err => {
  process.stderr.write(err.stderr);
  process.exit(1);
});
