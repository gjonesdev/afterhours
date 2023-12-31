import { Router } from "express";
import { validateEmail, validatePassword } from "../helpers.js";
import { login } from "../data/accounts.js";
import { barData } from "../data/index.js";
import filtersFun from "../filterhelper.js";
import xss from "xss";

const router = Router();
const oldUserLoc = { latitude: "", longitude: "", isNeeded: false };

router
  .route("/")
  .get(async (req, res) => {
    try {
      const userLocation = xss(req.body);
      return res.render("home", { title: "home" });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    const userLocation = {
      latitude: xss(req.body.latitude),
      longitude: xss(req.body.longitude),
    };

    if (
      userLocation.latitude !== oldUserLoc.latitude ||
      userLocation.longitude !== oldUserLoc.longitude
    ) {
      oldUserLoc.isNeeded = true;
      oldUserLoc.latitude = userLocation.latitude;
      oldUserLoc.longitude = userLocation.longitude;
    }
    try {
      if (oldUserLoc.isNeeded) {
        const barsDistance = await filtersFun.barsDistance(userLocation);
        oldUserLoc.isNeeded = false;
      }
      const barOfTheDay = await filtersFun.barOfTheDay();
      res.json({ BOD: barOfTheDay });
    } catch (e) {
      if (e.code === 404) {
        res.json({
          BOD: {
            noBarsFound: `We have not bars listed yet. We are working on adding some bars.`,
          },
        });
      } else if (e.code === 400) {
        res.status(400).json({ BOD: e });
      } else {
        res.status(500).json({ BOD: e });
      }
    }
  });

router.route("/about").get(async (req, res) => {
  try {
    return res.render("aboutUs", { title: "About" });
  } catch (e) {
    const test = 0;
    return res.status(500).json({ error: e });
  }
});

router.route("/terms").get(async (req, res) => {
  try {
    return res.render("terms", { title: "Terms" });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/privacy").get(async (req, res) => {
  try {
    return res.render("privacy", { title: "Privacy" });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/services").get(async (req, res) => {
  try {
    return res.render("services", { title: "Our Services" });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/register").get(async (req, res) => {
  try {
    return res.render("register", { title: "register" });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router
  .route("/login")
  .get(async (req, res) => {
    try {
      return res.render("login", { title: "login", form: req.body });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    let loginInfo = {
      email: req.body.emailInput,
      password: req.body.passwordInput,
    };
    try {
      loginInfo.email = validateEmail(loginInfo.email);
      loginInfo.password = loginInfo.password.trim();
    } catch (e) {
      return res.status(400).render("login", {
        title: "login",
        form: req.body,
        error: { status: 400, message: e },
      });
    }

    try {
      const user = await login(loginInfo);
      if (user) {
        req.session.user = user;
        return res.redirect(303, "/");
      }
    } catch (e) {
      return res.status(400).render("login", {
        title: "login",
        form: req.body,
        error: { status: 400, message: e },
      });
    }
  });

router.route("/logout").get(async (req, res) => {
  try {
    req.session.destroy();
    return res.redirect("/");
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/error").get(async (req, res) => {
  try {
    return res.status(403).render("error", {
      title: "Error",
      error: {
        status: 403,
        message: "You do not have permission to view this page.",
      },
    });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

export default router;
