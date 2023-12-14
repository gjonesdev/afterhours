import { reportsData } from "../data/index.js";
import { Router } from "express";
const router = Router();
import * as validation from "../helpers.js";
import { accountData, userData } from "../data/index.js";
import xss from "xss";

router.route("/").get(async (req, res) => {
		//cookie session
		const blogUserData = req.session.user;
		//make sure there is something present in the session
		if (!blogUserData || Object.keys(blogUserData).length === 0) {
			//'There are no fields in the request body'
			res.render("reports", {
                title: "Reports"
        	});
		}
		else{
			const account = await accountData.getAccount(req.session.user.accountId);
			const accountEmail = account.email;
			const user = await userData.getUser(account.userId);
			const firstName = user.firstName;
			const lastName = user.lastName;
			
			res.render("reports", {
					title: "Reports", firstNameInput: firstName, 
					lastNameInput: lastName, emailInput: accountEmail
					 
			});
		}
		
    }).post(async (req, res) => {

   const blogReportData = req.body;
   //make sure there is something present in the req.body
   if (!blogReportData || Object.keys(blogReportData).length === 0) {
     return res
       .status(400)
       .json({error: 'There are no fields in the request body'});
   }
   //check all inputs, that should respond with a 400
   let firstNameInput  = xss(req.body.firstNameInput);
   let emailInput  = xss(req.body.emailInput);
   let reasonInput  = xss(req.body.reasonInput);
   let commentInput  = xss(req.body.commentInput);

   try {
     validation.validateReport( firstNameInput, emailInput, reasonInput, commentInput);
	 firstNameInput = validation.validateReportName(firstNameInput);
	 emailInput = validation.validateReportEmail(emailInput);
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
	//cookie session
	const blogUserData = req.session.user;
	//make sure there is something present in the req.body
	if (!blogUserData || Object.keys(blogUserData).length === 0) {
		//'There are no fields in the session request'
		//Create a new report and inserted in the database
		const newReport = await reportsData.registerReport(null, firstNameInput, emailInput, reasonInput, commentInput);
		
		if(newReport.insertedReport !== true)
		res.status(500).render("error", {class: "error", message: "Internal server error", title: "Error: 500"});
		  
	}
	else{
		/**Get UserId from session*/
		const account = await accountData.getAccount(req.session.user.accountId);
		const accountUserId = account.userId;
		const accountEmail = account.email;
		const user = await userData.getUser(account.userId);
		const firstName = user.firstName;
		const lastName = user.lastName;

		//Create a new report and inserted in the database
		const newReport = await reportsData.registerReport(accountUserId, firstName + " " + lastName, accountEmail, reasonInput, commentInput);
		
		if(newReport.insertedReport === true){
			
		}
		
		else{
		res.status(500).render("error", {class: "error", message: "Internal server error", title: "Error: 500"});
		}  
	}  
   } catch (e) {
     return res.status(500).render("error", 
     { 
        class: "error", message: "Internal server error", title: "Error: 500"
     });
   } 
});

router
  .route('/myreports')
  .get(async (req, res) => {
    //Error handler 404
    try {
	  //cookie session
		const blogUserData = req.session.user;
		//make sure there is something present in the req.session
		if (!blogUserData || Object.keys(blogUserData).length === 0) {
			//'There are no fields in the session request'
			return res.redirect("/login");
		}
		else{
			const account = await accountData.getAccount(req.session.user.accountId);
			let id = account.userId;
			id = validation.validateUserIdObjectId(id);
		}
    } catch (e) {
      return res.status(400).render("error", 
      { 
        class: "error", message: e.toString(), title: "Error: 400"
      });
    }
    //Check if the event id exist 404
    try{
		const account = await accountData.getAccount(req.session.user.accountId);
		let id = account.userId;
      	await validation.validateNoReportsFound(id);
    } catch (e) {
      return res.status(404).render("error", 
      { 
        class: "error", message: e.toString(), title: "Error: 404"
      });
    }
    //Find request 200
    try {
	  const account = await accountData.getAccount(req.session.user.accountId);
	  let id = account.userId;
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