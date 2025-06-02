// plugins/withHuaweiRepo.js
const { withProjectBuildGradle } = require('@expo/config-plugins');

const withHuaweiRepo = (config) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      // Add Huawei repositories
      const huaweiRepos = `
        maven { url 'https://developer.huawei.com/repo/' }
        maven { url 'https://repo.huaweicloud.com/repository/maven/' }`;
      
      // Find allprojects repositories block and add Huawei repos
      config.modResults.contents = config.modResults.contents.replace(
        /(allprojects\s*{\s*repositories\s*{[^}]*)(}\s*})/,
        `$1${huaweiRepos}
    $2`
      );
    }
    return config;
  });
};

module.exports = withHuaweiRepo;