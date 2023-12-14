export const rewriteUnsupportedBrowserMethods = (req, res, next) => {
	// If the user posts to the server with a property called _method, rewrite the request's method
	// To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
	// rewritten in this middleware to a PUT route
	if (req.body && req.body._method) {
		req.method = req.body._method;
		delete req.body._method;
	}

	// let the next middleware run:
	next();
};

export const defaultRedirect = async (req, res, next, app) => {
	app.locals.authenticated = !!req.session.user;

	console.log(
		`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${
			app.locals.authenticated
				? "Authenticated User"
				: "Non-Authenticated User"
		})`
	);

	next();
};

export const accountRedirect = async (req, res, next) => {
	if (req.method === "GET" && !req.session.user) {
		return res.redirect("/login");
	}

	if (req.method === "POST" && req.session.user) {
		return res.redirect("/account");
	}

	next();
};

export const registerRedirect = async (req, res, next) => {
	if (req.session.user) {
		return res.redirect("/");
	}

	next();
};

export const loginRedirect = async (req, res, next) => {
	if (req.session.user) {
		return res.redirect("/");
	}

	next();
};

export const logoutRedirect = async (req, res, next) => {
	if (!req.session.user) {
		return res.redirect("/");
	}

	next();
};
