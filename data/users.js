import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";

import { validateUser, validateId } from "../helpers.js";

export const createUser = async (userInfo) => {
	const newUser = validateUser(userInfo);

	const userCollection = await users();
	const res = await userCollection.insertOne(newUser);
	if (!res.acknowledged || !res.insertedId) {
		throw "Failed to add user.";
	}

	return res;
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
	updatedUser = validateUser(updatedInfo);

	const userCollection = await users();

	const updatedUserInfo = await userCollection.findOneAndUpdate(
		{ _id: new ObjectId(userId) },
		{ $set: updatedUser },
		{ returnDocument: "after" }
	);
	if (!updatedUserInfo) {
		throw "No user with that id.";
	}

	return updatedUserInfo;
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

	return res;
};
