import Mediator  from '../../node_modules/mediator-js/lib/mediator';
window.mediator = new Mediator.Mediator();

import cover from './modules/cover.js';
import youtube from './modules/youtube.js';
import player from './modules/player.js';
import controls from './modules/controls.js';

cover.init();
youtube.init();
player.init();
controls.init();