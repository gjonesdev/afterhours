import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";

import { validateUser, validateId } from "../helpers.js";

export const createUser = async (userInfo) => {
	const newUser = validateUser(userInfo);
	newUser.businesses = [];

	const userCollection = await users();

	const res = await userCollection.insertOne(newUser);
	if (!res.acknowledged || !res.insertedId) {
		throw "Failed to add user.";
	}

	const newUserId = res.insertedId.toString();
	const user = await getUser(newUserId);

	return user;
};

// export const getAll = async () => {
// 	const userCollection = await users();
// 	let userList = await userCollection.find({}).toArray();
// 	if (!userList) {
// 		throw "Could not get all users";
// 	}

// 	userList = userList.map((user) => {
// 		return { _id: user._id, email: user.email };
// 	});

// 	return userList;
// };

export const getUser = async (userId) => {
	userId = validateId(userId);

	const userCollection = await users();
	const user = await userCollection.findOne({ _id: new ObjectId(userId) });
	if (user === null) {
		throw "No user with that id.";
	}

	return user;
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
	const confirmation = {
		email: res.email,
		deleted: true,
	};

	return confirmation;
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
