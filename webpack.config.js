const path = require('path');

let entryPoint = "./src/index.js";
let outputDirectory = "dist";
let fileName = "viewbind.js";

if (process.env.VIEWBIND_TEST)
{
    entryPoint = "./tests/index.js";
    outputDirectory = "tests-dist";
    fileName = "main.js"
}

module.exports = {
    entry: entryPoint,
    output: {
        path: path.resolve(__dirname, outputDirectory),
        filename: fileName,
        library: "viewbind"
    }
};