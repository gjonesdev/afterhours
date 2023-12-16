import { reviewData, accountData, barData } from "../data/index.js";
import { Router } from "express";
const router = Router();
import * as validation from "../helpers.js";
import filtersHelp from "../filterhelper.js";
import "dotenv/config";

router
  .route("/")
  .get(async (req, res) => {
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
  })
  .post(async (req, res) => {
    if (!req.body) {
      return res.status(400).json({ reqResponse: "All fields are required" });
    }
    let location = req.body.location;
    let locType = req.body.locType;
    let trmLocation = location.trim();
    let trmLocType = locType.trim();
    if (trmLocType.length === 0 || trmLocation.length === 0) {
      return res.status(400).json({ reqResponse: "All fields are required" });
    }

    if (trmLocType === "ziCode") {
      let i = 0;
      trmLocation.forEach((a) => {
        if (isNaN(a)) {
          return res.status(400).json({ reqResponse: "Invalid Zip Code" });
        }
        ++i;
      });
      if (i !== 5) {
        return res.status(400).json({ reqResponse: "Invalid Zip Code" });
      }
      const reqZicode = trmLocation;
      const cityBars = await filtersHelp.barsDistance(reqZicode);
      res.json({ reqResponse: cityBars });
    } else if (trmLocType === "cityState") {
      if (trmLocation.length === 0) {
        return res.status(400).json({ reqResponse: "Invalid City/State" });
      }

      try {
        const cityBars = await filtersHelp.cityBars(trmLocation);
        res.json({ reqResponse: cityBars });
      } catch (e) {
        return res.status(500).json({ reqResponse: e });
      }
    } else {
      return res.status(403).render("error", {
        error: { status: 403, message: "Prohibited area" },
        message: `${req.body.locType} is a prohibited option!`,
      });
    }
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
    const account = await accountData.getAccount(req.session.user.accountId);
    const accountType = account.accountType;
    if (accountType !== "owner") {
      return res.status(403).render("error", {
        error: { status: 403, message: "Prohibirted area" },
        message: "This function is not allowed for your account type",
      });
    }

    res.render("createBar");
  })
  .post(async (req, res) => {
    const account = await accountData.getAccount(req.session.user.accountId);
    const accountId = req.session.user.accountId;
    const accountType = account.accountType;
    if (accountType !== "owner") {
      return res.status(403).render("error", {
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
      req.body.createName = validation.validateRequiredStr(req.body.createName);
    } catch (e) {
      errors.push(e);
    }

    try {
      req.body.createDesc = validation.validateRequiredStr(req.body.createDesc);
    } catch (e) {
      errors.push(e);
    }

    try {
      validation.validateLocation(location);
    } catch (e) {
      errors.push(e);
    }

    try {
      req.body.createEmail = validation.validateEmail(req.body.createEmail);
    } catch (e) {
      errors.push(e);
    }

    try {
      req.body.createPhone = validation.validatePhone(req.body.createPhone);
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
router.route("/searchBar").post(async (req, res) => {
  let searcCriteria = req.body.searchInput;
  if (!req.body) {
    return res.status(400).render("search", {
      error: "Type something and I will find you a bar!",
      isError: true,
    });
  }

  try {
    searcCriteria = validation.validateRequiredStr(searcCriteria);
  } catch (e) {
    return res.status(400).render("search", { error: e, isError: true });
  }
  try {
    const searchBar = await barData.barSearch(searcCriteria);
    res.render("bars", { bars: searchBar, isSearch: true });
  } catch (e) {
    if (e.code === 1) {
      res.status(404).render("search", { error: e.msg, isError: true });
    } else if (e.code === 2) {
      res.status(400).render("search", { error: e.msg, isError: true });
    } else {
      res.status(500).render("search", { error: e.msg, isError: true });
    }
  }
});

router.route("/editBar").post(async (req, res) => {
  const barId = req.body.barIdToEdit;
  const errors = [];
  if (!barId) {
    errors.push("Missing bar id");
    return res.status(400).render("login", { errors: errors, hasErrors: true });
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
    req.body.updateName = validation.validateRequiredStr(req.body.updateName);
  } catch (e) {
    errors.push(e);
  }

  try {
    req.body.updateDesc = validation.validateRequiredStr(req.body.updateDesc);
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
    req.body.updateWebsite = validation.validateWebsite(req.body.updateWebsite);
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

    console.log(theBar);
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
