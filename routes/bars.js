import { barData } from "../data/index.js";
import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  const bars = await barData.allBars();
  res.render("home", {
    bars: bars,
  });
});

export default router;
