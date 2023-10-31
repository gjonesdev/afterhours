import { ObjectId } from "mongodb";

export const validateId = (id) => {
	id = id.trim();
	if (id.length === 0) {
		throw "Error: id cannot be an empty string or just spaces";
	}
	if (!ObjectId.isValid(id)) {
		throw "invalid object ID";
	}
	return id;
};

export const validateUser = (userInfo) => {
	Object.keys(userInfo).forEach((field) => {
		if (
			userInfo[field] === undefined ||
			userInfo[field] === null ||
			userInfo[field] === ""
		) {
			throw `You must provide the ${field} fieldument.`;
		}
		if (typeof userInfo[field] !== "string") {
			throw `${field} must be of type string.`;
		}
	});

	userInfo.firstName = userInfo.firstName.trim();
	userInfo.lastName = userInfo.lastName.trim();
	userInfo.phone = userInfo.phone.trim();
	userInfo.email = userInfo.email.trim();
	userInfo.accountType = userInfo.accountType.trim();

	if (!/^[a-zA-Z]+(?:['-][a-zA-Z']+)*$/.test(userInfo.firstName)) {
		throw "firstName can contain only alphabetic characters, hyphens, or apostrophes.";
	}

	if (!/^[a-zA-Z]+(?:['-][a-zA-Z']+)*$/.test(userInfo.lastName)) {
		throw "lastName can contain only alphabetic characters, hyphens, or apostrophes.";
	}

	// validate phone

	if (
		!/^[^\W_]+([._-][^\W_]+)*@[^\W_]+([._-][^\W_]+)*.[^\W_]{2,}$/.test(
			userInfo.email
		)
	) {
		throw "contactEmail must be in valid email  format.";
	}

	// validate accountType enum

	return userInfo;
};
