import { dbConnection, closeConnection } from "../config/mongoConnection.js";
const db = await dbConnection();
await db.dropDatabase();

import bars from "../data/bars.js";

try {
  let test = await bars.createBar(
    "GazBar",
    "The GazBar Sports Grill is a fresh, newly renovated sports bar and grill in Central Massachusetts. We offer everything your taste buds can handle and if you don’t see something you’d like….just ask and ourChef will personally create your meal. The GazBar offers a dining experience that Leominster has NEVER seen before.",
    {
      streetAddress: "1045 Central Street",
      city: "Leominster",
      state: "MA",
      zipCode: "01453",
    },
    "thegazbar@gazbar.com",
    "www.gazBar.com",
    "654438c26ec81bf9429dc36e",
    ["sprot", "Grill", "Margaritas"]
  );
  console.log(test);
} catch (e) {
  console.log(e);
}

try {
  let test = await bars.createBar(
    "Mellos's Mexican",
    "The GazBar Sports Grill is a fresh, newly renovated sports bar and grill in Central Massachusetts. We offer everything your taste buds can handle and if you don’t see something you’d like….just ask and ourChef will personally create your meal. The GazBar offers a dining experience that Leominster has NEVER seen before.",
    {
      streetAddress: "1045 Central Street",
      city: "Leominster",
      state: "MA",
      zipCode: "01453",
    },
    "thegazbar@gazbar.com",
    "www.gazBar.com",
    "654438c26ec81bf9429dc36e",
    ["sprot", "Grill", "Margaritas"]
  );
  console.log(test);
} catch (e) {
  console.log(e);
}

try {
  let test = await bars.createBar(
    "Apple Bee's",
    "The GazBar Sports Grill is a fresh, newly renovated sports bar and grill in Central Massachusetts. We offer everything your taste buds can handle and if you don’t see something you’d like….just ask and ourChef will personally create your meal. The GazBar offers a dining experience that Leominster has NEVER seen before.",
    {
      streetAddress: "1045 Central Street",
      city: "Leominster",
      state: "MA",
      zipCode: "01453",
    },
    "thegazbar@gazbar.com",
    "www.gazBar.com",
    "654438c26ec81bf9429dc36e",
    ["sprot", "Grill", "Margaritas"]
  );
  console.log(test);
} catch (e) {
  console.log(e);
}
/*
try {
  console.log(barss.barById("654696485139a59f569c79fd"));
} catch (e) {
  console.log(e);
}
*/
await closeConnection();
