import { reportsData } from "../data/index.js";
import { Router } from "express";
const router = Router();
import * as validation from "../helpers.js";

router.route("/").get(async (req, res) => {
        res.render("reports", {
                title: "Reports"
        });
    }).post(async (req, res) => {

   const blogReportData = req.body;
   //make sure there is something present in the req.body
   if (!blogReportData || Object.keys(blogReportData).length === 0) {
     return res
       .status(400)
       .json({error: 'There are no fields in the request body'});
   }
   //check all inputs, that should respond with a 400
   let userIdInput = "12345YesID";
   let {/*userIdInput,*/ reasonInput, commentInput} = blogReportData;
   try {
     //UserId - Object Id:
     //userId = validation.validateId(userId);
     validation.validateReport(userIdInput, reasonInput, commentInput);
     userIdInput = validation.validateUserId(userIdInput);
     reasonInput = validation.validateReason(reasonInput);
     commentInput = validation.validateComment(commentInput);

   } catch (e) {
     return res.status(400).render("error", 
     { 
       class: "error", message: e.toString(), title: "Error: 400"
     });
   }
   //insert report 200
   try {
    //Create a new report and inserted in the database
    const newReport = await reportsData.registerReport(userIdInput, reasonInput, commentInput);
    
    if(newReport.insertedReport === true){
      //res.redirect("login");
    }
    else{
      res.status(500).render("error", {class: "error", message: "Internal server error", title: "Error: 500"});
    }    
   } catch (e) {
     return res.status(500).render("error", 
     { 
        class: "error", message: "Internal server error", title: "Error: 500"
     });
   } 
});

router
  .route('/:userId')
  .get(async (req, res) => {
    //Error handler 404
    let id = "656ff7cc8bf60e3fd3988b4f";
    try {
      //bring the user id by the session************** 
      id = validation.validateUserIdObjectId(id);
    } catch (e) {
      return res.status(400).render("error", 
      { 
        class: "error", message: e.toString(), title: "Error: 400"
      });
    }
    //Check if the event id exist 404
    try{
      await validation.validateNoReportsFound(id);
    } catch (e) {
      return res.status(404).render("error", 
      { 
        class: "error", message: e.toString(), title: "Error: 404"
      });
    }
    //Find request 200
    try {
      const reportListData = await reportsData.getReportsByUserId(id);
      res.render('reportsByUserId', {title: "Reports", reportListData: reportListData});
    } catch (e) {
      return res.status(500).render("error", 
      { 
        class: "error", message: "Internal server error", title: "Error: 500"
      });
    }
});

export default router;
