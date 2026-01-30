const fs = require("node:fs/promises");
const path = require("node:path");

const readUiVersion = async () => {
  const uiPackagePath = path.join(__dirname, "..", "ui", "package.json");
  const content = await fs.readFile(uiPackagePath, "utf8");
  const data = JSON.parse(content);
  return data.version;
};

const setNextReleaseVersion = async (context) => {
  const uiVersion = await readUiVersion();
  if (!uiVersion) {
    return null;
  }

  const lastVersion = context.lastRelease?.version;
  if (lastVersion === uiVersion) {
    context.logger.log(
      `No release: ui version ${uiVersion} matches last tag.`,
    );
    return null;
  }

  context.nextRelease = {
    ...(context.nextRelease ?? {}),
    version: uiVersion,
    gitTag: uiVersion,
  };

  return uiVersion;
};

module.exports = {
  analyzeCommits: async (pluginConfig, context) => {
    const uiVersion = await setNextReleaseVersion(context);
    if (!uiVersion) {
      return null;
    }

    return "patch";
  },
  verifyRelease: async (pluginConfig, context) => {
    await setNextReleaseVersion(context);
  },
};
