import axios from "axios";
import barsFunctions from "./data/bars.js";
import date from "date-and-time";

//Global Variables
let userCity = "";
let barsDistanceList = [];

let exportedMethods = {
	async barsDistance(userLocation, bars) {
		const myKey = "AIzaSyCNmw9imxqmAtqkfDn194OzvwuTwjMOZXw";
		const userLoc = userLocation.latitude + "," + userLocation.longitude;

		let destinations = "";
		bars.forEach((bar) => {
			if (bars[bars.length - 1] !== bar) {
				destinations += `${bar.location.streetAddress}%20${bar.location.city}%20${bar.location.state}%7C`;
			} else {
				destinations += `${bar.location.streetAddress}%20${bar.location.city}%20${bar.location.state}`;
			}
		});

		const url =
			"https://maps.googleapis.com/maps/api/distancematrix/json?destinations=" +
			destinations +
			"&origins=" +
			userLoc +
			"&units=imperial&key=" +
			myKey;

		//Creating a bar distance time object
		const { data } = await axios.get(url);
		const { rows } = data;
		const distances = rows[0];

		for (let i = 0; i < bars.length; i++) {
			const barsDistance = {
				bar: bars[i],
				distance: distances.elements[i],
			};
			barsDistanceList.push(barsDistance);
		}

		let userAddress = data.origin_addresses[0];
		userCity = userAddress.split(", ")[1];
		barsDistanceList.push({ userCity: userCity });

		return barsDistanceList;
	},

	async barOfTheDay(allBars) {
		//Variables
		const candidatesToBOD = [];
		const now = new Date();
		const today = date.format(now, "MM/DD/YYYY");
		const aBOD = [];
		let hasEvent = true;
		let cityBar = true;
		let eventToday = true;
		const cityBars = [];

		//Cehcking if there is a BOD in the user's city
		allBars.forEach((bar) => {
			const barCity = bar.location.city;
			if (barCity === userCity) {
				if (bar.BODDate === today) {
					aBOD.push(bar);
				}
			}
		});
		if (aBOD.length === 0) {
			allBars.forEach((bar) => {
				const events = bar.schedule;
				//const numEvents = bar.schedule.length;
				const barCity = bar.location.city;
				if (barCity === userCity) {
					cityBar = true;
					cityBars.push(bar);
					if (events.length === 0) {
						hasEvent = false;
					} else {
						hasEvent = true;
						events.forEach((event) => {
							if (event.date === today) {
								eventToday = true;
								candidatesToBOD.push(bar);
							} else {
								eventToday = false;
							}
						});
					}
				} else {
					cityBar = false;
				}
			});
			//Sorting BOD (bar of the date) candidates, first by rating and then by favorites
			const sortedCandidates = [];
			if (candidatesToBOD.length > 1) {
				sortedCandidates = candidatesToBOD.sort(function (a, b) {
					return (
						a.ratingAverage - b.ratingAverage ||
						b.favoritesCount - a.favoritesCount
					);
				});
				const BODId = sortedCandidates[0]._id.toString();
				return barsFunctions.makeBOD(BODId);
			} else if (candidatesToBOD.length === 1) {
				const BODId = candidatesToBOD[0]._id.toString();
				return barsFunctions.makeBOD(BODId);
			} else if (!cityBar) {
				return {
					message: `We have not bars listed in ${userCity} yet. We are working on adding more  bars.`,
				};
			} else if (candidatesToBOD.length === 0 && !eventToday) {
				sortedCandidates = cityBars.sort(function (a, b) {
					return (
						a.ratingAverage - b.ratingAverage ||
						b.favoritesCount - a.favoritesCount
					);
				});
				const BODId = sortedCandidates[0]._id.toString();
				return barsFunctions.makeBOD(BODId);
			}
		} else {
			return aBOD[0];
		}
	},
};

export default exportedMethods;
