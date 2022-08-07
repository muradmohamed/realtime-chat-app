import bcrypt from 'bcrypt';

export default async function handler(req, res) {
	let error;
	const { name, email, password, password2 } = req.body;

	// Check all fields were filled in
	if (!name || !email || !password || !password2) error = 'Please fill in all fields!';

	// check if passwords match
	if (password !== password2) error = 'Passwords dont match!';


	// check if password is more than 6 characters
	if (password.length < 6) error = 'Password must be atleast 6 characters long!';

	// If an error was found notify user
	if (error) {
		return res.redirect('/register');
	}


	// Encrypt password (Dont save raw password to database)
	let Hashpassword;
	try {
		const salt = await bcrypt.genSalt(10);
		Hashpassword = await bcrypt.hash(password, salt);
	} catch (err) {
		req.flash('error', 'Failed to encrypt password');
		res.redirect('/register');
		return console.log(err);
	}

	// Save the new user to database + make sure to create folder
	try {
		const g = await fetch(`${process.env.APIURL}/api/auth/register`, {
			method: 'post',
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
			body: JSON.stringify({
				password: Hashpassword,
				email: email,
				username: name,
				code: '100',
			}),
		});
		console.log(g);
		console.log(await g.json());
		console.log(`New user: ${email}`);
		res.redirect('/');
	} catch (err) {
		console.log(err);
		res.redirect('/login');
	}

}
