const fs = require('fs-extra');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
    init: function() {
        let isCompiling = false;

        this.bundle();
    },

    bundle: function() {
        const inputOptions = {
            input: './src/js/main.js',
            plugins: [
                resolve(),
                commonjs()
            ]
        };

        const outputOptions = {
            format: 'iife'
        };

        (async function() {
            const bundle = await rollup.rollup(inputOptions);
            const output = await bundle.generate(outputOptions);
            fs.mkdirsSync('.build/assets/js');
            fs.writeFileSync('.build/assets/js/main.js', output.output[0].code);
        })();
    }
}
