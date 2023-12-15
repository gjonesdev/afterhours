//import { reports } from "../config/mongoCollections.js";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
const db = await dbConnection();
await db.dropDatabase();

import bars from "../data/bars.js";
import { accountData } from "../data/index.js";
import * as reviews from "../data/reviews.js";
import * as reports from "../data/reports.js";

let toUpdate = "";
//create bar
try {
	let test = await bars.createBar(
		"GazBar",
		"The GazBar Sports Grill is a fresh, newly renovated sports bar and grill in Central Massachusetts. We offer everything your taste buds can handle and if you don’t see something you’d like….just ask and ourChef will personally create your meal. The GazBar offers a dining experience that Leominster has NEVER seen before.",
		{
			streetAddress: "1045 Central Street",
			city: "Leominster",
			state: "MA",
			zipCode: "01453",
		},
		"978-332-0595",
		"thegazbar@gazbar.com",
		"www.gazBar.com",
		"654438c26ec81bf9429dc36e",
		["Sport", "Grill", "Margaritas"]
	);
	console.log(test);
} catch (e) {
	console.log(e);
}

try {
	let test = await bars.createBar(
		"Mellos MExican Bar Grill",
		"A greate pace to have a margarita and mojitos. This is a mexican-dominican restaurant the has the best bar with the best of the caribbean and and Mexico",
		{
			streetAddress: "899 Central St",
			city: "Leominster",
			state: "MA",
			zipCode: "01453",
		},
		"978-332-0595",
		"",
		"www.losmellos.com",
		"654438c26ec81bf9429dc36e",
		["Tacos", "Grill", "Margaritas", "Mojitos"]
	);

	toUpdate = test._id.toString();
	console.log(toUpdate);
	console.log(test);
} catch (e) {
	console.log(e);
}

try {
	let test = await bars.createBar(
		"Mellos Mexican Bar Grill",
		"A greate pace to have a margarita and mojitos. This is a mexican-dominican restaurant the has the best bar with the best of the caribbean and and Mexico",
		{
			streetAddress: "899 Central St",
			city: "Leominster",
			state: "MA",
			zipCode: "01453",
		},
		"978-332-0595",
		"mellos@gmail.com",
		"www.Mellosmexican.com",
		"654438c26ec81bf9429dc36e",
		["Tacos", "Grill", "Margaritas", "Mojitos"]
	);

	toUpdate = test._id.toString();
	console.log(toUpdate);
	console.log(test);
} catch (e) {
	console.log(e);
}

//Add event
try {
	const testEvent = await bars.addEvent(
		toUpdate,
		"12/09/2023",
		"Tortilla's Party",
		"This is a lady's night event, where all the ladies will have their first margarita for free.",
		"7:00 PM",
		"10:00 PM"
	);
	console.log(testEvent);
} catch (e) {
	console.log(e);
}
//Add review
try {
	const testReview = await reviews.createReview(
		"654438c26ec81bf9429dc36e",
		toUpdate,
		5,
		"The drinks were amazing and the food delicious. The only little issue is that the music was too loud for my taste."
	);
	console.log(testReview);
} catch (e) {
	console.log(e);
}

//Create bar
try {
	let test = await bars.createBar(
		"VAKA RESTAURANT",
		"Vaka Restaurant, an upscale Latin fusion and sushi bar, has established itself as a premier destination for discerning diners seeking a taste of Dominican-Japanese fusion cuisine in the heart of downtown Lawrence, MA. ",
		{
			streetAddress: "337 Essex St",
			city: "Lawrence",
			state: "MA",
			zipCode: "01840",
		},
		"978-655-7278",
		"vakarestaurant@vaka.com",
		"www.vakarestaurant.com",
		"654438c26ec81bf9429dc36e",
		["Shushi", "Lounge", "Tequila", "Ron"]
	);

	toUpdate = test._id.toString();
	console.log(test);
} catch (e) {
	console.log(e);
}

//Add event
try {
	const testEvent = await bars.addEvent(
		toUpdate,
		"12/09/2023",
		"Tortilla's Party",
		"This is a lady's night event, where all the ladies will have their first margarita for free.",
		"7:00 PM",
		"9:00 PM"
	);
	console.log(testEvent);
} catch (e) {
	console.log(e);
}

try {
	let test = await accountData.createAccount(
		{
			email: "jonesgaetano@gmail.com",
			password: "Password1@",
			accountType: "patron",
		},
		{
			firstName: "Gaetano",
			lastName: "Jones",
			phone: "111-111-1111",
		}
	);
	console.log(test);
} catch (e) {
	console.log(e);
}

try {
	let test = await accountData.createAccount(
		{
			email: "mmartinez@gmail.com",
			password: "Hola123@",
			accountType: "patron",
		},
		{
			firstName: "Miguel",
			lastName: "Martinez",
			phone: "646-511-5654",
		}
	);
	console.log(test);
} catch (e) {
	console.log(e);
}

//Add Reports
try {
	const testReport = await reports.registerReport(
		"654438c26ec81bf9429dc36e",
		"Miguel Martinez",
		"mmartinez@gmail.com",
		"Inaccurate information",
		"Price are different from promotion."
	);
	console.log(testReport);
} catch (e) {
	console.log(e);
}

try {
	const testReport = await reports.registerReport(
		"6578d6263fbeda92944de4b1",
		"Miguel Martinez",
		"mmartinez@gmail.com",
		"Inaccurate information",
		"Price are different from promotion."
	);
	console.log(testReport);
} catch (e) {
	console.log(e);
}

await closeConnection();