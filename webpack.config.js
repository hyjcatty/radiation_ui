/**
 * Created by hyj on 2016/8/19.
 */
module.exports = {
    entry: "./src/app/app.js",
    output: {
        path: __dirname+"/build",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015','react']
                }
            },{
                test:/\.css$/,
                loader:"style!css"
            },{
                test:/\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader:'url-loader?limit=50000&name=[path][name].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['','.coffee','.js']
    }
}