import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";

import { validateUser, validateId } from "../helpers.js";

export const createUser = async (userInfo) => {
	userInfo = validateUser(userInfo);

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
