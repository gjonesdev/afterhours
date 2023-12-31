import { Router } from "express";
import { validateId, validateUser } from "../helpers.js";
import { userData } from "../data/index.js";
import { getAccount } from "../data/accounts.js";
import filtersHelp from "../filterhelper.js";

const router = Router();

router.route("/").put(async (req, res) => {
	let account;
	if (!req.body || Object.keys(req.body).length === 0) {
		return res
			.status(400)
			.json({ error: "There are no fields in the request body" });
	}

	let userInfo = {
		firstName: req.body.firstNameInput,
		lastName: req.body.lastNameInput,
		phone: req.body.phoneInput,
	};

	try {
		account = await getAccount(req.session.user.accountId);
		account.userId = validateId(account.userId);
		userInfo = validateUser(userInfo);
	} catch (e) {
		req.session.status = {status: 400, message: e};
		return res.redirect(303, `/account`);
	}

	try {
		const result = await userData.updateUser(account.userId, userInfo);
		if (result.updated) {
			req.session.statusMessage = "Successfully updated login info!";
		return res.redirect(303, `/account`);
		}
	} catch (e) {
		req.session.statusMessage = "Internal server error.";
		return res.redirect(303, `/account`);
	}
});

router.route("/favorites").put(async (req, res) => {
	let account;
	if (!req.body || Object.keys(req.body).length === 0) {
		return res
			.status(400)
			.json({ error: "There are no fields in the request body" });
	}

	try {
		account = await getAccount(req.session.user.accountId);
		account.userId = validateId(account.userId);
		req.body.barId = validateId(req.body.barId);
	} catch (e) {
		return res.status(400).json({ error: e });
	}

	try {
		const bar = await userData.updateFavorites(
			account.userId,
			req.body.barId
		);
		filtersHelp.barDistanceHelper(true);
		return res.redirect(303, "back")
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

export default router;
