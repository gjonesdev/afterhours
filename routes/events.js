import { reviewData, accountData, barData } from "../data/index.js";
import { Router } from "express";
const router = Router();
import * as validation from "../helpers.js";
import filtersHelp from "../filterhelper.js";
import xss from "xss";

//Edit Event
router.route("/editEvent").post(async (req, res) => {
  const barId = xss(req.body.editEventBarIdInput);
  const eventId = xss(req.body.editEventIdInput);
  try {
    const eventById = await barData.eventById(eventId);

    const eventToEdit = {
      eventIdInput: eventById._id,
      eventDateInput: eventById.date,
      eventNameInput: eventById.eventName,
      eventDescInput: eventById.description,
      startTimeInput: eventById.startTime,
      endTimeInput: eventById.endTime,
    };
    res.render("editEvent", { barId: barId, eventInfo: eventToEdit });
  } catch (e) {}
});
// Update event
router.route("/updateEvent").post(async (req, res) => {
  const eventInfo = req.body;
  const errors = new Set();
  if (!eventInfo) {
    errors.add("All field must be completed!");
  }

  let barId = xss(eventInfo.barIdInput);
  let eventId = xss(eventInfo.eventIdInput);
  let date = xss(eventInfo.eventDateInput);
  let eventName = xss(eventInfo.eventNameInput);
  let eventDesc = xss(eventInfo.eventDescInput);
  let startTime = xss(eventInfo.startTimeInput);
  let endTime = xss(eventInfo.endTimeInput);

  try {
    barId = validation.validateId(barId);
  } catch (e) {
    errors.add(e);
  }
  try {
    eventId = validation.validateId(eventId);
  } catch (e) {
    errors.add(e);
  }
  try {
    startTime = validation.validateTime(startTime, "Start Time");
  } catch (e) {
    errors.add(e);
  }
  try {
    date = validation.validateDate(date, startTime);
  } catch (e) {
    errors.add(e);
  }
  try {
    eventName = validation.validateRequiredStr(eventName);
  } catch (e) {
    errors.add(e);
  }
  try {
    eventDesc = validation.validateRequiredStr(eventDesc);
  } catch (e) {
    errors.add(e);
  }

  try {
    endTime = validation.validateTime(endTime, "End Time");
  } catch (e) {
    errors.add(e);
  }
  try {
    await barData.updateEvent(
      barId,
      eventId,
      date,
      eventName,
      eventDesc,
      startTime,
      endTime
    );
    filtersHelp.barDistanceHelper(true);
    res.redirect("/bars/" + barId);
  } catch (e) {
    errors.add(e);
  }

  if (errors.size > 0) {
    res.status(400).render("addEvent", {
      errors: errors,
      hasErrors: true,
      title: "Event",
      eventInfo: eventInfo,
      barId: barId,
    });
  }
});
//Delete Event
router.route("/deleteEvent").post(async (req, res) => {
  let eventId = xss(req.body.deleteEvenIdtInput);
  let barId = xss(req.body.deleteEventBarIdInput);
  //TODO: validate
  try {
    eventId = validation.validateId(eventId);
    barId = validation.validateId(barId);
  } catch (e) {
    return res.render(400).json({ error: e });
  }

  try {
    const theBar = await barData.barById(barId);
    let isOwner = false;
    if (req.session.user) {
      isOwner = theBar.ownerId === req.session.user.accountId;
    } else {
      return res.render("error", {
        error: { status: 403, message: "Prohibirted area" },
        message: "This function is only for bar owners!",
      });
    }
    if (isOwner) {
      await barData.deleteEvent(eventId, barId);
      filtersHelp.barDistanceHelper(true);
    } else {
      return res.render("error", {
        error: { status: 403, message: "Prohibirted area" },
        message: "This function is only for bar owners!",
      });
    }
    res.redirect("/bars/" + theBar._id);
  } catch (e) {
    //TODO: velidate
    return res.render(500).json({ error: e });
  }
});
//Create event
router.route("/addEvent").post(async (req, res) => {
  const bar = xss(req.body.addEventInput);
  res.render("addEvent", { barId: bar });
});
router.route("/createEvent").post(async (req, res) => {
  const eventInfo = req.body;
  const errors = new Set();
  if (!eventInfo) {
    errors.add("All field must be completed!");
  }

  let barId = xss(eventInfo.barIdInput);
  let date = xss(eventInfo.eventDateInput);
  let eventName = xss(eventInfo.eventNameInput);
  let eventDesc = xss(eventInfo.eventDescInput);
  let startTime = xss(eventInfo.startTimeInput);
  let endTime = xss(eventInfo.endTimeInput);

  try {
    barId = validation.validateId(barId);
  } catch (e) {
    errors.add(e);
  }
  try {
    startTime = validation.validateTime(startTime, "Start Time");
  } catch (e) {
    errors.add(e);
  }
  try {
    date = validation.validateDate(date, startTime);
  } catch (e) {
    errors.add(e);
  }
  try {
    eventName = validation.validateRequiredStr(eventName);
  } catch (e) {
    errors.add(e);
  }
  try {
    eventDesc = validation.validateRequiredStr(eventDesc);
  } catch (e) {
    errors.add(e);
  }

  try {
    endTime = validation.validateTime(endTime, "End Time");
  } catch (e) {
    errors.add(e);
  }
  try {
    await barData.addEvent(
      barId,
      date,
      eventName,
      eventDesc,
      startTime,
      endTime
    );
    filtersHelp.barDistanceHelper(true);
    res.redirect("/bars/" + barId);
  } catch (e) {
    errors.add(e);
  }

  if (errors.size > 0) {
    res.status(400).render("addEvent", {
      errors: errors,
      hasErrors: true,
      title: "Event",
      eventInfo: eventInfo,
      barId: barId,
    });
  }
});
//Delete Event
router.route("/deleteEvent").post(async (req, res) => {
  let eventId = xss(req.body.deleteEvenIdtInput);
  let barId = xss(req.body.deleteEventBarIdInput);
  //TODO: validate
  try {
    eventId = validation.validateId(eventId);
    barId = validation.validateId(barId);
  } catch (e) {
    return res.render(400).json({ error: e });
  }

  try {
    const theBar = await barData.barById(barId);
    let isOwner = false;
    if (req.session.user) {
      isOwner = theBar.ownerId === req.session.user.accountId;
    } else {
      return res.render("error", {
        error: { status: 403, message: "Prohibirted area" },
        message: "This function is only for bar owners!",
      });
    }
    if (isOwner) {
      await barData.deleteEvent(eventId, barId);
      filtersHelp.barDistanceHelper(true);
    } else {
      return res.render("error", {
        error: { status: 403, message: "Prohibirted area" },
        message: "This function is only for bar owners!",
      });
    }
    res.redirect("/bars/" + theBar._id);
  } catch (e) {
    //TODO: velidate
    return res.render(500).json({ error: e });
  }
});

export default router;
