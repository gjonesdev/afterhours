import { reviewData, accountData, barData } from "../data/index.js";
import { Router } from "express";
const router = Router();
import * as validation from "../helpers.js";
import filtersHelp from "../filterhelper.js";
import "dotenv/config";
//import { filter } from "bluebird";

let renderedList = [];

router
  .route("/")
  .get(async (req, res) => {
    let location = true;
    let allTheBars = {};
    let barsDistance = await filtersHelp.sortedBarsbyDistance();
    const test = 0;
    if (barsDistance.length === 0) {
      return res.redirect("/");
    } else {
      barsDistance = await filtersHelp.sortedBarsbyDistance();
      allTheBars = barsDistance;
    }
    renderedList = allTheBars;
    res.render("bars", {
      bars: allTheBars,
      location: location,
      tags: [
        "#Sport",
        "#Cocktails",
        "#Mixology",
        "#CraftBeer",
        "#WineWednesday",
        "#BarEvents",
        "#DrinkSpecials",
        "#ThirstyThursday",
        "#LiveMusic",
        "#BeerTasting",
        "#MixandMingle",
        "#LadiesNight",
        "#BarCrafting",
        "#Tapas",
        "#ChampagneNight",
        "#AfterWorkDrinks",
        "#SignatureCocktails",
        "#WhiskeyTasting",
        "#HappyHourDeals",
        "#CraftCocktails",
        "#Shots",
        "#BarHopping",
      ],
    });
  })
  .post(async (req, res) => {
    if (!req.body.state) {
      return res.status(400).json({
        reqResponse:
          "State is needed so we can find you a bar in a specific City!",
      });
    }

    let searchCity = req.body.city;
    let searchState = req.body.state;

    try {
      searchState = validation.validateRequiredStr(searchState);
      searchCity = validation.validateOptionalStr(searchCity);
    } catch (e) {
      return res.status(400).json({ reqResponse: e.msg });
    }

    try {
      const cityBars = await filtersHelp.cityBars(searchCity, searchState);
      const allBars = await filtersHelp.allBarsPlus(cityBars);
      renderedList = allBars;
      return res.json({ reqResponse: allBars });
    } catch (e) {}
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
    const errors = new Set();
    const streetAddress = req.body.createAddress;
    const city = req.body.createCity;
    const state = req.body.createState;
    const zipCode = req.body.createZipCode;
    const location = { streetAddress, city, state, zipCode };
    const tags = req.body.tags;

    if (!req.body) {
      errors.add("Information needs to be provided");
      return res.render("createBar", { error: errors, isError: true });
    }

    try {
      req.body.createName = validation.validateRequiredStr(req.body.createName);
    } catch (e) {
      errors.add(e.msg);
    }

    try {
      req.body.createDesc = validation.validateRequiredStr(req.body.createDesc);
    } catch (e) {
      errors.add(e.msg);
    }

    try {
      validation.validateLocation(location);
    } catch (e) {
      errors.add(e);
    }

    try {
      req.body.createEmail = validation.validateEmail(req.body.createEmail);
    } catch (e) {
      errors.add(e.msg);
    }

    try {
      req.body.createPhone = validation.validatePhone(req.body.createPhone);
    } catch (e) {
      errors.add(e);
    }

    try {
      req.body.createWebsite = validation.validateWebsite(
        req.body.createWebsite
      );
    } catch (e) {
      errors.add(e);
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
      errors.add(e);
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
  if (!req.body) {
    return res.status(400).render("bars", {
      error: "Type something and I will find you a bar!",
      isError: true,
    });
  }
  let searcCriteria = req.body.searchInput;
  try {
    searcCriteria = validation.validateRequiredStr(searcCriteria);
  } catch (e) {
    return res.status(400).render("bars", { error: e.msg, isError: true });
  }
  let allBars;
  try {
    const searchBar = await barData.barSearch(searcCriteria);
    allBars = await filtersHelp.allBarsPlus(searchBar);
  } catch (e) {
    if (e.code === 404) {
      res.status(404).render("bars", { error: e.msg, isError: true });
    } else if (e.code === 400) {
      res.status(400).render("bars", { error: e.msg, isError: true });
    } else {
      res.status(500).render("bars", { error: e.msg, isError: true });
    }
  }
  renderedList = allBars;
  res.render("bars", {
    bars: allBars,
  });
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
    errors.push(e.msg);
    res.render("editBar", { error: errors, isError: true });
  }

  try {
    req.body.updateName = validation.validateRequiredStr(req.body.updateName);
  } catch (e) {
    errors.push(e.msg);
  }

  try {
    req.body.updateDesc = validation.validateRequiredStr(req.body.updateDesc);
  } catch (e) {
    errors.push(e.msg);
  }

  try {
    location = validation.validateLocation(location);
  } catch (e) {
    errors.push(e.msg);
  }

  try {
    req.body.updateEmail = validation.validateEmail(req.body.updateEmail);
  } catch (e) {
    errors.push(e.msg);
  }

  try {
    req.body.updatePhone = validation.validatePhone(req.body.updatePhone);
  } catch (e) {
    errors.push(e.msg);
  }

  try {
    req.body.updateWebsite = validation.validateWebsite(req.body.updateWebsite);
  } catch (e) {
    errors.push(e.msg);
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
    if (e.code === 404) {
      errors.push(e.msg);
    } else if (e.code === 400) {
      errors.push(e.msg);
    } else {
      return res.render("error", {
        error: { status: 500, message: e.msg },
        message: e.msg,
      });
    }
  }
  if (errors.length > 0) {
    res.status(400).render("editBar", {
      errors: errors,
      hasErrors: true,
      barInfo: req.body,
    });
  }
});

