import { barData } from "../data/index.js";
import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  const bars = await barData.allBars();

  res.json(bars);
  //code here for GET will render the home handlebars file
  //res.render("home", { title: "Marvel Character Finder" });
});

export default router;
