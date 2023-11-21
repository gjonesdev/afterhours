import { Router } from "express";
import { validateId, validateAccount, validateUser } from "../helpers.js";
import { accountData } from "../data/index.js";

const router = Router();

router.route("/").post(async (req, res) => {
	if (!req.body || Object.keys(req.body).length === 0) {
		return res
			.status(400)
			.json({ error: "There are no fields in the request body" });
	}

	let accountInfo = {
		email: req.body.email,
		password: req.body.password,
		accountType: req.body.accountType,
	};

	let userInfo = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		phone: req.body.phone,
	};

	try {
		accountInfo = req.body = await validateAccount(accountInfo);
		userInfo = req.body = await validateUser(userInfo);
	} catch (e) {
		return res.status(400).json({ error: e });
	}

	try {
		const result = await accountData.createAccount({
			accountInfo,
			userInfo,
		});
		return res.json(result);
	} catch (e) {
		return res.sendStatus(500);
	}
});

router
	.route("/:accountId")
	.get(async (req, res) => {
		try {
			req.params.accountId = validateId(req.params.accountId);
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			const result = await accountData.getAccount(req.params.accountId);
			return res.json(result);
		} catch (e) {
			return res.status(404).json({ error: e });
		}
	})
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
