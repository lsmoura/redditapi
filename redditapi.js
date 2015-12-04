/* redditapi.js */
"use strict";

(function(exports) {
	var credentials = {
		expires_in: 0
	};
	var redditEndpoint = 'https://oauth.reddit.com';
	var latestAnswer = null;

	function apiCall(parameters, callback) {
		if (!parameters.url) {
			// TODO: Throw error.
			console.error('Invalid parameters.');
			return;
		}
		var url = parameters.url;
		if (url.indexOf('http') < 0) {
			url = redditEndpoint + url;
		}
		var type = parameters.method || parameters.type || 'GET';
		var headers = parameters.headers || {};
		if (!parameters.username) {
			if (credentials.authorization && credentials.authorization != null)
				headers.Authorization = 'bearer ' + credentials.authorization;
		}
		if (!headers.Authorization) {
			console.log("No authorization!!");
			console.log(credentials);
		}

		var ajaxCall = {
			'type':		type,
			'url':		url,
			'headers':	headers,
			success: function(data) {
				console.log(data);
				latestAnswer = data;
				if (callback) callback(data);
			}
		};

		if (parameters.username) ajaxCall.username = parameters.username;
		if (parameters.password) ajaxCall.password = parameters.password;
		if (parameters.data) ajaxCall.data = parameters.data;

		//console.log(ajaxCall);

		$.ajax(ajaxCall);
	}

	exports.auth = function(data) {
		if (data.username) credentials.username = data.username;
		if (data.client_id) credentials.client_id = data.client_id;
		if (data.client_secret) credentials.client_secret = data.client_secret;
		if (data.authorization) credentials.authorization = data.authorization;
		if (data.expires_in) credentials.expires_in = data.expires_in;
	};
	
	exports.apiCall = apiCall;
	exports.getLatestAnswer = function() { return(latestAnswer); }
	exports.posts = function(callback, subreddit, method) {
		method = method || 'hot';

		var path = '/' + method;
		if (subreddit)
			path = '/r/' + subreddit + path;

		exports.apiCall({url: path}, callback);
	}
})((typeof exports === "undefined")?(window.redditapi = {}):exports);
