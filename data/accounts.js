import { ObjectId } from "mongodb";
import { accounts } from "../config/mongoCollections.js";
import { userData } from "./index.js";
import { validateAccount, validateId } from "../helpers.js";

export const createAccount = async (accountInfo, userInfo) => {
	const newAccount = await validateAccount(accountInfo);
	const newUser = await validateUser(userInfo);

	const accountCollection = await accounts();
	const existing = await accountCollection.findOne({
		email: accountInfo.email,
	});

	if (existing) {
		throw "Account with that email already exists.";
	}

	const userId = userData.createUser(newUser).insertedId.toString();

	accountInfo.userId = userId; //hash(userId);
	// accountInfo.password = hash("password");

	const res = await accountCollection.insertOne(newAccount);
	if (!res.acknowledged || !res.insertedId) {
		throw "Failed to add account.";
	}

	return res;
};

export const getAccount = async (accountId) => {
	accountId = validateId(accountId);

	const accountCollection = await accounts();
	const account = await accountCollection.findOne({
		_id: new ObjectId(accountId),
	});
	if (account === null) {
		throw "No account with that id.";
	}

	account.user = getUser(account.userId); // unhash(account.userId)
	// account.bars = getBarsByOwner(accountId);

	return account;
};

export const updateAccount = async (accountId, updatedInfo) => {
	accountId = validateId(accountId);
	updatedAccount = validateAccount(updatedInfo);

	const accountCollection = await accounts();

	const updatedAccountInfo = await accountCollection.findOneAndUpdate(
		{ _id: new ObjectId(accountId) },
		{ $set: updatedAccount },
		{ returnDocument: "after" }
	);
	if (!updatedAccountInfo) {
		throw "No account with that id.";
	}

	return updatedAccountInfo;
};

export const deleteAccount = async (accountId) => {
	accountId = validateId(accountId);

	const accountCollection = await accounts();

	const res = await accountCollection.findOneAndDelete({
		_id: new ObjectId(accountId),
		$project: userId,
	});

	if (!res) {
		throw "No account with that id.";
	}

	const userId = res.userId.toString();
	userData.deleteUser(userId);

	return res;
};
