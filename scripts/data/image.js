const canvas = require('canvas');
const fs = require('fs-extra');

const colours = {
    'january': '#0d0df4',
    'february': '#1a9ef2',
    'march': '#66e0c8',
    'april': '#19e479',
    'may': '#b6df12',
    'june': '#ffc333',
    'july': '#e6711b',
    'august': '#d8192b',
    'september': '#e6256c',
    'october': '#e4a4bb',
    'november': '#8b14a1',
    'december': '#4c20c9'
}

module.exports = {
    generateFor: function(playlist) {
        let isGeneratingImage = true;
        const canvi = canvas.createCanvas(1280, 720);
        const ctx = canvi.getContext('2d');

        canvas.loadImage(playlist.cover).then(image => {
            console.log('generating image for', playlist.title);
            ctx.drawImage(image, 0, 0, 1280, 720);

            // create duotone gradient
            const canvasData = ctx.getImageData(0, 0, 1280, 720);
            const data = canvasData.data;
            let gradient = [];
            const minValue = 0;
            const maxValue = 200;
            const from = this.getRGBColor('#000000');
            const to = this.getRGBColor(colours[playlist.month.toLowerCase()]);

            for (var i = minValue; i <= maxValue; i++) {
                const intensityB = i;
                const intensityA = maxValue - intensityB;
                gradient[i] = {
                    r: (intensityA*from.r + intensityB*to.r) / maxValue,
                    g: (intensityA*from.g + intensityB*to.g) / maxValue,
                    b: (intensityA*from.b + intensityB*to.b) / maxValue
                }
            }

            const offset = 256 - maxValue;

            for (var i = 0; i <= offset; i++) {
                if (offset / 4 > i) {
                    gradient.unshift(gradient[0]);
                } else {
                    gradient.push(gradient[gradient.length - 1]);
                }
            }

            // convert pixels to greyscale then map on to graident
            for (var i = 0; i < data.length; i+=4) {
                const redValue = data[i];
                const greenValue = data[i+1];
                const blueValue = data[i+2];
                let grey = Math.floor(0.3 * redValue + 0.59 * greenValue + 0.11 * blueValue); 

                data[i] = gradient[grey].r;
                data[i+1] = gradient[grey].g;
                data[i+2] = gradient[grey].b;
                data[i+3] = 255;
            }

            ctx.putImageData(canvasData, 0, 0);

            // write image
            const buffer = canvi.toBuffer('image/jpeg', { quality: 0.8 });
            if (!fs.existsSync('./.images/')) {
                fs.mkdirsSync('./.images');
            }
            fs.writeFileSync('./.images/' + playlist.title.toLowerCase().replace(/ /g, '-') + '.jpeg', buffer);

            isGeneratingImage = false;
        });

        require('deasync').loopWhile(function() { return isGeneratingImage; });
    },

    getRGBColor: function(hex) {
        let colorValue;
        hex = hex.substr(1);
        colorValue = parseInt(hex, 16);

        return {
            r: colorValue >> 16,
            g: (colorValue >> 8) & 255,
            b: colorValue & 255
        }
    }
}