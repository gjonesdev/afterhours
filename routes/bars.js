import { userData, reviewData, accountData, barData } from "../data/index.js";
import { Router } from "express";
const router = Router();
import * as validation from "../helpers.js";
import filtersHelp from "../filterhelper.js";
import multer, { diskStorage } from "multer";

let renderedList = [];
let errors = new Set();
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
    } catch (e) {return res.status(400).json({ reqResponse: e.msg });} //double check validation error
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
    upload(req, res, async (err) =>{ /**Upload the picture to the folder in the server ./image */
    req.body = req.body;
    let theBar = {};
    errors = new Set();
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
  await photoErrorHandler(req, err);
  if (errors.size === 0) { /**No errors, then create a bar with photo */
    let images = req.file;
    try {
      theBar = await barData.createBar(
        req.body.createName,
        req.body.createDesc,
        location,
        req.body.createPhone,
        req.body.createEmail,
        req.body.createWebsite,
        accountId,
        tags,
        images
      );
      filtersHelp.barDistanceHelper(true);
    } catch (e) {
      errors.add(e);
    }
  }

    if (errors.size > 0) {
      return res.status(400).render("createBar", {
        errors: errors,
        isError: true,
      });
    } else {
      return res.redirect("/bars/" + theBar._id);
    }
  });
});

