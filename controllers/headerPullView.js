var args = arguments[0] || {};
var parameters = args["parameters"] || {};

var moment = require('alloy/moment');

var api = {

    initialize : function() {
        if (parameters) {
            if (parameters.view) {
                $.headerPullView.height = parameters.view.size ? parameters.view.size : 60;
                $.headerPullView.backgroundColor = parameters.view.backgroundColor ? parameters.view.backgroundColor :'FFF';
            }

            if (parameters.border) {
                $.border.backgroundColor = parameters.border.backgroundColor ? parameters.border.backgroundColor : 'black';
                $.border.height = parameters.border.height ? parameters.border.height : 2;
            }

            if (parameters.arrow) {
                $.arrow.backgroundImage = parameters.arrow.backgroundImage ? parameters.arrow.backgroundImage : WPATH('/images/arrow.png');
                $.arrow.bottom = parameters.arrow.bottom ? parameters.arrow.bottom : 7;
                $.arrow.height = parameters.arrow.height ? parameters.arrow.height : 45;
                $.arrow.left = parameters.arrow.left ? parameters.arrow.left : 35;
                $.arrow.width = parameters.arrow.width ? parameters.arrow.width : 11;
            }

            if (parameters.indicator) {
                $.indicator.bottom = parameters.indicator.bottom ? parameters.indicator.bottom : "auto";
                $.indicator.left = parameters.indicator.left ? parameters.indicator.left : "auto";
                $.indicator.right = parameters.indicator.right ? parameters.indicator.right : "auto";
                $.indicator.top = parameters.indicator.top ? parameters.indicator.top : 0;
            }

            if (parameters.status) {
                $.status.bottom =  parameters.status.bottom ? parameters.status.bottom : 30 ;
                $.status.color = parameters.status.color ? parameters.status.color: "black";
                $.status.font = parameters.status.font ? parameters.status.font : { fontSize : 13, fontWeight: "bold" };
                $.status.height = parameters.status.height ? parameters.status.height: "auto";
                $.status.textAlign = parameters.status.textAlign ? parameters.status.textAlign : "center";
                $.status.width = parameters.status.width ? parameters.status.width: 200;
            }

            if (parameters.lastUpdate) {
                $.lastUpdate.bottom = parameters.lastUpdate.bottom ? parameters.lastUpdate.bottom :  15,
                $.lastUpdate.color = parameters.lastUpdate.color ? parameters.lastUpdate.color :  "black",
                $.lastUpdate.font = parameters.lastUpdate.font ? parameters.lastUpdate.font : { fontSize: 12 },
                $.lastUpdate.height = parameters.lastUpdate.height ? parameters.lastUpdate.height :  "auto",
                $.lastUpdate.textAlign = parameters.lastUpdate.textAlign ? parameters.lastUpdate.textAlign : "center";
                $.lastUpdate.width = parameters.lastUpdate.width ? parameters.lastUpdate.width: 200;
            }
        }
    },

    formatDate: function(date) {
        var date = date ? date : new Date();
        return moment(date).format('LLL');
    },

    pulling: function() {
        var t = Ti.UI.create2DMatrix();
        t = t.rotate(-180);
        $.arrow.animate({
            transform: t,
            duration: 180
        });
        $.status.text = L('release_to_update');
    },

    pullingComplete: function() {
        $.arrow.hide();
        $.indicator.show();
        $.status.text = L('loading');
        $.arrow.transform = Ti.UI.create2DMatrix();
    },

    pullingStop: function() {
        var t = Ti.UI.create2DMatrix();
        $.arrow.animate({
            transform: t,
            duration: 180
        });
        $.status.text = L('pull_to_reload');
    },

    updateComplete: function() {
        $.indicator.hide();
        $.arrow.show();
        $.status.text = L('pull_to_reload');
        $.lastUpdate.text = L('updated_at') + ' ' + api.formatDate();
    }
};

exports.pulling = api.pulling;
exports.pullingComplete = api.pullingComplete;
exports.pullingStop = api.pullingStop;
exports.updateComplete = api.updateComplete;

api.initialize();
api.updateComplete();
