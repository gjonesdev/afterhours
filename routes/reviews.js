import { Router } from "express";
import { validateId, validateReview } from "../helpers.js";
import { reviewData } from "../data/index.js";
import barData from "../data/bars.js";

const router = Router();

router.route("/").post(async (req, res) => {
  const barId = req.body.barIdToreview;
  const barName = req.body.barNameToreview;
  res.render("writeReview", { barId: barId, barName: barName });
});

router.route("/createReview").post(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  const rating = Number(req.body.rating);
  //TODO: add account id from cookie
  /*
  let reviewInfo = {
    accountId: "654438c26ec81bf9429dc36e",
    //accountId: req.body.accountId,
    barId: req.body.barId,
    rating: req.body.rating,
    comment: req.body.comment,
    date: date,
  };
  /*
  try {
    reviewInfo = req.body = await validateReview(reviewInfo);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
*/
  try {
    const result = await reviewData.createReview(
      "654438c26ec81bf9429dc36e",
      req.body.barId,
      rating,
      req.body.comment
    );

    res.redirect("/bars/" + req.body.barId);
  } catch (e) {
    return res.sendStatus(500);
  }
});

router
  .route("/:reviewId")
  .get(async (req, res) => {
    try {
      req.params.reviewId = validateId(req.params.reviewId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const result = await reviewData.get(req.params.reviewId);
      return res.json(result);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.reviewId = validateId(req.params.reviewId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const result = await reviewData.deleteReview(req.params.reviewId);
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
      req.params.reviewId = validateId(req.params.reviewId);
      req.body = await validateReview(req.body);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const result = await reviewData.updateReview(
        req.params.reviewId,
        req.body
      );
      return res.json(result);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  });

export default router;
