import { ObjectId } from "mongodb";
import date from "date-and-time";

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

// Validate string
export const validateRequiredStr = (str) => {
	if (!str) throw "Input must be provided!";
	if (typeof str !== "string") throw "Input must be a valid string!";
	str = str.trim();
	if (str.length === 0) throw "Input is an empty string!";

	return str;
};

// Validate optional string
export const validateOptionalStr = (str) => {
	if (typeof str !== "string") throw "Input must be a valid string!";
	str = str.trim();
	return str;
};

// Validate number rating
export const validateRequiredRating = (num) => {
  if (!num) throw "Rating must be provided!";
  if (typeof num !== "number") throw "Rating must be a valid number!";
  let validNums = [1, 2, 3, 4, 5];
  if (!validNums.includes(num)) {
    throw "Invalid Rating";
  }
  return num;
};

// Validate email
export const validateEmail = (email) => {
	if (email === undefined || email === null || email === "") {
		throw `You must provide an email.`;
	}

	if (typeof email !== "string") {
		throw `Email must be of type string.`;
	}

	email = email.trim();

	if (
		!/^[^\W_]+([._-][^\W_]+)*@[^\W_]{1,}(\.[^\W_]{2,})(\.[^\W_]{2,})?/.test(
			email
		)
	) {
		throw "Email must be in valid email address format.";
	}

	return email.toLowerCase();
};

export const validatePassword = (password) => {
	if (password === undefined || password === null || password === "") {
		throw `You must provide a password.`;
	}

	if (typeof password !== "string") {
		throw `password must be of type string.`;
	}

	password = password.trim();

	if (/\s/.test(password)) {
		throw "password cannot contain spaces.";
	}

	if (!/(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,}/.test(password)) {
		throw "password must be at least 8 characters, contain at least one uppercase character, one number, and one special character.";
	}

	return password;
};

//Validating website
export const validateWebsite = (website) => {
	if (!/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b/.test(website)) {
		throw "Invalid Website format.";
	}
	return website;
};

//Validating date
//Event date validation
export const validateDate = (eventDate, startTime) => {
	if (!date.isValid(eventDate, "MM/DD/YYYY")) throw "Invalid event date!";
	const now = new Date();
	const dateObj = date.parse(eventDate + "" + startTime, "MM/DD/YYYY H:MM A");
	if (now > dateObj) throw "Event date needs to be a future date!";
	return eventDate;
};
//validating time
export const validateTime = (time, type) => {
	const validSTime = date.isValid(time.toUpperCase(), "h:mm A");
	if (!validSTime) throw `Invalid ${type} time!`;
	//let sTimeObj = date.parse(startTime, "h:mm A");

	return time;
};

export const validatePhone = (str) => {
	if (!str) throw "Input must be provided!";
	if (typeof str !== "string") throw "Input must be a valid string!";
	str = str.trim();
	if (str.length === 0) throw "Input is an empty string!";

	return str;
};

//Validating location
export const validateLocation = (location) => {
	if (!location) throw "Location is missing!";
	if (typeof location !== "object") throw "Location is wrong type!";
	if (
		!(
			location.hasOwnProperty("streetAddress") &&
			location.hasOwnProperty("city") &&
			location.hasOwnProperty("state") &&
			location.hasOwnProperty("zipCode")
		)
	)
		throw "Location is missing information!";

	if (typeof location.streetAddress !== "string")
		throw "Invalid address type!";
	if (typeof location.city !== "string")
		throw "Invalid input type for the city!";
	if (typeof location.state !== "string")
		throw "Invalid input type for the state!";
	if (typeof location.zipCode !== "string")
		throw "Invalid input type for the zip code!";
	const trmEventAddress = location.streetAddress.trim();
	const trmCity = location.city.trim();
	const trmState = location.state.trim();
	const trmZip = location.zipCode.trim();
	if (
		trmCity.length < 3 ||
		trmEventAddress.length < 3 ||
		trmState.length < 2 ||
		trmState.length > 2 ||
		trmZip.length !== 5
	)
		throw "Invalid location";
	location.streetAddress = trmEventAddress;
	location.city = trmCity;
	location.state = trmState.toUpperCase();
	location.zipCode = trmZip;

	const states = [
		"AL",
		"AK",
		"AZ",
		"AR",
		"CA",
		"CO",
		"CT",
		"DE",
		"FL",
		"GA",
		"HI",
		"ID",
		"IL",
		"IN",
		"IA",
		"KS",
		"KY",
		"LA",
		"ME",
		"MD",
		"MA",
		"MI",
		"MN",
		"MS",
		"MO",
		"MT",
		"NE",
		"NV",
		"NH",
		"NJ",
		"NM",
		"NY",
		"NC",
		"ND",
		"OH",
		"OK",
		"OR",
		"PA",
		"RI",
		"SC",
		"SD",
		"TN",
		"TX",
		"UT",
		"VT",
		"VA",
		"WA",
		"WV",
		"WI",
		"WY",
	];
	if (!states.includes(location.state)) throw "Invalid state";
	if (isNaN(+trmZip)) throw "Zip code is not valid";

	return location;
};

