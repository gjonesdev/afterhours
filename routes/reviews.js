import { Router } from "express";
import { validateId, validateOptionalStr, validateRequiredRating, validateReview } from "../helpers.js";
import { reviewData, accountData, barData, userData } from "../data/index.js";
import filtersHelp from "../filterhelper.js";

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

  try {
    const rating = Number(req.body.rating);

    const account = await accountData.getAccount(req.session.user.accountId);
    const accountId = account.userId;

    const user = await userData.getUser(account.userId);
    const firstName = user.firstName;

    const reviewInfo = {
      accountId: accountId,
      firstName: firstName,
      barName: req.body.barName,
      barId: req.body.barId,
      rating: rating,
      comment: req.body.comment,
    };

    // Validate reviewInfo
    const validatedReviewInfo = await validateReview(
      reviewInfo.accountId,
      reviewInfo.firstName,
      reviewInfo.barName,
      reviewInfo.barId,
      reviewInfo.rating,
      reviewInfo.comment
    );

    const result = await reviewData.createReview(
      validatedReviewInfo.accountId,
      validatedReviewInfo.firstName,
      validatedReviewInfo.barName,
      validatedReviewInfo.barId,
      validatedReviewInfo.rating,
      validatedReviewInfo.comment
    );
    filtersHelp.barDistanceHelper(true);

    res.redirect("/bars/" + req.body.barId);
  } catch (error) {
    // If there are errors, render the form with errors
    const barId = req.body.barId;
    const bar = await barData.barById(barId);
    const barName = bar.name;

    res.render("writeReview", { barId: barId, barName: barName, error });
  }
});

router
  .route("/delete/:reviewId")
  .get(async (req, res) => {
    try {
      req.params.reviewId = validateId(req.params.reviewId);
      const reviewId = req.params.reviewId;
      const review = await reviewData.get(reviewId);

      res.render("deleteReview", { review });
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  })
  .post(async (req, res) => {
    try {
      req.params.reviewId = validateId(req.params.reviewId);
      const reviewId = req.params.reviewId;

      const review = await reviewData.get(reviewId);

      await reviewData.deleteReview(reviewId, review.barId);
      filtersHelp.barDistanceHelper(true);

      res.redirect("/account/reviews");
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  });

router
  .route("/edit/:reviewId")
  .get(async (req, res) => {
    try {
      req.params.reviewId = validateId(req.params.reviewId);
      const reviewId = req.params.reviewId;
      const review = await reviewData.get(reviewId);

      res.render("editReviews", { review });
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  })
  .post(async (req, res) => {
    try {
      req.params.reviewId = validateId(req.params.reviewId);
      req.body.comment = validateOptionalStr(req.body.comment);
      let rating = Number(req.body.rating);
      req.body.rating = validateRequiredRating(rating);
      
      let comment = req.body.comment;
      const reviewId = req.params.reviewId;

      const review = await reviewData.get(reviewId);

      let result = await reviewData.updateReview(
        reviewId,
        review.firstName,
        review.accountId,
        review.barName,
        review.barId,
        rating,
        comment
      );
      filtersHelp.barDistanceHelper(true);

      res.redirect("/account/reviews");
    } catch (error) {
      const reviewId = req.params.reviewId;
      const review = await reviewData.get(reviewId);

      res.render("editReviews", { review, error });
    }
  });

export default router;
