// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This sourcea code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
* 路径管理
*
*/
// @remove-on-eject-end

// 路径管理
const path = require('path');
// 文件管理
const fs = require('fs');
// 公共路径的统一处理
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
// 返回规范化的绝对​​路径名 process.cwd(): node的路径
const appDirectory = fs.realpathSync(process.cwd());

// 采用path.resolve包裹，获取对应的文件的绝对路径
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.

// 获取路径
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);

// 定义module的扩展名
const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  // 判断是否存在文件路径+后缀名的文件；
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  // 如果存在，则直接返回拼装好的文件路径
  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  // 否则直接返回后缀为js的路径
  return resolveFn(`${filePath}.js`);
};

// config after eject: we're in ./config/
module.exports = {
  // .env文件的绝对路径
  dotenv: resolveApp('.env'),
  // 当前路径对应的绝对路径地址
  appPath: resolveApp('.'),
  // build文件夹对应的绝对路径地址
  appBuild: resolveApp('build'),
  // public文件夹对应的绝对路径地址
  appPublic: resolveApp('public'),
  // public/index.html对应的绝对路径地址
  appHtml: resolveApp('public/index.html'),
  // src/index对应的moduleFileExtensions后缀的文件路径地址
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  // package.json对应的文件路径地址
  appPackageJson: resolveApp('package.json'),
  // src对应的文件夹路径地址
  appSrc: resolveApp('src'),
  // tsconfig.json文件对应的路径地址
  appTsConfig: resolveApp('tsconfig.json'),
  // jsconfig.json文件对应的路径地址
  appJsConfig: resolveApp('jsconfig.json'),
  // yarn.lock文件对应的路径地址
  yarnLockFile: resolveApp('yarn.lock'),
  // src/setupTests对应的moduleFileExtensions后缀的文件路径地址
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  // src/setupProxy.js对应的文件路径地址
  proxySetup: resolveApp('src/setupProxy.js'),
  // node_modules对应的文件路径地址
  appNodeModules: resolveApp('node_modules'),
  // src/service-worker对应的moduleFileExtensions后缀的文件路径地址
  swSrc: resolveModule(resolveApp, 'src/service-worker'),
  // 路径地址
  publicUrlOrPath,
};

// @remove-on-eject-begin
// 当前路径跳出一层文件夹下的relativePath
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

// config before eject: we're in ./node_modules/react-scripts/config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  swSrc: resolveModule(resolveApp, 'src/service-worker'),
  publicUrlOrPath,
  // These properties only exist before ejecting:
  // 这些属性仅在弹出之前存在
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'), // This is empty on npm 3
  appTypeDeclarations: resolveApp('src/react-app-env.d.ts'),
  ownTypeDeclarations: resolveOwn('lib/react-app.d.ts'),
};

// 读取自己packageJson
const ownPackageJson = require('../package.json');
// 获取对应的name
const reactScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);

/**
 *
 * 如果 fs.Stats 对象描述符号链接，则返回 true。此方法仅在使用 fs.lstat() 时有效。
 */
const reactScriptsLinked =
  fs.existsSync(reactScriptsPath) &&
  fs.lstatSync(reactScriptsPath).isSymbolicLink();

// config before publish: we're in ./packages/react-scripts/config/
/**
 * 项目路径下不存在package.json的配置，
 * 切对应的react-scripts/config路径也不存在则去导出对应的create-react-app的包信息
 */
if (
  !reactScriptsLinked &&
  __dirname.indexOf(path.join('packages', 'react-scripts', 'config')) !== -1
) {
  const templatePath = '../cra-template/template';
  module.exports = {
    dotenv: resolveOwn(`${templatePath}/.env`),
    appPath: resolveApp('.'),
    appBuild: resolveOwn('../../build'),
    appPublic: resolveOwn(`${templatePath}/public`),
    appHtml: resolveOwn(`${templatePath}/public/index.html`),
    appIndexJs: resolveModule(resolveOwn, `${templatePath}/src/index`),
    appPackageJson: resolveOwn('package.json'),
    appSrc: resolveOwn(`${templatePath}/src`),
    appTsConfig: resolveOwn(`${templatePath}/tsconfig.json`),
    appJsConfig: resolveOwn(`${templatePath}/jsconfig.json`),
    yarnLockFile: resolveOwn(`${templatePath}/yarn.lock`),
    testsSetup: resolveModule(resolveOwn, `${templatePath}/src/setupTests`),
    proxySetup: resolveOwn(`${templatePath}/src/setupProxy.js`),
    appNodeModules: resolveOwn('node_modules'),
    swSrc: resolveModule(resolveOwn, `${templatePath}/src/service-worker`),
    publicUrlOrPath,
    // These properties only exist before ejecting:
    ownPath: resolveOwn('.'),
    ownNodeModules: resolveOwn('node_modules'),
    appTypeDeclarations: resolveOwn(`${templatePath}/src/react-app-env.d.ts`),
    ownTypeDeclarations: resolveOwn('lib/react-app.d.ts'),
  };
}
// @remove-on-eject-end

module.exports.moduleFileExtensions = moduleFileExtensions;
