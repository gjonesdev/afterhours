import { ObjectId, Timestamp } from "mongodb";
import { bars } from "../config/mongoCollections.js";
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
		tags
	) {
		name = validation.validateRequiredStr(name);
		description = validation.validateRequiredStr(description);
		location = validation.validateLocation(location);
		email = validation.validateEmail(email);
		ownerId = validation.validateId(ownerId);
		website = validation.validateWebsite(website);
		phoneNumber = validation.validatePhone(phoneNumber);

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
			phone: phoneNumber,
			email: email,
			website: website,
			ownerId: ownerId,
			schedule: [],
			tags: validTags,
			reviews: [],
			reviewsCount: 0,
			ratings: [],
			ratingAverage: 0,
			likes: [],
			likesCount: 0,
			creationDate: new Date(),
			BODDate: "",
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
			.project({ _id: 1, name: 1, description: 1, location: 1 })
			.toArray();
		if (ownerBars.length === 0) throw "No bars found";
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
				likesCount: 1,
				schedule: 1,
				BODDate: 1,
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
	async barProfileUpdate(
		barId,
		name,
		description,
		location,
		email,
		website,
		phoneNumber
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
	//Add Likes
	async addBarLike(barId, userId) {
		barId = validation.validateId(barId);
		userId = validation.validateId(userId);
		const theBar = await this.barById(barId);

		let theLike = {
			user: userId,
			likeDate: new Date(),
		};
		const barCol = await bars();
		const addLike = await barCol.updateOne(
			{ _id: new ObjectId(barId) },
			{ $push: { likes: theLike } }
		);

		if (addLike.modifiedCount === 0) throw " Like could not be added!";
		const updatedbar = await this.barById(barId);

		const likesCount = updatedbar.likes.length;
		await barCol.updateOne(
			{ _id: new ObjectId(barId) },
			{ $set: { likesCount: likesCount } }
		);
		return await this.barById(barId);
	},
	async addEvent(
		barId,
		eventDate,
		eventName,
		description,
		startTime,
		endTime
	) {
		barId = validation.validateId(barId);
		eventDate = validation.validateDate(eventDate, startTime);
		eventName = validation.validateRequiredStr(eventName);
		description = validation.validateRequiredStr(description);
		startTime = validation.validateTime(startTime, "Start Time");
		endTime = validation.validateTime(endTime, "End Time");

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

		return await theSchedule;
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

export const getByTag = async () => {
	validation.validateId(oId);
	const barsCollection = await bars();
	const filterBars = await barsCollection.find({});
	if (ownerBars.length === 0) throw "No bars found";
	return ownerBars;
};
