import { ObjectId } from "mongodb";
import { reviews } from "../config/mongoCollections.js";
import * as validation from "../helpers.js";

export const createReview = async (userId, businessId, rating, comment) => {
	userId = validation.validateRequiredStr(userId);
    businessId = validation.validateRequiredStr(businessId);
    rating = validation.validateRequiredRating(rating);
    comment = validation.validateOptionalStr(comment);
    date = new Date().toString();

    const review = {
        userId,
        businessId,
        rating,
        comment,
        date
      }

	const reviewCollection = await reviews();

	const res = await reviewCollection.insertOne(review);
	if (!res.acknowledged || !res.insertedId) {
		throw "Failed to add user.";
	}

	const newId = insertInfo.insertedId.toString();
    const newReview = await get(newId);

	return newReview;
};