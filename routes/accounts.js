import { Router } from "express";
import { validateId, validateAccount, validateUser } from "../helpers.js";
import { accountData, userData } from "../data/index.js";

const router = Router();

router
	.route("/")
	.get(async (req, res) => {
		try {
			req.session.user.accountId = validateId(req.session.user.accountId);
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			const account = await accountData.getAccount(
				req.session.user.accountId
			);
			const user = await userData.getUser(account.userId);
			return res.render("account", {
				title: "account",
				email: account.email,
				firstName: user.firstName,
				lastName: user.lastName,
			});
		} catch (e) {
			return res.status(404).json({ error: e });
		}
	})
	.post(async (req, res) => {
		console.log("test");

		if (!req.body || Object.keys(req.body).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		let accountInfo = {
			email: req.body.emailInput,
			password: req.body.passwordInput,
			accountType: req.body.accountTypeInput,
		};

		let userInfo = {
			firstName: req.body.firstNameInput,
			lastName: req.body.lastNameInput,
			phone: req.body.phoneInput,
		};

		try {
			accountInfo = validateAccount(accountInfo);
			userInfo = validateUser(userInfo);
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		if (!req.body.confirmPasswordInput) {
			return res.status(400).render("register", {
				title: "register",
				form: req.body,
				error: { status: 400, message: "Must confirm your password." },
			});
		}

		if (accountInfo.password !== req.body.confirmPasswordInput.trim()) {
			return res.status(400).render("register", {
				title: "register",
				form: req.body,
				error: { status: 400, message: "Passwords do not match." },
			});
		}

		try {
			const result = await accountData.createAccount(
				accountInfo,
				userInfo
			);
			if (result.inserted) {
				return res.redirect(303, "/login");
			} else {
				return res.status(500).send("Internal Server Error");
			}
		} catch (e) {
			return res.sendStatus(500);
		}
	});

router
	.delete(async (req, res) => {
		try {
			req.params.accountId = validateId(req.params.accountId);
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			const result = await accountData.deleteAccount(
				req.params.accountId
			);
			return res.json(result);
		} catch (e) {
			return res.status(404).json({ error: e });
		}
	})
	.put(async (req, res) => {
		if (!req.body || Object.keys(req.body).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			req.params.accountId = validateId(req.params.accountId);
			req.body = await validateAccount(req.body);
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		try {
			const result = await accountData.updateAccount(
				req.params.accountId,
				req.body
			);
			return res.json(result);
		} catch (e) {
			return res.status(404).json({ error: e });
		}
	});

export default router;
