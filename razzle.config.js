const IS_CODESPACES = process.env.CODESPACES === "true";
const CODESPACES_NAME = process.env.CODESPACE_NAME;

module.exports = {
    modifyWebpackConfig(opts) {
        const webpackConfig = opts.webpackConfig;
        if (opts.env.target === 'web' && opts.env.dev && IS_CODESPACES) {
            const webpackConfig = opts.webpackConfig;
            const host = `${CODESPACES_NAME}-3001.githubpreview.dev`;
            webpackConfig.devServer.host = host;
            webpackConfig.output.publicPath = `https://${host}/`;
        }
        return webpackConfig;
    }
}