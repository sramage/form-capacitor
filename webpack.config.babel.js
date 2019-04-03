const src = `${__dirname}/src`;
const dist = `${__dirname}/dist`;

module.exports = {
    mode: "production",
    entry: src + "/index.js",
    output: {
        library: "FormCapacitor",
        libraryTarget: "umd",
        filename: "form-capacitor.js",
        path: dist,
        globalObject: "this"
    },
    externals: {
        react: "react",
        "react-dom": "react-dom",
        mobx: "mobx",
        "mobx-react": "mobx-react",
        "mobx-state-tree": "mobx-state-tree",
        "json-schema-ref-parser": "json-schema-ref-parser",
        ajv: "ajv",
        lodash: "lodash"
    },
    module: {
        rules: [
            {
                test: /\.(jsx?)$/,
                include: src,
                use: "babel-loader"
            }
        ]
    }
};