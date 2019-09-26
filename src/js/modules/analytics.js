const addAnalytics = () => {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-3361191-12', 'auto');
    ga('send', 'pageview');
}

const subscriptions = () => {
    mediator.subscribe('play', () => {
        const artist = document.querySelector('.controls__track-artist').textContent;
        const title = document.querySelector('.controls__track-title').textContent;
        ga('send', 'event', 'play', artist + ' - ' + title);
    });
}

export default {
    init: () => {
        addAnalytics();
        subscriptions();
    },

    send: label => {
        ga('send', 'event', 'action', label);
    }
}