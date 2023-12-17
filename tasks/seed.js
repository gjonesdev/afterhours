import { reports, bars, reviews } from "../config/mongoCollections.js";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { barData, accountData, reviewData, reportsData } from "../data/index.js";
const db = await dbConnection();
await db.dropDatabase();

//           _____ _____ ____  _    _ _   _ _______ _____ 
//     /\   / ____/ ____/ __ \| |  | | \ | |__   __/ ____|
//    /  \ | |   | |   | |  | | |  | |  \| |  | | | (___  
//   / /\ \| |   | |   | |  | | |  | | . ` |  | |  \___ \ 
//  / ____ \ |___| |___| |__| | |__| | |\  |  | |  ____) |
// /_/    \_\_____\_____\____/ \____/|_| \_|  |_| |_____/ 

//Account Id cannot be pulled anywhere but from session, these accounts are not linked to anything else in the seed.js but they do have functionality if you login with them.
//Everything in the seed.js is for population purposes only, the bars, reviews, and events are tied in together. Reports are a separate entity since they also need the account Id.
//Once logged in if you create an account with an owner accountType, and then create a bar. That account Id will then be tied to that bar.
//This also goes for creating reviews, favoriting, filing reports, etc regardless of account type.
//Summary: Everything works properly once running application in browser but is unable to be exactly recreated in the seed.js, we did not want to be able to pull account ids from anywhere
//but the session.

//console.log("LOADING ACCOUNTS.... please wait")
// try {
// 	let testAccount1 = await accountData.createAccount(
// 		{
// 			email: "owner@gmail.com",
// 			password: "Password1@",
// 			accountType: "owner",
// 		},
// 		{
// 			firstName: "Bar",
// 			lastName: "Owner",
// 			phone: "111-111-1111",
// 		}
// 	);
// 	console.log(testAccount1);
// } catch (e) {
// 	console.log(e);
// }

// try {
// 	let testAccount2 = await accountData.createAccount(
// 		{
// 			email: "patron@gmail.com",
// 			password: "Password1@",
// 			accountType: "patron",
// 		},
// 		{
// 			firstName: "Bar",
// 			lastName: "Enthusiast",
// 			phone: "222-222-2222",
// 		}
// 	);
// 	console.log(testAccount2);
// } catch (e) {
// 	console.log(e);
// }


//  ____          _____   _____ 
// |  _ \   /\   |  __ \ / ____|
// | |_) | /  \  | |__) | (___  
// |  _ < / /\ \ |  _  / \___ \ 
// | |_) / ____ \| | \ \ ____) |
// |____/_/    \_\_|  \_\_____/ 

let testBars = [];

//creating 20 bars to reference
for (let i = 1; i <= 20; i++) {
  testBars.push(`bar${i}`);
}

//5 Bars Near Michael in MA
try {
	testBars[0] = await barData.createBar(
		"GazBar",
		"The GazBar Sports Grill is a fresh, newly renovated sports bar and grill in Central Massachusetts. We offer everything your taste buds can handle and if you do not see something you wouldd like….just ask and ourChef will personally create your meal. The GazBar offers a dining experience that Leominster has NEVER seen before.",
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
		["Sport", "Cocktails", "Shots"]
	);
	console.log(testBars[0]);
} catch (e) {
	console.log(e);
}

try {
	testBars[1] = await barData.createBar(
		"Mellos Mexican Bar Grill",
		"A greate pace to have a margarita and mojitos. This is a mexican-dominican restaurant the has the best bar with the best of the caribbean and and Mexico",
		{
			streetAddress: "899 Central St",
			city: "Leominster",
			state: "MA",
			zipCode: "01453",
		},
		"978-332-0595",
		"losmellos@gmail.com",
		"www.losmellos.com",
		"654438c26ec81bf9429dc36e",
		["BarHopping", "HappyHourDeals", "LadiesNight", "LiveMusic"]
	);
	console.log(testBars[1]);
} catch (e) {
	console.log(e);
}

