import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { accounts } from "../config/mongoCollections.js";
import { userData } from "./index.js";
import {
	validateAccount,
	validateId,
	validateUser,
	validateEmail,
	validatePassword,
} from "../helpers.js";

export const createAccount = async (accountInfo, userInfo) => {
	accountInfo = validateAccount(accountInfo);
	userInfo = validateUser(userInfo);

	const accountCollection = await accounts();
	const existing = await accountCollection.findOne({
		email: accountInfo.email,
	});

	if (existing) {
		throw "Account with that email already exists.";
	}

	const userId = await userData.createUser(userInfo);

	const saltRounds = 16;
	accountInfo.password = await bcrypt.hash(accountInfo.password, saltRounds);
	accountInfo.userId = userId;

	const res = await accountCollection.insertOne(accountInfo);
	if (!res.acknowledged || !res.insertedId) {
		throw "Failed to add account.";
	}

	return { inserted: true };
};

export const getAccount = async (accountId) => {
	//check validated
	accountId = validateId(accountId);

	const accountCollection = await accounts();
	const account = await accountCollection.findOne({
		_id: new ObjectId(accountId),
	});
	if (account === null) {
		throw "No account with that id.";
	}

	const accountDetails = {
		id: account._id,
		email: account.email,
		accountType: account.accountType,
		userId: account.userId,
	};

	return accountDetails;
};

export const updateAccount = async (accountId, updatedInfo) => {
	accountId = validateId(accountId);
	updatedInfo = validateAccount(updatedInfo);

	const accountCollection = await accounts();

	const updatedAccount = await accountCollection.findOneAndUpdate(
		{ _id: new ObjectId(accountId) },
		{ $set: updated },
		{ returnDocument: "after" }
	);
	if (!updatedAccount) {
		throw "No account with that id.";
	}

	const accountInfo = {
		email: updatedAccount.email,
		accountId: updatedAccount._Id.toString(),
		userId: updatedAccount.userId,
		accountType: updatedAccount.accountType,
	};

	return accountInfo;
};

export const deleteAccount = async (accountId) => {
	accountId = validateId(accountId);

	const accountCollection = await accounts();

	const deletedAccount = await accountCollection.findOneAndDelete({
		_id: new ObjectId(accountId),
		$project: userId,
	});

	if (!deletedAccount) {
		throw "No account with that id.";
	}

	const userId = deletedAccount.userId.toString();
	userData.deleteUser(userId);

	return { deleted: true };
};

export const login = async (loginInfo) => {
	loginInfo.email = validateEmail(loginInfo.email);
	loginInfo.password = validatePassword(loginInfo.password);

	const accountCollection = await accounts();
	const account = await accountCollection.findOne({
		email: loginInfo.email,
	});

	if (!account) {
		throw "Incorrect Password/Email.";
	}

	const valid = await bcrypt.compare(loginInfo.password, account.password);

	if (!valid) {
		throw "Incorrect Password/Email.";
	}

	const accountInfo = {
		accountId: account._id.toString(),
		accountType: account.accountType,
	};

	return accountInfo;
};
