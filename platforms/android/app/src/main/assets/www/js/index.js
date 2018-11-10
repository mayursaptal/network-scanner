var refreshCacheBeforeFetch = true;

var response ;
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },


    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

    },


    // Update DOM on a Received Event - No such thing will happen :D
    receivedEvent: function(id) {
        app.runPlugin();
        app.portscan();
    },


    runPlugin: function() {
        if (refreshCacheBeforeFetch) {
            utils.updateElemById('messages', '<h3>Refreshing ARP Cache. This WILL take a couple of minutes. Patience!</h3>');
            utils.showLoading('Refreshing Cache...');
            ARP.refreshCache(function(resp) {
                console.log('Refresh Complete', resp);
                utils.hideLoading();
                app.fetchPeers();
            }, function(error) {
                utils.updateElemById('errors', error);
                utils.hideLoading();
            });
        } else {
            app.fetchPeers();
        }
    },

    fetchPeers: function() {
        utils.showLoading('Fetching Peers...');
        ARP.getParsedCache(function(resp) {
            console.log('Devices', resp);
            response = resp;
            var html = '<h4 class="text-center">Found ' + resp.length + ' devices</h4>';
            html += '<ul  class="iplist" id="iplist">';
            for (var i = 0; i < resp.length; i++) {
                var d = resp[i];
                html += '<li>';
                html += '<p>'
                html += '<label>IP Address: ' + d.ip + ' <label>'
                html += '<br>'
                html += '<label class="ipinfo">Mac Address: ' + d.mac + ' <label>'
                html += '<br class="ipinfo">'
                html += '<label class="ipinfo">mask: ' + d.mask + ' <label>'
                html += '<br class="ipinfo">'
                html += '<label class="ipinfo">device: ' + d.device + ' <label> <br>'
                html += '<label class="ipinfo">hostname: ' + d.hostname + ' <label> <br>'
                html += '<label class="ipinfo">CanonicalHostName: ' + d.CanonicalHostName + ' <label> <br>'
                 html += '<label class="ipinfo" id="'+d.ip+'">'
                html += '</p>'
                html += '</li>';

            }
            html += '</ul>';

           utils.updateElemById('devices', html);

           utils.hideLoading();
           utils.updateElemById('messages', '');

 for (var i = 0; i < resp.length; i++) {
            try{

              var d = resp[i];
             ARP.getMacFromIp( d.ip, function(port) {
              console.log(port);

            //    alert(port.port);
                     html = "port : " + port.port;
                           utils.updateElemById(port.ip, html);
                           // Output -> {"ip":"192.168.1.1","mac":"10:62:eb:7d:4a:df"}
                                    }, function(err) {
                                      console.log(err);
                                 });
            }catch(e){
            alert(e);
             }
}


        }, function(error) {
            utils.updateElemById('errors', error);
            utils.hideLoading();
        });


    }
 
};

var utils = {
    updateElemById: function(elem, html) {
        document.getElementById(elem).innerHTML = html;
    },
    showLoading: function(text) {
        text = text || 'Processing...';
        var loaderText = document.getElementById('loaderText');
        loaderText.innerText = text;
        var modal = document.getElementById('loader');
        modal.style.display = "block";
    },
    hideLoading: function() {
        var modal = document.getElementById('loader');
        modal.style.display = "none";
    }
}

app.initialize();


document.getElementById('refresh').addEventListener( "click", function() {
 app.initialize();

 });


