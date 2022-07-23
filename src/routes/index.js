const express = require('express'),
	router = express.Router();

router.get('/', (req, res) => {
	res.render('index', {
		user: req.isAuthenticated() ? req.user : null,
	});
});

router.get('/app', (req, res) => {
	if (!req.isAuthenticated()) return res.redirect('/');
	res.render('app');
});

router.get('/login', (req, res) => {
	if (req.isAuthenticated()) return res.redirect('/app');
	res.render('login', {
		error: req.flash('error'),
		name: req.flash('name'),
	});
});

router.get('/register', (req, res) => {
	if (req.isAuthenticated()) return res.redirect('/app');
	res.render('register', {
		error: req.flash('error'),
		name:	req.flash('name'),
		email: req.flash('email'),
	});
});

module.exports = router;
