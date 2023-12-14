import { ObjectId } from "mongodb";
import { reports } from "./config/mongoCollections.js";
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

export const validatePhone = (phone) => {
	if (phone === undefined || phone === null || phone === "") {
		throw `Phone number required.`;
	}

	if (typeof phone !== "string") {
		throw `Phone number must be of type string.`;
	}
	phone = phone.trim();

	if (!/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(phone)) {
		throw "Phone number must be valid.";
	}

	return phone.replace(/\D/g, "");
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
	userInfo.phone = validatePhone(userInfo.phone);

	const args = {
		firstName: userInfo.firstName,
		lastName: userInfo.lastName,
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

	if (!/^[a-zA-Z]+(?:['-][a-zA-Z']+)*$/.test(userInfo.firstName)) {
		throw "firstName can contain only alphabetic characters, hyphens, or apostrophes.";
	}

	if (!/^[a-zA-Z]+(?:['-][a-zA-Z']+)*$/.test(userInfo.lastName)) {
		throw "lastName can contain only alphabetic characters, hyphens, or apostrophes.";
	}

	return userInfo;
};

//Report error check:
/**Validate empty space for userId, reason, comment for reports*/
export const validateReport = (name, email, reason, comment) => {
  //Error check:
  if (!name || !email || !reason || !comment)
    throw "All fields need to have valid values.";

  //Change userID = string by userID = ObjectID
  if (
	  typeof name !== "string" ||
    name.trim().length === 0 ||
    typeof email !== "string" ||
    email.trim().length === 0 ||
    typeof reason !== "string" ||
    reason.trim().length === 0 ||
    typeof comment !== "string" ||
    comment.trim().length === 0
  )
    throw "Invalid string or strings with only spaces are not valid.";
};

/**Validate user ID as String for reports*/
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

/**Validate name for reports*/
export const validateReportName = (name) => {
	//Name:
	if (name.trim().length === 0)
	  throw "Empty string or just spaces not allowed for name.";
	name = name.trim();
	//Name should not contain only numbers
	if (!isNaN(name))
	  throw "Name should not contain only numbers";
	//Name  should not contain numbers
	let notNumbersRegex = /^[a-zA-Z ]*$/;
	if(notNumbersRegex.exec(name) === null) throw 'Name should not contain numbers';
	if (name.trim().length < 2 || name.trim().length > 30)
	  throw "Name should be at least 2 characters long and a max of 30 characters.";
	return name;
  };

  /**Validate email for reports*/
export const validateReportEmail = (email) => {
	//email:
	if (email.trim().length === 0)
	  throw "Empty string or just spaces not allowed for email.";
	  email = email.trim();
	//email should not contain numbers
	if (!isNaN(email))
	  throw "Email should not contain only numbers";
	if (email.trim().length < 2 || email.trim().length > 80)
	  throw "Email should be at least 2 characters long and a max of 80 characters.";
	//Email format, look for regex syntax
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	email = email.toString().toLowerCase();
	if(emailRegex.exec(email) === null) throw "Email is not in a valid email address format.";
	return email;
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

/**Validate user ID as ObjectID for reports*/
export const validateUserIdObjectId = (userId) => {
	if (!userId) throw "No userId is provided";
	if (typeof userId !== "string")
		throw "The userId provided is not a string.";
	if (userId.trim().length === 0)
		throw "Empty string or just spaces not allowed.";
	userId = userId.trim();
	if (!ObjectId.isValid(userId))
		throw "The userId provided is not a valid ObjectId.";
	return userId;
};

/**404 No report found*/
export const validateNoReportsFound = async (userId) => {
	const reportsCollection = await reports();
	//For objectId:
	//const userFind = await reportsCollection.find({userId: new ObjectId(userId)}).toArray();
	//For String:
	const userFind = await reportsCollection.find({ userId: userId }).toArray();
	if (userFind.length <= 0) throw "No reports found.";
	//return userId;
};

export const validateReview = async (
	accountId,
	firstName,
	barName,
	barId,
	rating,
	comment
) => {
	const validatedAccountId = validateRequiredStr(accountId);
	const validatedfirstName = validateRequiredStr(firstName);
	const validatedBarName = validateRequiredStr(barName);
	const validatedBarId = validateRequiredStr(barId);
	const validatedRating = validateRequiredRating(rating);
	const validatedComment = validateOptionalStr(comment);

	return {
		accountId: validatedAccountId,
		firstName: validatedfirstName,
		barName: validatedBarName,
		barId: validatedBarId,
		rating: validatedRating,
		comment: validatedComment,
	};
};
