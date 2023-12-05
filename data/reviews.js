import { ObjectId } from "mongodb";
import { reviews } from "../config/mongoCollections.js";
import * as validation from "../helpers.js";

export const createReview = async (accountId, barId, rating, comment) => {
  //each review will have its own objectId
  //user Id comes from the user leaving the review
  //bar Id comes from the bar being reviewed
  accountId = validation.validateRequiredStr(accountId);
  barId = validation.validateRequiredStr(barId);
  rating = validation.validateRequiredRating(rating);
  comment = validation.validateOptionalStr(comment);
  let date = new Date().toString();

  const review = {
    accountId,
    barId,
    rating,
    comment,
    date,
  };

  const reviewCollection = await reviews();

  const res = await reviewCollection.insertOne(review);
  if (!res.acknowledged || !res.insertedId) {
    throw "Failed to add user.";
  }

  const newId = res.insertedId.toString();
  const newReview = await get(newId);

  return newReview;
};

export const deleteReview = async (reviewId) => {
  reviewId = validation.validateId(reviewId);

  const reviewCollection = await reviews();
  const res = await reviewCollection.findOneAndDelete({
    _id: new ObjectId(reviewId),
  });


  if (!res) {
    throw "No review with that id";
  }

  return res;
};

export const updateReview = async (reviewId, accountId, barId, rating, comment) => {

  reviewId = validation.validateId(reviewId);
  accountId = validation.validateRequiredStr(accountId);
  barId = validation.validateRequiredStr(barId);
  rating = validation.validateRequiredRating(rating);
  comment = validation.validateOptionalStr(comment);
  let date = new Date().toString();
  
  const review = {
    accountId,
    barId,
    rating,
    comment,
    date
  }

  const reviewCollection = await reviews();
  const updateInfo = await reviewCollection.findOneAndReplace({_id : new ObjectId(reviewId)}, review, {returnDocument: 'after'});

  if (!updateInfo) {
    throw 'Update Unsuccessful';
  }

  updateInfo._id = updateInfo._id.toString();

  return updateInfo;
}

export const get = async (reviewId) => {
  //Implement Code here
  reviewId = validation.validateId(reviewId);
  const eventCollection = await reviews();
  const oneReview = await eventCollection.findOne({_id: new ObjectId(reviewId)});
  if (oneReview === null) throw 'No event with that id';
  oneReview._id = oneReview._id.toString();
  return oneReview;
};