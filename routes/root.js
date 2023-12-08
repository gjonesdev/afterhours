import { Router } from "express";
import { validateEmail, validatePassword } from "../helpers.js";
import { login } from "../data/accounts.js";

const router = Router();

router.route("/").get(async (req, res) => {
	try {
		return res.render("home", { title: "home" });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router.route("/about").get(async (req, res) => {
	try {
		return res.render("aboutUs", { title: "About" });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router.route("/register").get(async (req, res) => {
	try {
		return res.render("register", { title: "register" });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router
	.route("/login")
	.get(async (req, res) => {
		try {
			return res.render("login", { title: "login", form: req.body });
		} catch (e) {
			return res.status(500).json({ error: e });
		}
	})
	.post(async (req, res) => {
		if (!req.body || Object.keys(req.body).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		let loginInfo = {
			email: req.body.emailInput,
			password: req.body.passwordInput,
		};

		try {
			loginInfo.email = validateEmail(loginInfo.email);
			loginInfo.password = validatePassword(loginInfo.password);
		} catch (e) {
			return res.status(400).render("login", {
				title: "login",
				form: req.body,
				error: { status: 400, message: e },
			});
		}

		try {
			const user = await login(loginInfo);
			console.log(user);
			if (user) {
				req.session.user = user;
				return res.redirect(303, "/");
			}
		} catch (e) {
			return res.status(400).render("login", {
				title: "login",
				form: req.body,
				error: { status: 400, message: e },
			});
		}
	});

router.route("/logout").get(async (req, res) => {
	try {
		req.session.destroy();
		return res.render("logout", { title: "logout" });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router.route("/error").get(async (req, res) => {
	try {
		return res.status(403).render("error", {
			title: "Error",
			error: {
				status: 403,
				message: "You do not have permission to view this page.",
			},
		});
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

export default router;
