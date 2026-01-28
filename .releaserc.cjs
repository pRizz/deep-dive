module.exports = {
  branches: ["main"],
  tagFormat: "v${version}",
  plugins: ["./scripts/semantic-release-version.cjs", "@semantic-release/github"],
};
