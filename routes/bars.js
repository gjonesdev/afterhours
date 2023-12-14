import { reviewData, accountData, barData } from "../data/index.js";
import { Router } from "express";
const router = Router();
import * as validation from "../helpers.js";
import filtersHelp from "../filterhelper.js";
import xss from "xss";

router.route("/test").get(async (req, res) => {
	res.render("test", {});
});

router.route("/").get(async (req, res) => {
	let bars = await filtersHelp.sortedBarsbyDistance();
	if (!bars.length) {
		const allBars = await barData.allBars();
		const sortedBars = await filtersHelp.sortedByRating(allBars);
		bars = sortedBars;
		return res.render("bars", {
			bars: bars,
			hasLocation: false,
			tags: [
				"Sport",
				"Cocktails",
				"Mixology",
				"CraftBeer",
				"WineWednesday",
				"BarEvents",
				"DrinkSpecials",
				"ThirstyThursday",
				"LiveMusic",
				"BeerTasting",
				"MixandMingle",
				"LadiesNight",
				"BarCrafting",
				"Tapas",
				"ChampagneNight",
				"AfterWorkDrinks",
				"SignatureCocktails",
				"WhiskeyTasting",
				"HappyHourDeals",
				"CraftCocktails",
				"Shots",
				"BarHopping",
			],
		});
	}

	res.render("bars", {
		bars: bars,
		hasLocation: true,
	});
});

router
	.route("/createBar")
	.get(async (req, res) => {
		res.render("createBar");
	})
	.post(async (req, res) => {
		req.body = req.body;
		let theBar = {};
		const errors = [];
		const streetAddress = req.body.createAddress;
		const city = req.body.createCity;
		const state = req.body.createState;
		const zipCode = req.body.createZipCode;
		const location = { streetAddress, city, state, zipCode };

		if (!req.body) {
			errors.push("Information needs to be provided");
			return res.render("createBar", { error: errors, isError: true });
		}

		try {
			req.body.createName = validation.validateRequiredStr(
				req.body.createName
			);
		} catch (e) {
			errors.push(e);
		}

		try {
			req.body.createDesc = validation.validateRequiredStr(
				req.body.createDesc
			);
		} catch (e) {
			errors.push(e);
		}

		try {
			validation.validateLocation(location);
		} catch (e) {
			errors.push(e);
		}

		try {
			req.body.createEmail = validation.validateEmail(
				req.body.createEmail
			);
		} catch (e) {
			errors.push(e);
		}

		try {
			req.body.createPhone = validation.validatePhone(
				req.body.createPhone
			);
		} catch (e) {
			errors.push(e);
		}

		try {
			req.body.createWebsite = validation.validateWebsite(
				req.body.createWebsite
			);
		} catch (e) {
			errors.push(e);
		}
		try {
			theBar = await barData.createBar(
				req.body.createName,
				req.body.createDesc,
				location,
				req.body.createPhone,
				req.body.createEmail,
				req.body.createWebsite,
				"65609846293d2b1722d25c38",
				["sport", "grill"]
			);
			filtersHelp.barDistanceHelper(true);
		} catch (e) {
			errors.push(e);
		}
		if (errors.length > 0) {
			res.status(400).render("createBar", {
				errors: errors,
				isError: true,
			});
		} else {
			res.redirect("/bars/" + theBar._id);
		}
	});

router.route("/editBar").post(async (req, res) => {
	const barId = req.body.barIdToEdit;
	const errors = [];
	if (!barId) {
		errors.push("Missing bar id");
		return res
			.status(400)
			.render("login", { errors: errors, hasErrors: true });
	}

	try {
		const theBar = await barData.barById(barId);
		res.render("editBar", {
			id: theBar._id,
			barName: theBar.name,
			description: theBar.description,
			location: theBar.location,
			email: theBar.email,
			website: theBar.website,
			phone: theBar.phone,
		});
	} catch (e) {
		res.status(404).json({ error: "Bar not found!" });
	}
});

router.route("/update").post(async (req, res) => {
	const errors = [];
	const streetAddress = req.body.updateAddress;
	const city = req.body.updateCity;
	const state = req.body.updateState;
	const zipCode = req.body.updateZipCode;
	let location = { streetAddress, city, state, zipCode };

	if (!req.body) {
		errors.push("Information needs to be provided");
		return res.render("editBar", { error: errors, isError: true });
	}
	try {
		req.body.updateBarId = validation.validateId(req.body.updateBarId);
	} catch (e) {
		errors.push(e);
		res.render("editBar", { error: errors, isError: true });
	}

	try {
		req.body.updateName = validation.validateRequiredStr(
			req.body.updateName
		);
	} catch (e) {
		errors.push(e);
	}

	try {
		req.body.updateDesc = validation.validateRequiredStr(
			req.body.updateDesc
		);
	} catch (e) {
		errors.push(e);
	}

	try {
		location = validation.validateLocation(location);
	} catch (e) {
		errors.push(e);
	}

	try {
		req.body.updateEmail = validation.validateEmail(req.body.updateEmail);
	} catch (e) {
		errors.push(e);
	}

	try {
		req.body.updatePhone = validation.validatePhone(req.body.updatePhone);
	} catch (e) {
		errors.push(e);
	}

	try {
		req.body.updateWebsite = validation.validateWebsite(
			req.body.updateWebsite
		);
	} catch (e) {
		errors.push(e);
	}
	try {
		const theBar = await barData.barProfileUpdate(
			req.body.updateBarId,
			req.body.updateName,
			req.body.updateDesc,
			location,
			req.body.updateEmail,
			req.body.updateWebsite,
			req.body.updatePhone
		);
		filtersHelp.barDistanceHelper(true);
		res.redirect("/bars/" + req.body.updateBarId);
	} catch (e) {
		res.status(404).json({ error: "Bar not found!" });
	}
});

router.route("/addEvent").get(async (req, res) => {
	res.render("newEvent", {});
});

router.route("/:barId").get(async (req, res) => {
	try {
		req.params.barId = validation.validateId(req.params.barId);
	} catch (e) {
		return res.status(400).json({ error: e });
	}
	try {
		const theBar = await barData.barById(req.params.barId);

		//console.log(theBar);
		const isOwner = theBar.ownerId === req.session.accountId;
		res.render("barById", {
			id: theBar._id,
			barName: theBar.name,
			description: theBar.description,
			location: theBar.location,
			email: theBar.email,
			website: theBar.website,
			phone: theBar.phone,
			schedule: theBar.schedule,
			tags: theBar.tags,
			reviews: theBar.reviews,
			reviewsCount: theBar.reviewsCount,
			ratingAverage: theBar.ratingAverage,
			favoritesCount: theBar.favoritesCount,
			isOwner,
		});
	} catch (e) {
		res.status(404).json({ error: "Bar not found!" });
	}
});

router.route("/barsByFilters").post(async (req, res) => {
	const filters = [];

	Object.values(req.body).forEach((filter) => {
		filters.push(filter); //.toLowerCase();
	});

	try {
		const bars = await barData.barsByFilters(filters);
		res.json(bars);
	} catch (e) {
		res.status(404).json({ error: e });
	}
});

export default router;
