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
   let userId, reason, comment;
   let userIdInput = "12345YesID";
   let {/*userIdInput,*/ reasonInput, commentInput} = blogReportData;
   try {
     
     //UserId - Object Id:
     //userId = validation.validateId(userId);
     validation.validateReport(userIdInput, reasonInput, commentInput);
     //userIdInput = validation.validateUserId(userIdInput);
     reasonInput = validation.validateReason(reasonInput);
     commentInput = validation.validateComment(commentInput);

     /*userId = validation.validateUserId(userIdInput);
     reason = validation.validateReason(reasonInput);
     comment = validation.validateComment(commentInput);*/
   } catch (e) {
     return res.status(400).render("error", 
     { 
       class: "error", message: e.toString(), title: "Error: 400"
     });
   }
   //insert report 200
   try {
    //const {userIdInput, reasonInput, commentInput} = blogReportData;
    let {/*userIdInput,*/ reasonInput, commentInput} = blogReportData;
    const newReport = await reportsData.registerReport(userIdInput.trim(), reasonInput.trim(), commentInput.trim());
    
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

export default router;