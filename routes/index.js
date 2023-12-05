import accountRoutes from "./accounts.js";
import userRoutes from "./users.js";
import barRoutes from "./bars.js";

const constructorMethod = (app) => {
  app.use("/bars", barRoutes);
  app.use("/accounts", accountRoutes);
  app.use("/users", userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route Not found" });
  });
};

export default constructorMethod;
