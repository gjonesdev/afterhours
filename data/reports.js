import { ObjectId, Timestamp } from "mongodb";
import { reports } from "../config/mongoCollections.js";
import * as validation from "../helpers.js";

/**Register a new report into the system */
export const registerReport = async (
    userId,
    name,
    email,
    reason,
    comment
  ) => {
    let successfulInserted = {insertedReport: false};
    //Error check:
    validation.validateReport(/*userId,*/ name, email, reason, comment);
    //userId = validation.validateUserId(userId);
    name = validation.validateReportName(name);
    email = validation.validateReportEmail(email);
    reason = validation.validateReason(reason);
    comment = validation.validateComment(comment);

    //Create a new object reports:
    let newReport = {
      userId: userId, // ObjectID
      name: name,
      email: email,
      reason: reason,
      comment: comment,
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
  userId
  ) => {
  //Error Check:
  userId = validation.validateUserIdObjectId(userId); 
  //Get the reports by userid 
  const reportsCollection = await reports();
  const userFind = await reportsCollection.find({userId: userId}).toArray();
  if (userFind.length <= 0) throw 'No reports found.';
  //Sort the report by descending order
  userFind.sort((a, b) => b.date - a.date);

  return userFind;
};

/**Get all reports by User Email*/
export const getReportsByUserEmail = async (
  email
  ) => {
  //Error Check:
  email = validation.validateReportEmail(email); 
  //Get the reports by email 
  const reportsCollection = await reports();
  const reportsFound = await reportsCollection.find({email: email}).toArray();
  if (reportsFound.length <= 0) throw 'No reports found.';
  //Sort the report by descending order
  reportsFound.sort((a, b) => b.date - a.date);

  return reportsFound;
};