try {
	testBars[2] = await barData.createBar(
		"Terra Luna",
		"The work is always in a full swing in our kitchen! Everyone here is on fire when it comes to cooking.",
		{
			streetAddress: "225 Essex St",
			city: "Lawrence",
			state: "MA",
			zipCode: "01840",
		},
		"978-747-7989",
		"terralunacafe@gmail.com",
		"www.terralunacafe.com",
		"654438c26ec81bf9429dc36e",
		["Tapas", "CraftCocktails"]
	);
	console.log(testBars[2]);
} catch (e) {
	console.log(e);
}

try {
	testBars[3] = await barData.createBar(
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
		["Tapas", "ThirstyThursday", "WineWednesday", "Shots"]
	);
	console.log(testBars[3]);
} catch (e) {
	console.log(e);
}

try {
	testBars[4] = await barData.createBar(
		"Tavern On High",
		"Amazing Drinks and Great Food set in a casual atmosphere.  Enjoy one of our many local craft beers at our 30+ person bar, or have a martini while sitting on our outdoor patio.  While here, enjoy one of our many appetizers and a juicy burger.",
		{
			streetAddress: "18 High St",
			city: "North Andover",
			state: "MA",
			zipCode: "01845",
		},
		"978-684-2264",
		"info@tavernonhigh.com",
		"www.tavernonhigh.com",
		"654438c26ec81bf9429dc36e",
		["BeerTasting", "ChampagneNight", "LadiesNight", "LiveMusic"]
	);
	console.log(testBars[4]);
} catch (e) {
	console.log(e);
}

//3 bars near Matt in KOP
try {
	testBars[5] = await barData.createBar(
		"Screwballs Sports Bar & Grille",
		"Discover a unique blend of flavors and entertainment at our vibrant bar. Unwind with crafted cocktails, great music, and a lively atmosphere.",
		{
			streetAddress: "216 W Beidler Rd Unit 600",
			city: "King of Prussia",
			state: "PA",
			zipCode: "19406",
		},
		"610-337-3888",
		"info@screwballs.com",
		"www.screwballsbarandgrille.com",
		"654438c26ec81bf9429dc36e",
		["BarEvents", "LiveMusic", "CraftCocktails", "Shots"]
	);
	console.log(testBars[5]);
} catch (e) {
	console.log(e);
}

try {
	testBars[6] = await barData.createBar(
		"KOP Grill & Tavern",
		"Sip, savor, and celebrate at our cozy bar. Indulge in handcrafted cocktails, delicious bites, and an inviting ambiance. Your perfect night out awaits!",
		{
			streetAddress: "128 Town Center Rd",
			city: "King of Prussia",
			state: "PA",
			zipCode: "19406",
		},
		"610-337-7800",
		"koptavernevents@gmail.com",
		"www.kopgrillandtavern.com",
		"654438c26ec81bf9429dc36e",
		["ThirstyThursday", "LiveMusic"]
	);
	console.log(testBars[6]);
} catch (e) {
	console.log(e);
}

try {
	testBars[7] = await barData.createBar(
		"City Works (King of Prussia Town Center - King of Prussia)",
		"Discover a taste of elegance at our bar. Immerse yourself in crafted cocktails, savory bites, and an atmosphere that elevates every moment. Join us for an unforgettable experience!",
		{
			streetAddress: "220 Main St",
			city: "King of Prussia",
			state: "PA",
			zipCode: "19406",
		},
		"484-690-4150",
		"cityworksrestaurant@gmail.com",
		"www.cityworksrestaurant.com/locations/kingofprussia-2/",
		"654438c26ec81bf9429dc36e",
		["DrinkSpecials", "HappyHourDeals"]
	);
	console.log(testBars[7]);
} catch (e) {
	console.log(e);
}

