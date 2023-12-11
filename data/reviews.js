import { ObjectId } from "mongodb";
import { reviews } from "../config/mongoCollections.js";
import { bars } from "../config/mongoCollections.js";
import * as validation from "../helpers.js";
import barsFunctions from "./bars.js";

export const createReview = async (accountId, barName, barId, rating, comment) => {
  //accountId comes from the user leaving the review
  //barId comes from the bar being reviewed
  accountId = validation.validateRequiredStr(accountId);
  barName = validation.validateRequiredStr(barName);
  barId = validation.validateRequiredStr(barId);
  rating = validation.validateRequiredRating(rating);
  comment = validation.validateOptionalStr(comment);
  let date = new Date().toString();
  const barCollection = await bars();

  const theBar = await barsFunctions.barById(barId);
  const ratingsArray = theBar.ratings;
  ratingsArray.push(rating);
  let totalRatings = 0;
  if (ratingsArray.length === 0) {
    totalRatings = rating;
  } else {
    ratingsArray.forEach((element) => {
      totalRatings += element;
    });
  }

  const ratingAverage = totalRatings / ratingsArray.length;

  const review = {
    accountId,
    barName,
    barId,
    rating,
    comment,
    date,
  };

  const reviewCollection = await reviews();

  // Insert the review into the reviews collection
  const res = await reviewCollection.insertOne(review);

  if (!res.acknowledged || !res.insertedId) {
    throw "Failed to add review";
  }

  const newId = res.insertedId.toString();
  const newReview = await get(newId);

  // Update the bar's reviews array

  const updateBar = await barCollection.findOneAndUpdate(
    { _id: new ObjectId(barId) },
    {
      $push: { reviews: newReview },
      $set: { ratingAverage: ratingAverage },
    },
    { returnDocument: "after" }
  );

  if (updateBar === null) {
    throw "Bar update unsuccessful";
  }
  // call the bar again to update the rating and review count
  const updatedBar = await barsFunctions.barById(barId);
  const reviewsArray = updatedBar.reviews;
  const addReviewCount = await barCollection.updateOne(
    { _id: new ObjectId(barId) },
    {
      $push: { ratings: rating },
      $set: { reviewsCount: reviewsArray.length },
    }
  );
  if (addReviewCount.modifiedCount === 0) throw " Review could not be added!";

  return newReview;
};

export const getReviewsForBar = async (barId) => {
  //Implement Code here
  validation.validateId(barId);
  const barCollection = await bars();
  const bar = await barCollection.findOne({ _id: new ObjectId(barId) });
  if (bar === null) {
    throw `No bar with that id`;
  }

  const reviews = bar.reviews;

  return reviews;
};

export const getReviewsByAccountId = async (accountId) => {
  //Implement Code here
  validation.validateId(accountId);
  const reviewCollection = await reviews();
  const reviewArray = await reviewCollection.find({ accountId: accountId }).toArray();
  
  return reviewArray;
};

export const deleteReview = async (reviewId, barId) => {
  reviewId = validation.validateId(reviewId);
  barId = validation.validateId(barId);

  const reviewCollection = await reviews();

  // Get the review before deleting it
  const reviewToDelete = await reviewCollection.findOne({
    _id: new ObjectId(reviewId),
  });

  // Delete the review from the reviews collection
  const deleteResult = await reviewCollection.deleteOne({
    _id: new ObjectId(reviewId),
  });

  if (deleteResult.deletedCount === 0) {
    throw "Review not found or already deleted";
  }

  // Delete the review from the reviews array in the bar collection
  const barCollection = await bars();
  const bar = await barCollection.findOne({
    _id: new ObjectId(barId),
  });

  if (!bar) throw "Could not find bar";

  const updateBarInfo = await barCollection.findOneAndUpdate(
    { _id: bar._id },
    {
      $inc: { reviewsCount: -1 },
      $pull: { ratings: reviewToDelete.rating },
    },
    { returnDocument: "after" }
  );

  const updateBar = await barCollection.findOneAndUpdate(
    { _id: bar._id },
    {
      $pull: { reviews: { _id: reviewId } },
    },
    { returnDocument: "after" }
  );

  console.log(updateBar)

  if (updateBar === null) {
    throw "Bar update unsuccessful";
  }

  return reviewToDelete;
};

export const updateReview = async (
  reviewId,
  accountId,
  barName,
  barId,
  rating,
  comment
) => {
  reviewId = validation.validateId(reviewId);
  accountId = validation.validateRequiredStr(accountId);
  barName = validation.validateRequiredStr(barName);
  barId = validation.validateRequiredStr(barId);
  rating = validation.validateRequiredRating(rating);
  comment = validation.validateOptionalStr(comment);
  let date = new Date().toString();

  const review = {
    accountId,
    barName,
    barId,
    rating,
    comment,
    date,
  };

  const reviewCollection = await reviews();
  const updateInfo = await reviewCollection.findOneAndReplace(
    { _id: new ObjectId(reviewId) },
    review,
    { returnDocument: "after" }
  );

  if (!updateInfo) {
    throw "Update Unsuccessful";
  }

  updateInfo._id = updateInfo._id.toString();

  // Update the review in the reviews array in the bar collection
  const barCollection = await bars();
  const bar = await barCollection.findOne({
    _id: new ObjectId(barId),
  });

  if (!bar) throw "Could not find bar";

  const removeBar = await barCollection.findOneAndUpdate(
    { _id: bar._id },
    {
      $pull: { reviews: { _id: reviewId } },
    },
    { returnDocument: "after" }
  );

  if (removeBar === null) {
    throw "Bar update (pull) unsuccessful";
  }

  const updateBar = await barCollection.findOneAndUpdate(
    { _id: bar._id },
    {
      $push: { reviews: updateInfo },
    },
    { returnDocument: "after" }
  );

  if (updateBar === null) {
    throw "Bar update unsuccessful";
  }

  return updateInfo;
};

export const get = async (reviewId) => {
  //Implement Code here
  reviewId = validation.validateId(reviewId);
  const eventCollection = await reviews();
  const oneReview = await eventCollection.findOne({
    _id: new ObjectId(reviewId),
  });
  if (oneReview === null) throw "No event with that id";
  oneReview._id = oneReview._id.toString();
  return oneReview;
};
