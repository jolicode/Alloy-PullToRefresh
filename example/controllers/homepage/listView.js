var args = arguments[0] || {};

var api = {
    data : {},

    initialize: function() {
        if (args.pulltorefresh) {
            args.pulltorefresh.setCallback(api.doRefresh);
        }

        updateListView(api.data);
    },

    doRefresh: function(e) {
        // Call your updateListView function
        updateListView(data);

    },

    updateListView: function() {
        if (args.pulltorefresh && api.data) {
            args.pulltorefresh.stop(api.data.length * 240, 20);
        }

        // The update of your listView
        // ...
    }
};

api.initialize();