//3 Bars Near Professor in Sussex, NJ
try {
	testBars[8] = await barData.createBar(
		"Early American Tavern",
		"Sip, socialize, and savor! Unwind in our stylish bar with crafted cocktails and a vibrant atmosphere.",
		{
			streetAddress: "9 Main St",
			city: "Sussex",
			state: "NJ",
			zipCode: "07461",
		},
		"973-875-3000",
		"earlyamericantavern@gmail.com",
		"www.earlyamericantavern.com",
		"654438c26ec81bf9429dc36e",
		["AfterWorkDrinks", "WhiskeyTasting", "LadiesNight"]
	);
	console.log(testBars[8]);
} catch (e) {
	console.log(e);
}

try {
	testBars[9] = await barData.createBar(
		"Allen's Bar & Liquors",
		"Discover the perfect blend of drinks, music, and camaraderie at our trendy bar hotspot.",
		{
			streetAddress: "31 Loomis Ave",
			city: "Sussex",
			state: "NJ",
			zipCode: "07461",
		},
		"973-875-5700",
		"allensbarandliquors@gmail.com",
		"www.allensbarandliquors.com",
		"654438c26ec81bf9429dc36e",
		["DrinkSpecials", "Mixology", "WhiskeyTasting"]
	);
	console.log(testBars[9]);
} catch (e) {
	console.log(e);
}

try {
	testBars[10] = await barData.createBar(
		"Airport Pub",
		"Find a hidden gem where good times flow. Our bar invites you to indulge in lively spirits and great company.",
		{
			streetAddress: "65 County Rd 639",
			city: "Sussex",
			state: "NJ",
			zipCode: "07461",
		},
		"973-702-1215",
		"airportpub@gmail.com",
		"m.facebook.com/airportpub/",
		"654438c26ec81bf9429dc36e",
		["BarHopping", "Shots"]
	);
	console.log(testBars[10]);
} catch (e) {
	console.log(e);
}

//2 bars in Hoboken, NJ
try {
	testBars[11] = await barData.createBar(
		"Wicked Wolf Tavern",
		"Crafted concoctions, vibrant vibes—our bar is a liquid symphony, where spirits dance and stories unfold in every sip.",
		{
			streetAddress: "120 Sinatra Dr",
			city: " Hoboken",
			state: "NJ",
			zipCode: "07030",
		},
		"201-659-7500",
		"info@wickedwolfhoboken.com",
		"wickedwolfhoboken.com",
		"654438c26ec81bf9429dc36e",
		["WineWednesday", "LiveMusic", "Shots","LadiesNight"]
	);
	console.log(testBars[11]);
} catch (e) {
	console.log(e);
}

try {
	testBars[12] = await barData.createBar(
		"Mikie Squared Bar & Grill",
		"Elevate your spirits in our eclectic sanctuary, where each drink is a brushstroke on the canvas of a memorable night.",
		{
			streetAddress: "616 Washington St",
			city: " Hoboken",
			state: "NJ",
			zipCode: "07030",
		},
		"201-792-0001",
		"mikiesquared@gmail.com",
		"mikiesquared.com",
		"654438c26ec81bf9429dc36e",
		["AfterWorkDrinks", "Tacos", "Grill", "Cocktails"]
	);
	console.log(testBars[12]);
} catch (e) {
	console.log(e);
}

//3 reviews santa ana
try {
	testBars[12] = await barData.createBar(
		"Mikie Squared Bar & Grill",
		"Elevate your spirits in our eclectic sanctuary, where each drink is a brushstroke on the canvas of a memorable night.",
		{
			streetAddress: "616 Washington St",
			city: " Hoboken",
			state: "NJ",
			zipCode: "07030",
		},
		"201-792-0001",
		"mikiesquared@gmail.com",
		"mikiesquared.com",
		"654438c26ec81bf9429dc36e",
		["AfterWorkDrinks", "Tacos", "Grill", "Cocktails"]
	);
	console.log(testBars[12]);
} catch (e) {
	console.log(e);
}

//3 reviews orange county

//2 reviews for New York


