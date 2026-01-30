module.exports = {
  branches: ["main"],
  tagFormat: "${version}",
  plugins: ["./scripts/semantic-release-version.cjs", "@semantic-release/github"],
};
