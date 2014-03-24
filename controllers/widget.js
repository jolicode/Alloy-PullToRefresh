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

        // create the controller given in argument witch we give the var api in argument
        api.content = Alloy.createController(parameters.controller, { pulltorefresh: api });

        // Get the content of this controller
        api.contentView = api.content.getView();

        // Native refresh control for iOS
        if (OS_IOS) {
            if (parameters.iosRefreshControl) {
                api.iosRefreshControl.tintColor = parameters.iosRefreshControl.tintColor ? parameters.iosRefreshControl.tintColor : 'black';
                api.iosRefreshControl.title = parameters.iosRefreshControl.title ? parameters.iosRefreshControl.title : null;
            }

            // create a refresh control
            var control = Ti.UI.createRefreshControl({
                tintColor: api.iosRefreshControl.tintColor,
                title: api.iosRefreshControl.title
            });
            control.addEventListener('refreshstart', api.doRefresh);
            api.contentView.refreshControl = control;

            // add it to the root of the ptr component
            $.pulltorefresh.add(api.contentView);
        }
        // Our headerpullView for other devices
        else {

            if (parameters.headerPullView) {
                api.headerPullViewArgs = parameters.headerPullView;
                Ti.API.info("api.headerPullViewArgs: ");
                Ti.API.info(api.headerPullViewArgs );
                api.headerPullViewSize = parameters.headerPullView.view.size ? parameters.headerPullView.view.size : 60;
            }

            // create the controller headerPullView
            api.headerPullControl = Widget.createController('headerPullView', { parameters: api.headerPullViewArgs });
            api.headerPullView = api.headerPullControl.getView();
            $.container.add(api.headerPullView);


            // add it in the ptr scrollview
            $.container.addEventListener('touchend', api.touchEnd);
            $.container.addEventListener('scroll', api.scroll);
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
                    if (api.offset !== api.headerPullViewSize){
                        // the scroll has ended \o/
                        clearInterval(interval);
                        api.isChecking = false;
                        api.touchEnd();
                    }
                }
            }, 500);
        }

        var offsetMax = api.headerPullViewSize-1;

        if (api.offset == 0 && !api.pulling) {
            api.pulling = true;
            api.headerPullControl.pulling();
        } else if (api.pulling && api.offset > 1 && api.offset < offsetMax) {
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
            $.container.scrollTo(0, api.headerPullViewSize);
            api.headerPullControl && api.headerPullControl.updateComplete();

            if (contentHeight) {
                screenHeight =  Ti.Platform.displayCaps.platformHeight + hideHeight;
                $.container.contentHeight = contentHeight > screenHeight ? contentHeight + hideHeight : screenHeight;
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
        if (api.offset == 0) {

            if (api.pulling && !api.reloading) {
                api.reloading = true;
                api.pulling = false;
                api.headerPullControl.pullingComplete();
                api.doRefresh();
            }
        } else if (api.offset < api.headerPullViewSize) {
            api.pulling = false;
            api.headerPullControl.pullingStop();
            $.container.setContentOffset({x: 0, y: api.headerPullViewSize});
        }
    },
};

exports.initialize = api.initialize;