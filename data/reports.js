import { ObjectId, Timestamp } from "mongodb";
import { reports } from "../config/mongoCollections.js";
import * as validation from "../helpers.js";

/**Register a new report into the system */
export const registerReport = async (
    userId,
    reason,
    comment
  ) => {
    let successfulInserted = {insertedReport: false};
    //UserId - Object Id:
    //userId = validation.validateId(userId);

    //Error check:
    validation.validateReport(userId, reason, comment);
    userId = validation.validateUserId(userId);
    reason = validation.validateReason(reason);
    comment = validation.validateComment(comment);

    //Create a new object reports:
    let newReport = {
      userId: userId.trim(), // ObjectID
      reason: reason.trim(),
      comment: comment.trim(),
      date: new Date()
    };
  
    const reportsCollection = await reports();
    const insertReport = await reportsCollection.insertOne(newReport);
  
    if(!insertReport.acknowledged || !insertReport.insertedId) throw "Could not add user";
    successfulInserted = {insertedReport: true};
    return successfulInserted;
};

/**Get all reports from all users */
export const getAllReports = async (
  ) => {


};

/**Get all reports by User ID */
export const getReportsByUserId = async (
  ) => {
  
  
};