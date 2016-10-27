(function initialze() {
    var APP_URL = 'http://127.0.0.1:8000/example/common/iframe/index.html';

    var frame = document.getElementById('app');
    var fullAppUrl = location.href.replace(/^.+\/\/[^\/]+/, APP_URL);
    frame.src = APP_URL;


    var iframeAPI = new IframeAPI({
        url: fullAppUrl,
        frame: frame,
        methods: {
            getScrollPosition: function(){
                iframeAPI.send({
                    method: 'receiveScrollPosition',
                    data: window.pageYOffset || document.documentElement.scrollTop
                });
            },
            scrollToTop: function(){
                document.body.scrollTop = 0;
            },
            setHeight: function(height){
                frame.style.height = height + 'px';
            },
            getLocation: function(){
                iframeAPI.send({
                    method: 'receiveLocation',
                    data: location.pathname + '/' + location.search + location.hash
                });
            },
            setHash: function(hash){
                location.hash = hash;
            }
        }
    });
})();