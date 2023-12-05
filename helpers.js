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
	if (!num) throw "Input must be provided!";
	if (typeof num !== "number") throw "Input must be a valid number!";
	let validNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
export const validateDate = (date) => {
	if (!date.isValid(date, "MM/DD/YYYY")) throw "Invalid event date!";

	return date;
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
