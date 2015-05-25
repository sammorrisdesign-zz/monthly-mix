define([

], function(

) {
    var ctx;
    var x = 0;
    var y = 0;
    var noOfDrops = 10;
    var size = 200;
    var fallingDrops = [];
    var canvas;
    var colour = ['#9bd5e0', '#c44f85', '#e2e2e2', '#7ecac6', '#5db456', '#e6d35f', '#fc7c62', '#797379', '#dedede', '#333', '#b51717'];

    return {
        init: function() {
            canvas = document.getElementsByClassName('home-header__canvas')[0];
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            if (canvas.getContext) {
                ctx = canvas.getContext('2d');
                setInterval(this.draw, 25);

                for (var i = 0; i < noOfDrops; i++) {
                    var fallingDr = new Object();
                    fallingDr["x"] =  Math.floor(Math.random() * (canvas.width + size)) - size;
                    fallingDr["y"] = Math.floor(Math.random() * canvas.height);
                    fallingDr["speed"] = 5 + Math.random() * 8;
                    fallingDr["fill"] = colour[i];
                    fallingDrops.push(fallingDr);
                }
            }
        },

        draw: function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i=0; i< noOfDrops; i++) {
                ctx.fillStyle = fallingDrops[i].fill;
                ctx.fillRect(fallingDrops[i].x, fallingDrops[i].y, size, size); //The rain drop

                fallingDrops[i].y += fallingDrops[i].speed; //Set the falling speed
                if (fallingDrops[i].y > canvas.height + size) {  //Repeat the raindrop when it falls out of view
                    fallingDrops[i].y = -size //Account for the image size
                    fallingDrops[i].x = Math.random() * canvas.width;    //Make it appear randomly along the width
                }

            }
        }
    }
});
