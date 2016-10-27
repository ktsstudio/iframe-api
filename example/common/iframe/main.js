var frameApi = new IframeAPI({
    frame: window.parent,
    url: 'http://127.0.0.1:8000/example/common/index.html'
});


setInterval(function () {
    var i = 0;
    var text = document.getElementById('text');
    return function () {
        i += 1;
        text.innerHTML = i + ' bottles of beer on the wall, ' + i + ' bottles of beer';

        location.hash = '#' + i;
        frameApi.send({
            method: 'setHash',
            data: location.hash
        });
    };
}(), 1000);