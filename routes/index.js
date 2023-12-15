import rootRoutes from "./root.js";
import accountRoutes from "./accounts.js";
import userRoutes from "./users.js";
import barRoutes from "./bars.js";
import reports from "./reports.js";
import reviewsRoutes from "./reviews.js";
import eventsRoutes from "./events.js";

const constructorMethod = (app) => {
  app.use("/", rootRoutes);
  app.use("/bars", barRoutes);
  app.use("/events", eventsRoutes);
  app.use("/reviews", reviewsRoutes);
  app.use("/account", accountRoutes);
  app.use("/user", userRoutes);
  app.use("/reports", reports);
  app.use("/:userId", reports);

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructorMethod;
