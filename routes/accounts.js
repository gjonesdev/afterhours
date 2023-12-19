import { Router } from "express";
import {
	validateId,
	validateAccount,
	validateUser,
	validateEmail,
	validatePassword,
} from "../helpers.js";
import { accountData, userData, reviewData, barData } from "../data/index.js";

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
				account,
				user,
			});
		} catch (e) {
			return res.status(404).json({ error: e });
		}
	})
	.post(async (req, res) => {
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
			}
		} catch (e) {
			return res.status(400).render("register", {
				title: "register",
				form: req.body,
				error: { status: 400, message: e },
			});
		}
	})
	.delete(async (req, res) => {
		try {
			req.session.user.accountId = validateId(req.session.user.accountId);
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			const result = await accountData.deleteAccount(
				req.session.user.accountId,
				req.body.passwordInput.trim()
			);
			if (result.deleted) {
				req.session.destroy();
				return res.render("success", {
					title: "success",
					message: "Your account has been deleted successfully.",
				});
			} else {
				return res.status(500).send("Internal Server Error");
			}
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

		let updatedInfo = {
			email: req.body.emailInput,
		};

		try {
			updatedInfo.email = validateEmail(updatedInfo.email);
			if (req.body.newPasswordInput) {
				updatedInfo.password = validatePassword(
					req.body.newPasswordInput
				);

				if (!req.body.confirmPasswordInput) {
					return res.status(400).render("register", {
						title: "register",
						form: req.body,
						error: {
							status: 400,
							message: "Must confirm your new password.",
						},
					});
				}

				if (
					updatedInfo.password !==
					req.body.confirmPasswordInput.trim()
				) {
					return res.status(400).render("register", {
						title: "register",
						form: req.body,
						error: {
							status: 400,
							message: "Passwords do not match.",
						},
					});
				}
			}
			req.session.user.accountId = validateId(req.session.user.accountId);
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		try {
			const result = await accountData.updateAccount(
				req.session.user.accountId,
				updatedInfo,
				req.body.currentPasswordInput.trim()
			);
			if (result.updated) {
				req.session.statusMessage = "Successfully updated login info!";
				return res.redirect(303, `/account`);
			}
		} catch (e) {
			req.session.statusMessage = "Incorrect Password."
			return res.redirect(303, `/account`);
		}
	});

router.route("/favorites").get(async (req, res) => {
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
		return res.render("favorites", {
			user,
		});
	} catch (e) {
		return res.status(404).json({ error: e });
	}
});

router.route("/reviews").get(async (req, res) => {
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
		const reviews = await reviewData.getReviewsByAccountId(account.userId);
		return res.render("reviews", {
			reviews,
			user,
			account,
		});
	} catch (e) {
		return res.status(404).json({ error: e });
	}
});

router.route("/bars").get(async (req, res) => {
	try {
		req.session.user.accountId = validateId(req.session.user.accountId);
	} catch (e) {
		return res.status(400).json({ error: e });
	}
	try {
		const bars = await barData.barByOwner(req.session.user.accountId);
		return res.render("ownerBars", {
			bars,
		});
	} catch (e) {
		return res.status(404).json({ error: e });
	}
});

export default router;
