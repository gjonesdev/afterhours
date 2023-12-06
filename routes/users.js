import { Router } from "express";
import { validateId, validateUser } from "../helpers.js";
import { userData } from "../data/index.js";

const router = Router();

router.route("/:userId").put(async (req, res) => {
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
		const result = await userData.updateUser(req.params.userId, req.body);
		return res.json(result);
	} catch (e) {
		return res.status(404).json({ error: e });
	}
});

export default router;
