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

//Validating string
export const validateRequiredStr = (str) => {
  if (!str) throw "Input must be provided!";
  if (typeof str !== "string") throw "Input must be a valid string!";
  str = str.trim();
  if (str.length === 0) throw "Input is an empty string!";

  return str;
};

//Validating optional string
export const validateOptionalStr = (str) => {
  if (typeof str !== "string") throw "Input must be a valid string!";
  str = str.trim();
  return str;
};

//Validating email
export const validateEmail = (email) => {
  if (
    !/^[^\W_]+([._-][^\W_]+)*@[^\W_]+([._-][^\W_]+)*.[^\W_]{2,}$/.test(email)
  ) {
    throw "Invalid Email format.";
  }
  return email;
};

//Validating website
export const validateWebsite = (webSite) => {
  if (!/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b/.test(webSite)) {
    throw "Invalid Website format.";
  }
  return webSite;
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

  if (typeof location.streetAddress !== "string") throw "Invalid address type!";
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

//Validating users
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
