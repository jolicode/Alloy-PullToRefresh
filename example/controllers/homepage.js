var args = arguments[0] || {};

var api = {
    initialize: function() {
        $.pulltorefresh.initialize({
            arguments: {},
            controller: 'homepage/listView',

            iosRefreshControl: {
                tintColor : '#FF7A00',
            },

            headerPullView : {
                arrow : {
                    bottom: 10,
                    height: 46,
                    left: 35,
                    width: 11
                },
                border : {
                    backgroundColor: '#FF7A00',
                },
                lastUpdate : {
                    color: "#FF7A00",
                },
                status : {
                    color: '#FF7A00',
                },
            }
        });
    }


};

api.initialize();