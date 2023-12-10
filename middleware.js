import session from "express-session";

export const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

export const defaultRedirect = async (req, res, next) => {
  console.log(
    `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${
      req.session.user ? "Authenticated User" : "Non-Authenticated User"
    })`
  );

  next();
};

export const accountRedirect = async (req, res, next) => {
  console.log("account middleware");

  console.log(req.originalUrl);

  if (req.method === "GET" && !req.session.user) {
    return res.redirect("/login");
  }

  if (req.method === "POST" && req.session.user) {
    return res.redirect("/");
  }

  next();
};

export const registerRedirect = async (req, res, next) => {
  console.log("register middleware");
  if (req.session.user) {
    return res.redirect("/");
  }

  next();
};

export const loginRedirect = async (req, res, next) => {
  console.log("login middleware");
  if (req.session.user) {
    return res.redirect("/");
  }

  next();
};

export const logoutRedirect = async (req, res, next) => {
  console.log("logout middleware");
  if (!req.session.user) {
    return res.redirect("/");
  }

  next();
};
