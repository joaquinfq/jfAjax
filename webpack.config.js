const IS_PRO = process.env.NODE_ENV === 'production';
const path   = require('path');
const config = {
    target  : 'web',
    entry   : './src/index.es7',
    output  : {
        path          : path.join(__dirname, 'build'),
        pathinfo      : true,
        filename      : IS_PRO ? 'jf.ajax.min.js' : 'jf.ajax.js',
        library       : ['jf', 'ajax'],
        libraryTarget : 'umd'
    },
    module  : {
        loaders : [
            {
                test   : /\.es7$/,
                loader : 'babel-loader',
                query  : {
                    plugins : [
                        'transform-class-properties',
                        'transform-object-assign',
                        'transform-runtime'
                    ],
                    presets : [
                        [
                            'es2015',
                            {
                                modules : false
                            }
                        ]
                    ]
                }
            }
        ]
    },
    plugins : [],
    resolve : {
        extensions : [ '.js', '.es7' ]
    }
};
if (!IS_PRO)
{
    config.devtool = '#inline-source-map';
}
module.exports = config;
