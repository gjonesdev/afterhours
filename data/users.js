import { ObjectId } from "mongodb";
import { bars, users } from "../config/mongoCollections.js";

import { validateUser, validateId } from "../helpers.js";

export const createUser = async (userInfo) => {
	userInfo = validateUser(userInfo);
	userInfo.favorites = [];

	const userCollection = await users();
	const res = await userCollection.insertOne(userInfo);
	if (!res.acknowledged || !res.insertedId) {
		throw "Failed to add user.";
	}

	return res.insertedId.toString();
};

export const getUser = async (userId) => {
	userId = validateId(userId);

	const userCollection = await users();
	const user = await userCollection.findOne({ _id: new ObjectId(userId) });
	if (user === null) {
		throw "No user with that id.";
	}

	return user;
};

export const updateUser = async (userId, updatedInfo) => {
	userId = validateId(userId);
	updatedInfo = validateUser(updatedInfo);

	const userCollection = await users();

	const updatedUser = await userCollection.findOneAndUpdate(
		{ _id: new ObjectId(userId) },
		{ $set: updatedInfo },
		{ returnDocument: "after" }
	);

	if (!updatedUser) {
		throw "No user with that id.";
	}

	return { updated: true };
};

export const updateFavorites = async (userId, barId) => {
	let userResult;
	let barResult;
	userId = validateId(userId);
	barId = validateId(barId);

	const userCollection = await users();
	const barCollection = await bars();

	const favorited = await userCollection.findOne({
		_id: new ObjectId(userId),
		"favorites.barId": barId,
	});
	const barExists = await barCollection.findOne({
		_id: new ObjectId(barId),
	});

	if (favorited) {
		if (barExists) {
		barResult = await barCollection.findOneAndUpdate(
			{ _id: new ObjectId(barId) },
			{ $inc: { favoritesCount: -1 } },
			{ returnDocument: "after" }
		);
		}
		userResult = await userCollection.findOneAndUpdate(
			{ _id: new ObjectId(userId) },
			{ $pull: { favorites: {barId: barId } }},
			{ returnDocument: "after" }
		);
	} else {
		if (barExists) {
		barResult = await barCollection.findOneAndUpdate(
			{ _id: new ObjectId(barId) },
			{ $inc: { favoritesCount: 1 } },
			{ returnDocument: "after" }
		);
		const barName = barResult.name;
		userResult = await userCollection.findOneAndUpdate(
			{ _id: new ObjectId(userId) },
			{ $push: { favorites: { barId, barName } } },
			{ returnDocument: "after" }
		);
	}
	}

	if (!userResult) {
		throw "Something went wrong.";
	}

	if (barExists && !barResult) {
		throw "Something went wrong.";
	}

	return { updated: true };
};

export const deleteUser = async (userId) => {
	userId = validateId(userId);

	const userCollection = await users();
	const res = await userCollection.findOneAndDelete({
		_id: new ObjectId(userId),
	});

	if (!res) {
		throw "No user with that id.";
	}

	return { deleted: true };
};
