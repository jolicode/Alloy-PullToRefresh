var args = arguments[0] || {};

var api = {
    // initialization of our variables
    callback: null,

    content: null,
    contentView: null,
    headerPullView: null,
    headerPullControl: null,
    headerPullViewSize : 60,
    headerPullViewArgs : [],

    // ios ptr parameters
    iosRefreshControl: [],

    // android ptr flags
    isChecking: false,
    offset: 0, // The position of the scroll considering the pull action
    previousOffset: 0,
    pulling: false,
    reloading: false, // boolean to know if it's already reload

    initialize: function(parameters) {
        parameters.arguments = parameters.arguments || {};

        // create the controller given in argument witch we give the var api in argument
        api.content = Alloy.createController(parameters.controller, { pulltorefresh: api, arguments: parameters.arguments });

        api.contentView = api.content.getView();

        if (OS_IOS) {
            if (parameters.iosRefreshControl) {
                api.iosRefreshControl.tintColor = parameters.iosRefreshControl.tintColor ? parameters.iosRefreshControl.tintColor : 'black';
                api.iosRefreshControl.title = parameters.iosRefreshControl.title ? parameters.iosRefreshControl.title : null;
            }

            var control = Ti.UI.createRefreshControl({
                tintColor: api.iosRefreshControl.tintColor,
                title: api.iosRefreshControl.title
            });
            control.addEventListener('refreshstart', api.doRefresh);
            api.contentView.refreshControl = control;

            $.pulltorefresh.add(api.contentView);
        }
        // Our headerpullView for other devices
        else {

            if (parameters.headerPullView) {
                api.headerPullViewArgs = parameters.headerPullView;
                if (parameters.headerPullView.view) {
                    api.headerPullViewSize = parameters.headerPullView.view.size ? parameters.headerPullView.view.size : 60;
                }
            }

            // create the controller headerPullView
            api.headerPullControl = Widget.createController('headerPullView', { parameters: api.headerPullViewArgs });
            api.headerPullView = api.headerPullControl.getView();

            // add it in the ptr scrollview
            $.container.add(api.headerPullView);
            $.container.addEventListener('touchend', api.touchEnd);
            $.container.addEventListener('scroll', api.scroll);

            // add the content to the root of the ptr component
            $.container.add(api.contentView);
        }
    },

    /*
     * Callback function to refresh the data
     * of your ListView
     */
    doRefresh: function() {
        if (api.callback) {
            api.callback();
        } else {
            api.stop();
        }
    },

    setCallback: function(callback) {
        api.callback = callback;
    },

    // only for Android
    scroll: function(e) {
        if (e.y != null) {
            api.offset = e.y;
        }

        if (!api.isChecking) {
            api.isChecking = true;

            var interval = setInterval(function() {
                if (api.previousOffset != api.offset) {
                    api.previousOffset = api.offset;
                    api.isChecking = true;
                } else {

                    if (api.offset !== api.headerPullViewSize * Ti.Platform.displayCaps.logicalDensityFactor){

                        // the scroll has ended \o/
                        clearInterval(interval);
                        api.isChecking = false;
                        api.touchEnd();
                    }
                }
            }, 2000);
        }

        if (api.offset <= 0 && !api.pulling) {
            api.pulling = true;
            api.headerPullControl.pulling();
        } else if (api.pulling && api.offset >= 1 && api.offset < api.headerPullViewSize * Ti.Platform.displayCaps.logicalDensityFactor) {

            api.pulling = false;
            api.headerPullControl.pullingStop();
        }
    },

    /**
     *   contentHeight: height of the content
     *   hideHeight : size of the header - size of the navBar if there is a navBar
     */
    stop: function(contentHeight, hideHeight) {
        hideHeight = hideHeight || 0;

        if (OS_ANDROID) {
            api.reloading = false;
            $.container.scrollTo(0, api.headerPullViewSize * Ti.Platform.displayCaps.logicalDensityFactor);
            api.headerPullControl && api.headerPullControl.updateComplete();

            if (contentHeight) {
                $.container.contentHeight = hideHeight * Ti.Platform.displayCaps.logicalDensityFactor
                    + Math.max(contentHeight * Ti.Platform.displayCaps.logicalDensityFactor, Ti.Platform.displayCaps.platformHeight);
            }
        } else {
            if (api.contentView && api.contentView.refreshControl) {
                api.contentView.refreshControl.endRefreshing();
            }
        }
    },

    /*
     *
     */
    touchEnd: function(e) {
        if (api.offset <= 0) {
            if (api.pulling && !api.reloading) {
                api.reloading = true;
                api.pulling = false;
                api.headerPullControl.pullingComplete();
                api.doRefresh();
            }

        } else if (api.offset < api.headerPullViewSize * Ti.Platform.displayCaps.logicalDensityFactor) {
            api.pulling = false;
            api.headerPullControl.pullingStop();
            api.stop();
        }
    },
};

exports.initialize = api.initialize;