router.route("/deleteBar").post(async (req, res) => {
  if (!req.body.barIdToDelete) {
    return res.status(400).render("error", {
      error: { status: 400, message: "Bar info missing!" },
      message: "Missing bar information",
    });
  }

  try {
    req.body.barIdToDelete = validation.validateId(req.body.barIdToDelete);
  } catch (e) {
    return res.status(400).render("error", {
      error: { status: 400, message: "Invalid bar id!" },
      message: "Invalid bar id",
    });
  }

  let isOwner = false;
  if (req.session.user) {
    console.log(req.session.user);
    console.log(req.session.user.accountId);
    isOwner = theBar.ownerId === req.session.user.accountId;
  } /*
  if (!isOwner) {
    return res.status(403).render("error", {
      error: { status: "403", message: "Prohibited function" },
      message:
        "You are not the owner of this bar. Only owners can delete bars!",
    });
  }*/

  try {
    await barData.removeBar(req.body.barIdToDelete);
    return res.render("error", {
      error: { status: ":(", message: "The Bar has been deleted succesfully!" },
      message: "",
    });
  } catch (e) {
    return res.status(500).render("error", {
      error: { status: "500", message: "Server Error!" },
      message: "Was not able to remove the Bar!",
    });
  }
});

router.route("/:barId").get(async (req, res) => {
  try {
    req.params.barId = validation.validateId(req.params.barId);
  } catch (e) {
    return res.status(400).render("error", {
      error: { status: "400", message: e },
      message: e,
    });
  }
  try {
    const theBar = await barData.barById(req.params.barId);

    console.log(theBar);
    //const isOwner = theBar.ownerId === req.session.accountId;
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
      isOwner: true,
    });
  } catch (e) {
    res.status(404).json({ error: "Bar not found!" });
  }
});

router.route("/barsByFilters").post(async (req, res) => {
  const filters = [];

  Object.values(req.body).forEach((filter) => {
    filters.push(filter);
  });

  try {
    const bars = filtersHelp.tagsFilter(filters, renderedList);
    res.json({ reqResponse: bars });
  } catch (e) {
    if (e.code === 404) {
      return res.status(404).json({
        reqResponse: "No bars found containing these tags!",
      });
    }
  }
});
router.route("/sortBy").post(async (req, res) => {
  if (!req.body.option) {
    res.status(400).json({ reqResponse: "Wrong input!" });
  }

  try {
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
  } catch (e) {
    res.status(500).json({ reqResponse: "Server error!" });
  }
});

export default router;