export const validateAccount = (accountInfo) => {
	accountInfo.email = validateEmail(accountInfo.email);
	accountInfo.password = validatePassword(accountInfo.password);

	if (
		accountInfo.accountType === undefined ||
		accountInfo.accountType === null ||
		accountInfo.accountType === ""
	) {
		throw `You must provide the account type.`;
	}

	if (typeof accountInfo.accountType !== "string") {
		throw `Account type must be a string.`;
	}

	accountInfo.accountType = accountInfo.accountType.trim();

	if (
		!(
			accountInfo.accountType === "patron" ||
			accountInfo.accountType === "owner"
		)
	) {
		throw "Account type must either be patron or owner.";
	}

	return accountInfo;
};

export const validateUser = (userInfo) => {
	const args = {
		firstName: userInfo.firstName,
		lastName: userInfo.lastName,
		phone: userInfo.phone,
	};

	Object.keys(args).forEach((arg) => {
		if (args[arg] === undefined || args[arg] === null || args[arg] === "") {
			throw `You must provide the ${arg} argument.`;
		}
		if (typeof args[arg] !== "string") {
			throw `${arg} must be of type string.`;
		}
	});

	userInfo.firstName = userInfo.firstName.trim();
	userInfo.lastName = userInfo.lastName.trim();
	userInfo.phone = userInfo.phone.trim();

	if (!/^[a-zA-Z]+(?:['-][a-zA-Z']+)*$/.test(userInfo.firstName)) {
		throw "firstName can contain only alphabetic characters, hyphens, or apostrophes.";
	}

	if (!/^[a-zA-Z]+(?:['-][a-zA-Z']+)*$/.test(userInfo.lastName)) {
		throw "lastName can contain only alphabetic characters, hyphens, or apostrophes.";
	}

	// validate phone

	return userInfo;
};

//Report error check:
/**Validate empty space for userId, reason, comment for reports*/
export const validateReport = (userId, reason, comment) => {
	//Error check:
	if (!userId || !reason || !comment)
		throw "All fields need to have valid values.";

	//Change userID = string by userID = ObjectID
	if (
		typeof userId !== "string" ||
		userId.trim().length === 0 ||
		typeof reason !== "string" ||
		reason.trim().length === 0 ||
		typeof comment !== "string" ||
		comment.trim().length === 0
	)
		throw "Invalid string or strings with only spaces are not valid.";
};

/**Validate user ID for reports*/
export const validateUserId = (userId) => {
	//If it is String validation:
	//User Id:
	if (userId.trim().length === 0)
		throw "Empty string or just spaces not allowed for user Id.";
	userId = userId.trim();
	//"User Id should not contain space in the middle.
	let userIdRegex = /[\s]+/g;
	let regexValue = userIdRegex.exec(userId);
	if (regexValue !== null) {
		if (regexValue.length >= 1) throw "Not space allowed for user Id";
	}
	//userId should not contain numbers
	if (!isNaN(userId)) throw "User Id should not contain numbers";
	if (userId.trim().length < 2 || userId.trim().length > 50)
		throw "User Id should be at least 2 characters long and a max of 50 characters.";

	return userId;
	//If it is an Object ID validation
	/*userId = userId.trim();
	if (userId.length === 0) {
		throw "Error: User ID cannot be an empty string or just spaces";
	}
	if (!ObjectId.isValid(userId)) {
		throw "invalid object ID";
	}
	return userId;*/
};

/**Validate reason for reports*/
export const validateReason = (reason) => {
	//Reason:
	if (reason.trim().length === 0)
		throw "Empty string or just spaces not allowed for reason.";
	reason = reason.trim();
	//Reason should not contain numbers
	if (!isNaN(reason)) throw "Reason should not contain numbers";
	let notNumbersRegex = /^[a-zA-Z ]*$/;
	if (notNumbersRegex.exec(reason) === null)
		throw "Reason should not contain numbers and not symbols";
	if (reason.trim().length < 2 || reason.trim().length > 50)
		throw "Reason should be at least 2 characters long and a max of 50 characters.";
	return reason;
};

/**Validate comment for reports*/
export const validateComment = (comment) => {
	//Comment or Message:
	if (comment.trim().length === 0)
		throw "Empty string or just spaces not allowed for comment or message.";
	comment = comment.trim();
	//Comment or message should not contain numbers
	if (!isNaN(comment))
		throw "Comment or message should not contain only numbers";
	if (comment.trim().length < 2 || comment.trim().length > 500)
		throw "Comment or message should be at least 2 characters long and a max of 500 characters.";
	return comment;
};

export const validateReview = async (accountId, barName, barId, rating, comment) => {
    const validatedAccountId = validateRequiredStr(accountId);
    const validatedBarName = validateRequiredStr(barName);
    const validatedBarId = validateRequiredStr(barId);
    const validatedRating = validateRequiredRating(rating);
    const validatedComment = validateOptionalStr(comment);

    return {
      accountId: validatedAccountId,
      barName: validatedBarName,
      barId: validatedBarId,
      rating: validatedRating,
      comment: validatedComment,
    }
};