//  _____  ________      _______ ________          _______ 
// |  __ \|  ____\ \    / /_   _|  ____\ \        / / ____|
// | |__) | |__   \ \  / /  | | | |__   \ \  /\  / / (___  
// |  _  /|  __|   \ \/ /   | | |  __|   \ \/  \/ / \___ \ 
// | | \ \| |____   \  /   _| |_| |____   \  /\  /  ____) |
// |_|  \_\______|   \/   |_____|______|   \/  \/  |_____/ 

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Mark",
		testBars[0].name,
		testBars[0]._id.toString(),
		4,
		"The drinks were amazing and the food delicious. The only little issue is that the music was too loud for my taste."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Christina",
		testBars[0].name,
		testBars[0]._id.toString(),
		5,
		"Great vibes, awesome drinks, and friendly staff! 🍻🎉"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Andrew",
		testBars[1].name,
		testBars[1]._id.toString(),
		5,
		"Fantastic atmosphere, top-notch service, and delicious cocktails! 🌟🍹"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Ryan",
		testBars[1].name,
		testBars[1]._id.toString(),
		1,
		"Terrible experience - rude staff, dirty environment, and the drinks tasted awful. Wouldn't recommend to my worst enemy! 😡👎"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Josh",
		testBars[2].name,
		testBars[2]._id.toString(),
		4,
		"Absolutely fantastic! Outstanding service, great ambiance, and the cocktails were a delight. A hidden gem that deserves all the praise. 🌟🍹"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Amber",
		testBars[2].name,
		testBars[2]._id.toString(),
		3,
		"Average experience. The service was okay, and the drinks were decent. Nothing exceptional but not terrible either. Might try something new next time."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Yoseph",
		testBars[3].name,
		testBars[3]._id.toString(),
		4,
		"Amazing vibes, loved it!"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Parker",
		testBars[3].name,
		testBars[3]._id.toString(),
		3,
		"Decent drinks, nothing special."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Jasmine",
		testBars[4].name,
		testBars[4]._id.toString(),
		1,
		"STAY OUT OF MASS, EW THEY HAD RATS."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Drake",
		testBars[4].name,
		testBars[4]._id.toString(),
		2,
		"Mid."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Anna",
		testBars[5].name,
		testBars[5]._id.toString(),
		2,
		"Food was cold and the bar had an odd odor, entertainment was good tho."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Harold",
		testBars[5].name,
		testBars[5]._id.toString(),
		1,
		"One of the waitresses cursed me out for only tipping 5 dollars."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Sienna",
		testBars[6].name,
		testBars[6]._id.toString(),
		5,
		"The martini I had was absolutely bangin!"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Matt",
		testBars[6].name,
		testBars[6]._id.toString(),
		4,
		"Great experience overall! Only reason I am not giving 5 stars is due to a lack of tp in the mens bathroom."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Lily",
		testBars[7].name,
		testBars[7]._id.toString(),
		3,
		"Middle-of-the-road experience, meh."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Matt",
		testBars[7].name,
		testBars[7]._id.toString(),
		4,
		"Alright place, could be better."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Patrick",
		testBars[8].name,
		testBars[8]._id.toString(),
		5,
		"Great bar! Will go back!"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Matilda",
		testBars[8].name,
		testBars[8]._id.toString(),
		5,
		"That Patrick guys sure is right, awesome place!"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Michael",
		testBars[9].name,
		testBars[9]._id.toString(),
		4,
		"Decent place, the wifi signal was very limited so I could not post on facebook!"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Gaetano",
		testBars[9].name,
		testBars[9]._id.toString(),
		5,
		"Good drinks and music."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Gianna",
		testBars[10].name,
		testBars[10]._id.toString(),
		4,
		"The mixed drinks were stellar and I enjoyed the atmosphere!"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Becky",
		testBars[10].name,
		testBars[10]._id.toString(),
		3,
		"The kids that go there are loud and obnoxious"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Amy",
		testBars[11].name,
		testBars[11]._id.toString(),
		1,
		"They didn't met me in because they thought my ID was fake! If I could give 0 stars I would..."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Kole",
		testBars[11].name,
		testBars[11]._id.toString(),
		5,
		"They had very tight security and it made me feel safe! They didn't even let this girl in who had a fake ID!"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36e",
		"Amy",
		testBars[12].name,
		testBars[12]._id.toString(),
		1,
		"They didn't met me in because they thought my ID was fake! If I could give 0 stars I would..."
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

