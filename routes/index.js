import userRoutes from "./users.js";
import barRoutes from "./bars.js";

const constructorMethod = (app) => {
  app.use("/users", userRoutes);
  app.use("/", barRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route Not found" });
  });
};

export default constructorMethod;
