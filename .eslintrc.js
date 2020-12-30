module.exports = {
  extends: "@shark/eslint-config/lib/ts",
  plugins: ["import"],
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
    ]
  }
};
