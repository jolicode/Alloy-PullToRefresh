# Alloy PullToRefresh

## Description
The Titanium ALloy **Badass PullToRefresh** widget allows to refresh the page with a pull down when using a **ListView**. 
Available for **iOS and Android**, without any dependencie.
For iOS we use [the native refreshControl](http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.UI.RefreshControl), and for Android it's a custom pull to refresh. The header pull view is personalizable.

## Overview

![iOS PTR View](docs/iospullview.png)
![Android PTR PullDown]()
![Android PTR Release]()
![Android PTR Loading]()

## Installation

### Manual install
1. Download this widget and put it in the folder `app/widgets`
2. Declare the depedency in the `app/config.json` file:
	
		"dependencies": {
        	"com.jolicode.pullToRefresh": "1.0"
   	 	}
    
### Gittio install
You can use the command line: (need [gitt.io](http://gitt.io/) installed)

		$ gittio install com.jolicode.pullToRefresh


## Configuration

In your principal controller:

* In the `xml` file, where there will be your listView put this code: 

		<Widget src="com.jolicode.pullToRefresh" id="pulltorefresh"/>
		
* In the initialization of the `js` file put this code: 
	
		$.pulltorefresh.initialize({
        	controller: 'homepage/listView',
        });
        
	This is the minimal code you have to implement. 

	| Option       | Signification                                    |
	| ------------ |:------------------------------------------------:|
	| `controller` | Emplacement of the controller of your ListView   | 

	But you can add these parameters :
	
	* `iosRefreshControl`[Optional], that represents several properties of the native refresh control, that is specific to iOS's devices:

		| Option        | Signification                   | Type            | Default     | Documentation                 |
		| ------------- |:-------------------------------:|:---------------:|:-----------:|-------------------------------|
		|`tintColor`    | Color of the refreshControl     | String          | black       |[Ti.UI.RefreshControl](http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.UI.RefreshControl)|
		|`title`        | Attributes of the title         | AttributedString| none        |[Ti.UI.iOS.AttributedString](http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.UI.iOS.AttributedString)|

	* `headerPullView`[Optional], that represents several properties specifics to Android's devices:
	 	
	 	| Option        | Signification                   | Type            | Default     |
		| ------------- |:-------------------------------:|:---------------:|:-----------:|
		| `size`        | size of the headerPullView      | Number          | 60          |
		| 


* In the `js`file of yout listView:
	* In the initialization of the file put this code: 
	
	        if (args.pulltorefresh) {
           		args.pulltorefresh.setCallback(api.doRefresh);
        	}
	
	* In the function where you update your view you have to put this code:
		
			if (args.pulltorefresh && data) {
           		args.pulltorefresh.stop(data.length * 240, 20);
			}
			
		The first argument is the length of one item of your listView.
		
		The second argument [Optional] is the subtraction of the size of the header by the size of the navbar, if you don't have any navbar don't indicate this argument.
			
	* Add this function: 
	
			doRefresh: function(e) {
        		// Call your updateListView function
    		},

## Examples

	var refreshTitle = null;

    if (OS_IOS) {
        var text = "Hello people, it's a text for the refresh control, yeahhhhh ça rocks du poney !";
        refreshTitle = Titanium.UI.iOS.createAttributedString({
            text: text,
            attributes: [
                {
                    type: Titanium.UI.iOS.ATTRIBUTE_BACKGROUND_COLOR,
                    value: "red",
                    range: [text.indexOf('poney'), ('poney').length]
                },
            ]
        });
    }

    $.pulltorefresh.initialize({
        controller: 'homepage/listView',

        iosRefreshControl: {
            tintColor : '#FF7A00',
            title: refreshTitle,
        },
    });    