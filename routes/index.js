import accountRoutes from "./accounts.js";
import userRoutes from "./users.js";
import barRoutes from "./bars.js";
import reports from "./reports.js";

const constructorMethod = (app) => {
	app.use("/bars", barRoutes);
	app.use("/accounts", accountRoutes);
	app.use("/users", userRoutes);
	app.use("/reports", reports);

	app.use("*", (req, res) => {
		res.status(404).json({ error: "Route Not found" });
	});
};

export default constructorMethod;
