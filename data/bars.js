import { bars } from "../config/mongoCollections.js";
import * as validation from "../helpers.js";

let exportedMethods = {
  async createBar(name, description, location, email, website, ownerId, tags) {
    name = validation.validateRequiredStr(name);
    description = validation.validateRequiredStr(description);
    location = validation.validateLocation(location);
    email = validation.validateEmail(email);
    ownerId = validation.validateId(ownerId);
    website = validation.validateWebsite(website);

    let validTags = [];
    if (tags.length > 0) {
      tags.forEach((element) => {
        element = validation.validateOptionalStr(element);
        if (element.length > 0) {
          validTags.push(element);
        }
      });
    }
    //Creating event
    let newBar = {
      name: name,
      description: description,
      location: location,
      email: email,
      webesite: website,
      ownerId: ownerId,
      schedule: [],
      tags: validTags,
      reviews: [],
      likesCount: 0,
    };
    const barsCollection = await bars();
    const insertInfo = await barsCollection.insertOne(newBar);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add bar!";
    const newBarId = insertInfo.insertedId;

    const theBar = await barsCollection.findOne({ _id: newBarId });
    if (theBar === null) throw "No event with that id";

    return theBar;
  },
};
export default exportedMethods;