try {
	const review = await reviewData.createReview(
		"654438c26ec81bf9429dc36f",
		"Kole",
		testBars[12].name,
		testBars[12]._id.toString(),
		5,
		"They had very tight security and it made me feel safe! They didn't even let this girl in who had a fake ID!"
	);
	console.log(review);
} catch (e) {
	console.log(e);
}

//  ________      ________ _   _ _______ _____ 
// |  ____\ \    / /  ____| \ | |__   __/ ____|
// | |__   \ \  / /| |__  |  \| |  | | | (___  
// |  __|   \ \/ / |  __| | . ` |  | |  \___ \ 
// | |____   \  /  | |____| |\  |  | |  ____) |
// |______|   \/   |______|_| \_|  |_| |_____/ 

try {
	const testEvent = await barData.addEvent(
		testBars[0]._id.toString(),
		"12/09/2024",
		"Tortilla's Party",
		"This is a lady's night event, where all the ladies will have their first margarita for free.",
		"07:00 PM",
		"09:00 PM"
	);
	console.log(testEvent);
} catch (e) {
	console.log(e);
}

try {
	const testEvent = await barData.addEvent(
		testBars[1]._id.toString(),
		"12/31/2023",
		"Snoop Dog Meet and Greet",
		"Snoop is coming to the building for a live performance and fan meetup!",
		"12:00 AM",
		"03:00 AM"
	);
	console.log(testEvent);
} catch (e) {
	console.log(e);
}

try {
	const testEvent = await barData.addEvent(
		testBars[6]._id.toString(),
		"12/31/2023",
		"Trivia Night",
		"Test your knowledge and enjoy great drinks at 8 PM!",
		"08:00 PM",
		"10:00 PM"
	);
	console.log(testEvent);
} catch (e) {
	console.log(e);
}

try {
	const testEvent = await barData.addEvent(
		testBars[9]._id.toString(),
		"12/29/2023",
		"BOGO SHOTS",
		"Buy a shot get a shot, starting at 6pm",
		"06:00 PM",
		"08:00 PM"
	);
	console.log(testEvent);
} catch (e) {
	console.log(e);
}

try {
	const testEvent = await barData.addEvent(
		testBars[11]._id.toString(),
		"01/01/2024",
		"New Years, More Beers",
		"Beers are half off in celebration of the new year! All day special!",
		"08:00 AM",
		"11:00 PM"
	);
	console.log(testEvent);
} catch (e) {
	console.log(e);
}

//  _____  ______ _____   ____  _____ _______ _____ 
// |  __ \|  ____|  __ \ / __ \|  __ \__   __/ ____|
// | |__) | |__  | |__) | |  | | |__) | | | | (___  
// |  _  /|  __| |  ___/| |  | |  _  /  | |  \___ \ 
// | | \ \| |____| |    | |__| | | \ \  | |  ____) |
// |_|  \_\______|_|     \____/|_|  \_\ |_| |_____/ 
try {
	const testReport = await reportsData.registerReport(
		"654438c26ec81bf9429dc36e",
		"Miguel Martinez",
		"mmartinez@gmail.com",
		"Inaccurate information",
		"Prices are different from promotion."
	);
	console.log(testReport);
} catch (e) {
	console.log(e);
}

try {
	const testReport = await reportsData.registerReport(
		"6578d6263fbeda92944de4b1",
		"Matthew Fultz",
		"mfultz@gmail.com",
		"Inaccurate information",
		"Price are different from promotion."
	);
	console.log(testReport);
} catch (e) {
	console.log(e);
}

await closeConnection();