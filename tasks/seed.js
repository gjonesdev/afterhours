import { dbConnection, closeConnection } from "../config/mongoConnection.js";
const db = await dbConnection();
//await db.dropDatabase();

import bars from "../data/bars.js";
import * as reviews from "../data/reviews.js";

// try {
//   let test = await bars.createBar(
//     "GazBar",
//     "The GazBar Sports Grill is a fresh, newly renovated sports bar and grill in Central Massachusetts. We offer everything your taste buds can handle and if you don’t see something you’d like….just ask and ourChef will personally create your meal. The GazBar offers a dining experience that Leominster has NEVER seen before.",
//     {
//       streetAddress: "1045 Central Street",
//       city: "Leominster",
//       state: "MA",
//       zipCode: "01453",
//     },
//     "978-332-0595",
//     "thegazbar@gazbar.com",
//     "www.gazBar.com",
//     "654438c26ec81bf9429dc36e",
//     ["Sport", "Grill", "Margaritas"]
//   );
//   console.log(test);
// } catch (e) {
//   console.log(e);
// }

// try {
//   let test = await bars.createBar(
//     "Mellos's Mexican",
//     "The GazBar Sports Grill is a fresh, newly renovated sports bar and grill in Central Massachusetts. We offer everything your taste buds can handle and if you don’t see something you’d like….just ask and ourChef will personally create your meal. The GazBar offers a dining experience that Leominster has NEVER seen before.",
//     {
//       streetAddress: "1045 Central Street",
//       city: "Leominster",
//       state: "MA",
//       zipCode: "01453",
//     },
//     "789-568-4596",
//     "thegazbar@gazbar.com",
//     "www.gazBar.com",
//     "654438c26ec81bf9429dc36e",
//     ["Sport", "Grill", "Margaritas"]
//   );
//   console.log(test);
// } catch (e) {
//   console.log(e);
// }

// let test;
// try {
//   test = await bars.createBar(
//     "Apple Bee's",
//     "The GazBar Sports Grill is a fresh, newly renovated sports bar and grill in Central Massachusetts. We offer everything your taste buds can handle and if you don’t see something you’d like….just ask and ourChef will personally create your meal. The GazBar offers a dining experience that Leominster has NEVER seen before.",
//     {
//       streetAddress: "1045 Central Street",
//       city: "Leominster",
//       state: "MA",
//       zipCode: "01453",
//     },
//     "789-563-5555",
//     "thegazbar@gazbar.com",
//     "www.gazBar.com",
//     "654438c26ec81bf9429dc36e",
//     ["Sport", "Grill", "Margaritas"]
//   );
//   console.log(test);
// } catch (e) {
//   console.log(e);
// }

/*
try {
  console.log(barss.barById("654696485139a59f569c79fd"));
} catch (e) {
  console.log(e);
}
*/

// try {
//   let review = await reviews.createReview(
//     "accountId",
//     test._id.toString(),
//     9,
//     "Good Bar"
//   );
//   console.log(review)
// } catch (e) {
//   console.log(e)
// }

// try {
//   let review = await reviews.createReview(
//     "accountId",
//     test._id.toString(),
//     1,
//     "Bad Bar"
//   );
//   console.log(review)
// } catch (e) {
//   console.log(e)
// }

// try {
//   let review = await reviews.updateReview(
//     "656ff3ee8240eaf34c0facad"
// ,   "accountId",
//     "656ff3ee8240eaf34c0facac",
//     1,
//     "IT WORKED"
//   );
//   console.log(review)
// } catch (e) {
//   console.log(e)
// }

// try {
//   let review = await reviews.get(
//     "656ff3ee8240eaf34c0facad"
//   );
//   console.log(review)
// } catch (e) {
//   console.log(e)
// }

// try {
//   let review = await reviews.getReviewsForBar(
//     "656ff3ee8240eaf34c0facac"
//   );
//   console.log(review)
// } catch (e) {
//   console.log(e)
// }

// try {
//   let review = await reviews.deleteReview(
//     "656ff534e1b14d78299459f6",
//     "656ff534e1b14d78299459f5"
//   );
//   console.log(review)
// } catch (e) {
//   console.log(e)
// }

await closeConnection();
