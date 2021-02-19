module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'views': '@/views',
                'network': '@/network',
                'service': '@/service',
                'store': '@/store',
            }
        }
    },
    //开发环境使用，生产环境无效，开发环境需要使用反向代理
    devServer: {
        // host: '0.0.0.0',
        // port: '8080',
        proxy: {
            '/dev_api': {
                target: 'http://127.0.0.1:8088',
                // target: 'http://192.168.1.192:81',
                changeOrigin: true,
                pathRewrite: {
                    '^/dev_api': ''
                }
            },
        }
    }
}