import { ObjectId, Timestamp } from "mongodb";
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
    //Creating bar
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
      reviewsCount: 0,
      reviewsAverage: 0,
      likesCount: 0,
      creationDate: new Date(),
    };
    const barsCollection = await bars();
    const insertInfo = await barsCollection.insertOne(newBar);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add bar!";
    const newBarId = insertInfo.insertedId;

    const theBar = await barsCollection.findOne({ _id: newBarId });
    if (theBar === null) throw "No bar with that id";

    return theBar;
  },

  async barById(barId) {
    validation.validateId(barId);
    const barsCollection = await bars();
    const thebar = await barsCollection.findOne({ _id: new ObjectId(barId) });
    if (thebar === null) throw "No bar with that id";
    return thebar;
  },

  async allBars() {
    const barCollection = await bars();
    let allbars = await barCollection
      .find({})
      .project({
        _id: 1,
        name: 1,
        location: 1,
        tags: 1,
        reviewsAverage: 1,
        reviewsCount: 1,
        likesCount: 1,
      })
      .toArray();
    if (!allbars) throw "Was not able to get all bars!";
    allbars = allbars.map((element) => {
      return element;
    });
    return allbars;
  },
  async removeBar(barId) {
    validation.validateId(barId);
    const barCol = await bars();
    const barToDelete = await barCol.findOneAndDelete({
      _id: new ObjectId(barId),
    });
    if (!barToDelete) throw `Could not delete bar with id: ${barId}`;
    const deletedbar = {
      barName: barToDelete.name,
      deleted: true,
    };

    return deletedbar;
  },
};

export default exportedMethods;
