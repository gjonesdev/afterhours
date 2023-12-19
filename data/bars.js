import { ObjectId, Timestamp } from "mongodb";
import { bars, reviews } from "../config/mongoCollections.js";
import * as validation from "../helpers.js";
import date from "date-and-time";

let exportedMethods = {
  //Create bar
  async createBar(
    name,
    description,
    location,
    phoneNumber,
    email,
    website,
    ownerId,
    tags,
    images
  ) {
    name = validation.validateRequiredStr(name);
    description = validation.validateRequiredStr(description);
    location = validation.validateLocation(location);
    email = validation.validateEmail(email);
    ownerId = validation.validateId(ownerId);
    if (website.length > 0) {
      website = validation.validateWebsite(website);
    }
    phoneNumber = validation.validatePhone(phoneNumber);
    let validTags = [];
    if (tags.length > 0) {
      if (!Array.isArray(tags)) {
        tags = tags.split(",");
      }
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
      phone: phoneNumber,
      email: email,
      website: website,
      ownerId: ownerId,
      schedule: [],
      tags: validTags,
      reviews: [],
      reviewsCount: 0,
      ratingAverage: 0,
      favoritesCount: 0,
      creationDate: new Date(),
      BODDate: "",
      images,
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
  // Bar by id
  async barById(barId) {
    validation.validateId(barId);
    const barsCollection = await bars();
    const thebar = await barsCollection.findOne({
      _id: new ObjectId(barId),
    });
    if (thebar === null) throw "No bar with that id";
    return thebar;
  },
  // Bar by owner
  async barByOwner(oId) {
    validation.validateId(oId);
    const barsCollection = await bars();
    const ownerBars = await barsCollection
      .find({ ownerId: oId })
      .project({
        _id: 1,
        name: 1,
        description: 1,
        location: 1,
        favoritesCount: 1,
        ratingAverage: 1,
        reviewsCount: 1,
        images: 1,
      })
      .toArray();
    return ownerBars;
  },
  // All of the bars
  async allBars() {
    const barCollection = await bars();
    let allbars = await barCollection
      .find({})
      .project({
        _id: 1,
        name: 1,
        description: 1,
        location: 1,
        tags: 1,
        ratingAverage: 1,
        reviewsCount: 1,
        favoritesCount: 1,
        schedule: 1,
        BODDate: 1,
        images: 1,
      })
      .toArray();
    if (!allbars) throw "Was not able to get all bars!";
    allbars = allbars.map((element) => {
      return element;
    });
    return allbars;
  },

  async barSearch(searchName) {
    if (!searchName) throw "Input must be provided!";
    if (typeof searchName !== "string") throw "Input must be a valid string!";
    searchName = searchName.trim();
    if (searchName.length === 0) throw "Input is an empty string!";

    searchName = searchName.toLowerCase();
    let multiWorlds = searchName.split(" ");
    const allBars = await this.allBars();
    let barsFound = new Set();

    let tempTags = [];

    multiWorlds.forEach((word) => {
      allBars.forEach((bar) => {
        const tags = bar.tags;
        tags.forEach((tag) => {
          tempTags.push(tag.toLowerCase());
        });
        const barName = bar.name.toLowerCase();
        const barDescription = bar.description.toLowerCase();

        if (
          barName.includes(word) ||
          barDescription.includes(word) ||
          tempTags.includes(word)
        ) {
          barsFound.add(bar);
        }
      });
    });

    if (barsFound.size === 0)
      throw `0 bars found with the name "${searchName}" or a description containing "${searchName}"`;

    const array = Array.from(barsFound);

    return array;
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

    //delete review associated with bar

    if (barToDelete.reviews.length !== 0) {
      const reviewCollection = await reviews();
      const deleteReviews = await reviewCollection.deleteMany({
        barId: barId,
      });
      if (!deleteReviews) {
        throw "Could not delete reviews associated with bar";
      }
    }

    return deletedbar;
  },
  async barProfileUpdate(
    barId,
    name,
    description,
    location,
    email,
    website,
    phoneNumber,
    images
  ) {
    name = validation.validateRequiredStr(name);
    description = validation.validateRequiredStr(description);
    location = validation.validateLocation(location);
    email = validation.validateEmail(email);
    barId = validation.validateId(barId);
    website = validation.validateWebsite(website);
    phoneNumber = validation.validatePhone(phoneNumber);

    let toUpdate = {
      name: name,
      description: description,
      location: location,
      email: email,
      website: website,
      phone: phoneNumber,
      lastModified: new Date(),
      images: images,
    };
    const barCol = await bars();
    const updatedData = await barCol.findOneAndUpdate(
      { _id: new ObjectId(barId) },
      { $set: toUpdate },
      { returnDocument: "after" }
    );

    if (!updatedData) {
      throw "Could not update event successfully";
    }
    return updatedData;
  },

  async addEvent(barId, eventDate, eventName, description, startTime, endTime) {
    barId = validation.validateId(barId);
    eventDate = validation.validateDate(eventDate, startTime);
    eventName = validation.validateRequiredStr(eventName);
    description = validation.validateRequiredStr(description);
    startTime = validation.validateTime(startTime, "Start Time");
    endTime = validation.validateTime(endTime, "End Time");

    //Making sure end time is greater than start time
    let sTimeObj = date.parse(startTime, "hh:mm A");
    let eTimeObj = date.parse(endTime.toUpperCase(), "hh:mm A");
    const minEndTime = date.addMinutes(sTimeObj, 30);
    if (sTimeObj >= eTimeObj || minEndTime > eTimeObj)
      throw "Start time can't be later than end time or end time has to be 30 minutes greater than start time! ";

    const aEvent = {
      _id: new ObjectId(),
      date: eventDate,
      eventName: eventName,
      description: description,
      startTime: startTime,
      endTime: endTime,
    };

    const barCol = await bars();
    const addEvent = await barCol.updateOne(
      { _id: new ObjectId(barId) },
      { $push: { schedule: aEvent } }
    );

    if (addEvent.modifiedCount === 0) throw " Event could not be added!";

    const theSchedule = await barCol.findOne(
      {
        "schedule._id": aEvent._id,
      },
      { projection: { _id: 0, "schedule.$": 1 } }
    );

    return aEvent._id;
  },

  async deleteEvent(eventId, barId) {
    validation.validateId(eventId);
    validation.validateId(barId);
    const barCol = await bars();
    const theEvent = await barCol.updateOne(
      { _id: new ObjectId(barId) },
      { $pull: { schedule: { _id: new ObjectId(eventId) } } }
    );
    if (theEvent.modifiedCount === 0) throw "Event could not be removed!";

    return theEvent;
  },
  async eventById(eventId) {
    validation.validateId(eventId);
    const barsCol = await bars();
    const theEvent = await barsCol.findOne(
      {
        "schedule._id": new ObjectId(eventId),
      },
      { projection: { _id: 0, "schedule.$": 1 } }
    );
    if (theEvent === null) throw "Event not found!";
    const tDate = date.transform(
      theEvent.schedule[0].date,
      "MM/DD/YYYY",
      "YYYY-MM-DD"
    );

    const sTime = date.transform(
      theEvent.schedule[0].startTime,
      "hh:mm A",
      "HH:mm"
    );

    const eTime = date.transform(
      theEvent.schedule[0].endTime,
      "hh:mm A",
      "HH:mm"
    );
    const updatedEvent = {
      _id: theEvent.schedule[0]._id,
      date: tDate,
      eventName: theEvent.schedule[0].eventName,
      description: theEvent.schedule[0].description,
      startTime: sTime,
      endTime: eTime,
    };

    return updatedEvent;
  },

  async updateEvent(
    barId,
    eventId,
    date,
    eventName,
    eventDesc,
    startTime,
    endTime
  ) {
    barId = validation.validateId(barId);
    eventId = validation.validateId(eventId);
    date = validation.validateDate(date);
    eventName = validation.validateRequiredStr(eventName);
    eventDesc = validation.validateRequiredStr(eventDesc);
    startTime = validation.validateTime(startTime, "Start Time");
    endTime = validation.validateTime(endTime, "End Time");
    const addedEvent = await this.addEvent(
      barId,
      date,
      eventName,
      eventDesc,
      startTime,
      endTime
    );
    const deletedEvent = await this.deleteEvent(eventId, barId);
    return;
  },

  async makeBOD(barId) {
    barId = validation.validateId(barId);

    const now = new Date();
    const BODDate = date.format(now, "MM/DD/YYYY");
    const barCol = await bars();
    const makeItBOD = await barCol.updateOne(
      { _id: new ObjectId(barId) },
      { $set: { BODDate: BODDate } }
    );

    const theBar = await barCol.findOne({ _id: new ObjectId(barId) });
    if (theBar === null) throw "No bar with that id";

    return theBar;
  },
};

export default exportedMethods;
