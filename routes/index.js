import rootRoutes from "./root.js";
import accountRoutes from "./accounts.js";
import userRoutes from "./users.js";
import barRoutes from "./bars.js";
import reports from "./reports.js";
import reviewsRoutes from "./reviews.js";

const constructorMethod = (app) => {
  app.use("/", rootRoutes);
  app.use("/bars", barRoutes);
  app.use("/reviews", reviewsRoutes);
  app.use("/account", accountRoutes);
  app.use("/users", userRoutes);
  app.use("/reports", reports);

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructorMethod;
