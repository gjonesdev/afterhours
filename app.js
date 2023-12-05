import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
	defaultRedirect,
	loginRedirect,
	logoutRedirect,
	accountRedirect,
	registerRedirect,
	rewriteUnsupportedBrowserMethods,
} from "./middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");

const app = express();

app.use(
	session({
		name: "AuthState",
		secret: "peyrovian's wine",
		resave: false,
		saveUninitialized: false,
	})
);

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.use("/", defaultRedirect);
app.use("/login", loginRedirect);
app.use("/register", registerRedirect);
app.use("/accounts", accountRedirect);
app.use("/logout", logoutRedirect);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log("Your routes will be running on http://localhost:3000");
});
