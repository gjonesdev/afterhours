import { Router } from "express";
import { validateId, validateUser } from "../helpers.js";
import { userData } from "../data/index.js";
import { getAccount } from "../data/accounts.js";

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
    return res.status(400).json({ error: e });
  }

  try {
    const result = await userData.updateUser(account.userId, userInfo);
    if (result.updated) {
      return res.redirect(303, `/account`);
    } else {
      return res.status(500).send("Internal Server Error");
    }
  } catch (e) {
    return res.status(404).json({ error: e });
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
    const bar = await userData.updateFavorites(account.userId, req.body.barId);
    filtersHelp.barDistanceHelper(true);
    if (bar.updated) {
      return res.redirect(303, `/bars/${req.body.barId}`);
    } else {
      return res.redirect(303, `/bars/${req.body.barId}`);
    }
  } catch (e) {
    return res.redirect(303, `/bars/${req.body.barId}`);
  }
});

export default router;
