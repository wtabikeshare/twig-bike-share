'use strict';
var express = require('express'),
	router = express.Router(),
	routes = require('../routeTree'),
	seedDb = require('../../seeds').seedDb,
	twilio = require('../../modules/twilio');

var Admin = require('../../models/Admin');

router.get('/', function(req, res) {
	Admin.count({}, function(err, count) {
		if (count > 0) {
			res.sendStatus(404);
		} else {
			res.render('setup');
		}
	});
});

// Admin panel
router.post('/', function(req, res) {
	Admin.count({}, function(err, count) {
		if (count > 0) {
			res.sendStatus(404);
		} else {
			var admin = req.body.user;
			var newAdmin = new Admin({
				name: admin.name,
				username: admin.username
			});
			Admin.register(newAdmin, admin.password, function(err, admin) {
				if (err) {
					console.log(err);
					res.redirect(routes.admin);
				} else {
					console.log("added admin:" + admin.username);
					seedDb({
						admin: false,
						bikes: true
					});
					res.redirect(routes.admin);
				}
			twilio.setEndpoints();
			global.dbEmpty = false;
			});
		}
	});
});

module.exports = router;