router.route("/searchBar").post(async (req, res) => {
  if (!req.body) {
    return res.status(400).render("error", { 
      error: { status: 400, message: "Missing input." },
      message: "Search input is needed!",
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
  errors = new Set();
  if (!barId) {
    errors.add("Missing bar id");
    return res.status(400).render("login", { errors: errors, hasErrors: true });
  }

  try {
    const theBar = await barData.barById(barId);
    let images = {};
    images.filename = "no_image.jpeg";
    if(theBar.images) images = theBar.images;
    res.render("editBar", {
      id: theBar._id,
      barName: theBar.name,
      description: theBar.description,
      location: theBar.location,
      email: theBar.email,
      website: theBar.website,
      phone: theBar.phone,
      images: images
    });
  } catch (e) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.route("/update").post(async (req, res) => {
  upload(req, res, async (err) =>{ /**Upload the picture to the folder in the server ./image */
    errors = new Set();
    const streetAddress = req.body.updateAddress;
    const city = req.body.updateCity;
    const state = req.body.updateState;
    const zipCode = req.body.updateZipCode;
    let location = { streetAddress, city, state, zipCode };
    
    if (!req.body) {
      errors.add("Information needs to be provided");
      return res.render("editBar", { error: errors, isError: true });
    }
    try {
      req.body.updateBarId = validation.validateId(req.body.updateBarId);
    } catch (e) {
      errors.add(e.msg);
      res.render("editBar", { error: errors, isError: true });
    }

  try {
    req.body.updateName = validation.validateRequiredStr(req.body.updateName);
  } catch (e) {
    errors.add(e.msg);
  }

  try {
    req.body.updateDesc = validation.validateRequiredStr(req.body.updateDesc);
  } catch (e) {
    errors.add(e.msg);
  }

  try {
    location = validation.validateLocation(location);
  } catch (e) {
    errors.add(e.msg);// Check if the location is e.msg or just e
  }

  try {
    req.body.updateEmail = validation.validateEmail(req.body.updateEmail);
  } catch (e) {
    errors.add(e.msg);
  }

  try {
    req.body.updatePhone = validation.validatePhone(req.body.updatePhone);
  } catch (e) {
    errors.add(e.msg);
  }

  try {
    req.body.updateWebsite = validation.validateWebsite(req.body.updateWebsite);
  } catch (e) {
    errors.add(e.msg);
  }
  await photoErrorHandler(req, err); /**Photos error handler */
  if (errors.size === 0) {  /**No errors, then create a bar with photo */
    let images = req.file;
  try {
    const theBar = await barData.barProfileUpdate(
      req.body.updateBarId,
      req.body.updateName,
      req.body.updateDesc,
      location,
      req.body.updateEmail,
      req.body.updateWebsite,
      req.body.updatePhone,
      images
    );
    filtersHelp.barDistanceHelper(true);
    res.redirect("/bars/" + req.body.updateBarId);
  } catch (e) {
    if (e.code === 404) {
      errors.add(e.msg);
    } else if (e.code === 400) {
      errors.add(e.msg);
    } else {
      return res.render("error", {
        error: { status: 500, message: e.msg },
        message: e.msg,
      });
    }
   }
  }//close if
  if (errors.size > 0) {
    return res.status(400).render("editBar", {
      errors: errors,
      hasErrors: true,
      barInfo: req.body,
    });
  } 
 });
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

  let theBar = await barData.barById(req.body.barIdToDelete)
  console.log(theBar)
  let isOwner = false;
  if (req.session.user) {
    console.log(req.session.user);
    console.log(req.session.user.accountId);
    console.log(theBar.ownerId)
    isOwner = theBar.ownerId === req.session.user.accountId;
  } 
  
  if (!isOwner) {
    return res.status(403).render("error", {
      error: { status: "403", message: "Prohibited function" },
      message:
        "You are not the owner of this bar. Only owners can delete bars!",
    });
  }

  try {
    await barData.removeBar(req.body.barIdToDelete);
    filtersHelp.barDistanceHelper(true);
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
    let pathImagesArray = photoPath(theBar);
    let isOwner = false;
    let favoriteToggle = "Favorite";
    let reviewEmpty = true;
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
			const userId = account.userId
      theBar.reviews.forEach((review) => {
          if (userId === review.accountId) {
              reviewEmpty = false;
          }
      });
      if (theBar.ownerId === req.session.user.accountId) {
          reviewEmpty = false;
      }
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
      images: pathImagesArray
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

  if (filters.length == 0) {
    return res.json({ reqResponse: renderedList });
  }

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

/**Diskstorage the photo */
const fileStorageEngine = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images"); //important this is a direct path from our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-afterhours-" + file.originalname);
  },
});

/**Multer for upload the photo */
const upload = multer({ storage: fileStorageEngine }).single("images");

/**Photos error handler */
const photoErrorHandler = async(req, err) => {
      try {
        if(req.file === undefined || req.file.length <= 0) throw "You must select at least 1 photo.";
      } catch (e) {
        errors.add(e);
      }
  
      if (err) {
        try {
          if (err.code === "LIMIT_UNEXPECTED_FILE") throw "Too many files to upload.";
        } catch (e) {
          errors.add(e);
        }
  
        try {
          if (err.code === "MISSING_FIELD_NAME") throw "Field name missing for photos.";
        } catch (e) {
          errors.add(e);
        }
  
        try {
          if (err.code === "LIMIT_FIELD_COUNT") throw "Too many fields for photos.";
        } catch (e) {
          errors.add(e);
        }
  
        try {
          if (err.code === "LIMIT_FIELD_VALUE") throw "Field value too long for photos.";
        } catch (e) {
          errors.add(e);
        }
  
        try {
          if (err.code === "LIMIT_FIELD_KEY") throw "Field name too long for photos";
        } catch (e) {
          errors.add(e);
        }
  
        try {
          if (err.code === "LIMIT_FILE_COUNT") throw "Too many files for photos";
        } catch (e) {
          errors.add(e);
        }
  
        try {
          if (err.code === "LIMIT_FILE_SIZE") throw "File too large for photos";
        } catch (e) {
          errors.add(e);
        }
  
        try {
          if (err.code === "LIMIT_PART_COUNT") throw "Too many parts for photos";
        } catch (e) {
          errors.add(e);
        }   
    }
}

/**Photo path = ..\public\images\1702829435937-afterhours-IMG_20180811_193424773.jpg */
const photoPath = (theBar) => {
  let pathImagesArray;
  if(theBar.images && theBar.images.filename){
      pathImagesArray = "/public/images/"+ theBar.images.filename;
  }
  else{
    pathImagesArray = "/public/images/no_image.jpeg";
  }
  return pathImagesArray;
}

export default router;