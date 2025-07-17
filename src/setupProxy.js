const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://belparyaj.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/pragmatic/game',
      },
    }),
  );
};
