import { reviewData, accountData, userData, barData } from "../data/index.js";
import { Router } from "express";
const router = Router();
import * as validation from "../helpers.js";
import filtersHelp from "../filterhelper.js";
import "dotenv/config";
//import { filter } from "bluebird";

router.route("/").get(async (req, res) => {
  let location = true;
  let allTheBars = {};
  //TODO: condition to work when loc if off.
  let barsDistance = await filtersHelp.sortedBarsbyDistance();
  if (barsDistance.length === 0) {
    const allBars = await barData.allBars();
    location = false;
    allTheBars = await filtersHelp.sortedByRating(allBars);
  } else {
    allTheBars = barsDistance;
  }
  res.render("bars", {
    bars: allTheBars,
    location: location,
    tags: [
      "Sport",
      "Grill",
      "Margaritas",
      "Tacos",
      "Dance",
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

router
    .route("/createBar")
    .get(async (req, res) => {
        if (!req.session.user) {
            return res.render("error", {
                error: { status: 403, message: "Prohibited area" },
                message: "You need a owner account to access this area!",
            });
        }
        const account = await accountData.getAccount(
            req.session.user.accountId
        );
        const accountType = account.accountType;
        if (accountType !== "owner") {
            return res.render("error", {
                error: { status: 403, message: "Prohibited area" },
                message: "This function is not allowed for your account type",
            });
        }

        res.render("createBar");
    })
    .post(async (req, res) => {
        const account = await accountData.getAccount(
            req.session.user.accountId
        );
        const accountId = req.session.user.accountId;
        const accountType = account.accountType;
        if (accountType !== "owner") {
            res.render("error", {
                error: { status: 403, message: "Prohibited area" },
                message: "This function is not allowed for your account type",
            });
        }

        req.body = req.body;
        let theBar = {};
        const errors = [];
        const streetAddress = req.body.createAddress;
        const city = req.body.createCity;
        const state = req.body.createState;
        const zipCode = req.body.createZipCode;
        const location = { streetAddress, city, state, zipCode };
        const tags = req.body.tags;

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
                accountId,
                tags
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
        res.status(500).json({ error: "Server Error" });
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

router.route("/:barId").get(async (req, res) => {
    try {
        req.params.barId = validation.validateId(req.params.barId);
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    try {
        const theBar = await barData.barById(req.params.barId);
        let isOwner = false;
        let favoriteToggle = "Favorite";
        if (req.session.user) {
            isOwner = theBar.ownerId === req.session.user.accountId;
            const account = await accountData.getAccount(
                req.session.user.accountId
            );
            const user = await userData.getUser(account.userId);
            user.favorites.forEach((favorite) => {
                if (favorite.barId === theBar._id.toString()) {
                    favoriteToggle = "Unfavorite";
                }
            });
        }
        let reviewEmpty = true;
        if (req.session.user) {
            const account = await accountData.getAccount(
				req.session.user.accountId
			);
			const userId = account.userId
            theBar.reviews.forEach((review) => {
                if (userId === review.accountId) {
                    reviewEmpty = false;
                }
            });
            if (theBar.ownerId === req.session.user.accountId) {
                reviewEmpty = false;
            }
            console.log(theBar.ownerId)
            console.log(req.session.user.accountId)
        }

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
            favoriteToggle,
            reviewEmpty,
        });
    } catch (e) {
        res.status(404).json({ error: "Bar not found!" });
    }
});

router.route("/barsByFilters").post(async (req, res) => {
    const filters = [];

    Object.values(req.body).forEach((filter) => {
        if (filter.trim() !== "" && typeof filter === "string") {
            filters.push(filter);
        }
    });

    try {
        const bars = await barData.barsByFilters(filters);
        res.json(bars);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});
router.route("/noLocReset").post(async (req, res) => {
  if (req.body.userLoc === "off") {
    const allBars = await filtersHelp.allBarsPlus();
    const allTheBars = await filtersHelp.sortedByRating(allBars);
    renderedList = allTheBars;
    res.json({ allBars: allTheBars });
  }
});
router.route("/sortBy").post(async (req, res) => {
  // TODO: validate info
  const sortOption = req.body.option;
  let sorted = [];
  if (sortOption === "highestrating") {
    sorted = await filtersHelp.sortedByRating(renderedList);
  } else if (sortOption === "mostFavorites") {
    sorted = await filtersHelp.sortedByLikes(renderedList);
  } else if (sortOption === "mostReviews") {
    sorted = await filtersHelp.sortedReviews(renderedList);
  } else if (sortOption === "closest") {
    sorted = await filtersHelp.sortedBarsbyDistance(renderedList);
  }
  res.json({ reqResponse: sorted });
});

router.route("/tags").get(async (req, res) => {
  const tagsToRender = new Set();

  renderedList.forEach((bar) => {
    const tags = bar.bar.tags;
    tags.forEach((t) => {
      tagsToRender.add(t);
    });
  });
  res.json({ reqResponse: sorted });
});

export default router;
