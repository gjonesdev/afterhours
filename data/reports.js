import { ObjectId, Timestamp } from "mongodb";
import { reports } from "../config/mongoCollections.js";
import * as validation from "../helpers.js";

export const registerReport = async (
    userId,
    reason,
    comment
  ) => {
    let successfulInserted = {insertedReport: false};
    //Error check:
    if(!userId || !reason || !comment) 
      throw "All fields need to have valid values.";
  
    //Change userID = string by userID = ObjectID
    if(typeof userId !== "string" || userId.trim().length === 0 ||
       typeof reason !== "string" || reason.trim().length === 0 ||
       typeof comment !== "string" || comment.trim().length === 0)
      throw "Invalid string or strings with only spaces are not valid.";
  
    //UserId - Object Id:
    //userId = validation.validateId(userId);

    //User Id:
    if(userId.trim().length === 0) throw 'Empty string or just spaces not allowed for user Id.';
    userId = userId.trim();
    //"User Id should not contain space in the middle.
    let userIdRegex = /[\s]+/g;
    let regexValue = userIdRegex.exec(userId);
    if(regexValue !== null){
        if(regexValue.length >= 1) throw "Not space allowed for user Id";
    }
    //userId should not contain numbers
    if(!isNaN(userId)) throw'User Id should not contain numbers';
    if(userId.trim().length < 2 || userId.trim().length > 50) throw "User Id should be at least 2 characters long and a max of 50 characters.";

    //Reason:
    if(reason.trim().length === 0) throw 'Empty string or just spaces not allowed for reason.';
    reason = reason.trim();
    //Reason should not contain numbers
    if(!isNaN(reason)) throw 'Reason should not contain numbers';
    let notNumbersRegex = /^[a-zA-Z ]*$/;
    if(notNumbersRegex.exec(reason) === null) throw 'Reason should not contain numbers and not symbols';
    if(reason.trim().length < 2 || reason.trim().length > 50) throw "Reason should be at least 2 characters long and a max of 50 characters.";
  
    //Comment or Message:
    if(comment.trim().length === 0) throw 'Empty string or just spaces not allowed for comment or message.';
    comment = comment.trim();
    //Comment or message should not contain numbers
    if(!isNaN(comment)) throw 'Comment or message should not contain only numbers';
    if(comment.trim().length < 2 || comment.trim().length > 500) throw "Comment or message should be at least 2 characters long and a max of 500 characters.";
  
    //Create a new object reports:
    let newReport = {
      userId: userId.trim(), // ObjectID
      reason: reason.trim(),
      comment: comment.trim()
    };
  
    const reportsCollection = await reports();
    const insertReport = await reportsCollection.insertOne(newReport);
  
    if(!insertReport.acknowledged || !insertReport.insertedId) throw "Could not add user";
    successfulInserted = {insertedReport: true};
    return successfulInserted;
  };