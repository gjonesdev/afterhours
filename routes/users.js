import { Router } from "express";
import { validateId, validateUser } from "../helpers.js";
import { userData } from "../data/index.js";

const router = Router();

router
	.route("/")
	// .get(async (req, res) => {
	// 	try {
	// 		const userList = await userData.getAll();
	// 		return res.json(userList);
	// 	} catch (e) {
	// 		return res.sendStatus(500);
	// 	}
	// })
	.post(async (req, res) => {
		if (!req.body || Object.keys(req.body).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			req.body = validateUser(req.body);
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		try {
			const newUser = await userData.createUser(req.body);
			return res.json(newUser);
		} catch (e) {
			return res.sendStatus(500);
		}
	});

router
	.route("/:userId")
	.get(async (req, res) => {
		try {
			req.params.userId = validateId(req.params.userId);
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			let user = await userData.getUser(req.params.userId);
			return res.json(user);
		} catch (e) {
			return res.status(404).json({ error: e });
		}
	})
	.delete(async (req, res) => {
		try {
			req.params.userId = validateId(req.params.userId);
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		try {
			const confirmation = await userData.deleteUser(req.params.userId);
			return res.json(confirmation);
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
			req.params.userId = validateId(req.params.userId);
			req.body = validateUser(req.body);
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		try {
			const updatedUser = await userData.updateUser(
				req.params.userId,
				req.body
			);
			return res.json(updatedUser);
		} catch (e) {
			return res.status(404).json({ error: e });
		}
	});

export default router;
