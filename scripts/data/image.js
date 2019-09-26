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
    'november': '#e4a4bb',
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

            // convert image to grayscale
            const canvasData = ctx.getImageData(0, 0, 1280, 720);
            const data = canvasData.data;
            const arrayLength = 1280 * 720 * 4;

            for (var i = arrayLength-1; i> 0; i-=4) {
                let gray = 0.3 * data[i-3] + 0.59 * data[i-2] + 0.11 * data[i-1];
                data[i-3] = gray;
                data[i-2] = gray;
                data[i-1] = gray;
            }

            ctx.putImageData(canvasData, 0, 0);

            // convert image to duotone
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = colours[playlist.month.toLowerCase()];
            ctx.beginPath();
            ctx.rect(0, 0, 1280, 720);
            ctx.closePath();
            ctx.fill();

            // write image
            const buffer = canvi.toBuffer('image/jpeg', { quality: 0.8 });
            fs.writeFileSync('./.build/assets/images/' + playlist.title.toLowerCase().replace(/ /g, '-') + '.jpeg', buffer);

            isGeneratingImage = false;
        });

        require('deasync').loopWhile(function() { return isGeneratingImage; });
    }
}