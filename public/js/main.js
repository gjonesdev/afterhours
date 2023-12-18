function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const title = document.querySelector("title");
title.textContent = capitalize(title.textContent);

//Report Form
(function () {
  //reports-form
  let reportFormDocument = document.getElementById("reports-form");
  if (reportFormDocument) reportForm();
})();

/**reports-form */
function reportForm() {
  let reportFormDocument = document.getElementById("reports-form");
  let firstNameInput = document.getElementById("firstNameInput");
  let emailInput = document.getElementById("emailInput");
  let reasonInput = document.getElementById("reasonInput");
  let commentInput = document.getElementById("commentInput");
  let errorDiv = document.getElementById("error");

	if (reportFormDocument) {
		reportFormDocument.addEventListener("submit", (event) => {
			//Validate Name:
			if (firstNameInput.value.trim()) {
				firstNameInput.value = firstNameInput.value.trim();
				errorDiv.hidden = true;

        //Error check:
        if (!firstNameInput.value) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML = "Name needs to have valid values.";
          firstNameInput.focus();
          event.preventDefault();
          return;
        }

        if (
          typeof firstNameInput.value !== "string" ||
          firstNameInput.value.trim().length === 0
        ) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML =
            "Name should be a valid string (no empty spaces, should not contain numbers).";
          firstNameInput.focus();
          event.preventDefault();
          return;
        }

        //Name should not contain numbers
        if (!isNaN(firstNameInput.value)) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML = "Name should not contain numbers";
          firstNameInput.focus();
          event.preventDefault();
          return;
        }

        let notNumbersRegex = /^[a-zA-Z ]*$/;
        if (notNumbersRegex.exec(firstNameInput.value) === null) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML = "Name should not contain numbers, just letters";
          firstNameInput.focus();
          event.preventDefault();
          return;
        }

        if (
          firstNameInput.value.trim().length < 2 ||
          firstNameInput.value.trim().length > 30
        ) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML =
            "Name should be at least 2 characters long and a max of 30 characters.";
          firstNameInput.focus();
          event.preventDefault();
          return;
        }
      } else {
        errorDiv.hidden = false;
        errorDiv.className = "error";
        errorDiv.innerHTML = "Name needs to have valid values.";
        firstNameInput.focus();
        event.preventDefault();
        return;
      }

      /**Validate Email:*/
      if (emailInput.value.trim()) {
        emailInput.value = emailInput.value.trim();
        emailInput.value = emailInput.value.toLowerCase();
        errorDiv.hidden = true;

        //Error check:
        if (!emailInput.value) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML = "Email needs to have valid values.";
          emailInput.focus();
          event.preventDefault();
          return;
        }

        if (
          typeof emailInput.value !== "string" ||
          emailInput.value.trim().length === 0
        ) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML =
            "Email should be a valid string (no empty spaces).";
          emailInput.focus();
          event.preventDefault();
          return;
        }

        if (
          emailInput.value.trim().length < 2 ||
          emailInput.value.trim().length > 80
        ) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML =
            "Email should be at least 2 characters long and a max of 80 characters.";
          emailInput.focus();
          event.preventDefault();
          return;
        }

        //Email format, look for regex syntax
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        emailInput.value = emailInput.value.trim();
        emailInput.value = emailInput.value.toString().toLowerCase();
        if (emailRegex.exec(emailInput.value) === null) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML =
            "Email Address should be a valid email address format: example@example.com.";
          emailInput.focus();
          event.preventDefault();
          return;
        }
      } else {
        errorDiv.hidden = false;
        errorDiv.className = "error";
        errorDiv.innerHTML = "You must enter a valid value.";
        emailInput.focus();
        event.preventDefault();
        return;
      }

      //Validate Reason:
      if (reasonInput.value.trim()) {
        reasonInput.value = reasonInput.value.trim();
        errorDiv.hidden = true;

        //Error check:
        if (!reasonInput.value) {
          reasonInput.selectedIndex = 0;
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML = "Reason needs to have valid values.";
          reasonInput.focus();
          event.preventDefault();
          return;
        }

        if (
          typeof reasonInput.value !== "string" ||
          reasonInput.value.trim().length === 0
        ) {
          reasonInput.selectedIndex = 0;
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML =
            "Reason should be a valid string (no empty spaces, should not contain numbers).";
          reasonInput.focus();
          event.preventDefault();
          return;
        }

        //Reason should not contain numbers
        if (!isNaN(reasonInput.value)) {
          reasonInput.selectedIndex = 0;
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML = "Reason should not contain numbers";
          reasonInput.focus();
          event.preventDefault();
          return;
        }

        let notNumbersRegex = /^[a-zA-Z ]*$/;
        if (notNumbersRegex.exec(reasonInput.value) === null) {
          reasonInput.selectedIndex = 0;
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML = "Reason should not contain numbers";
          reasonInput.focus();
          event.preventDefault();
          return;
        }

        if (
          reasonInput.value.trim().length < 2 ||
          reasonInput.value.trim().length > 50
        ) {
          reasonInput.selectedIndex = 0;
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML =
            "Reason should be at least 2 characters long and a max of 50 characters.";
          reasonInput.focus();
          event.preventDefault();
          return;
        }
      } else {
        reasonInput.selectedIndex = 0;
        errorDiv.hidden = false;
        errorDiv.className = "error";
        errorDiv.innerHTML = "Reason needs to have valid values.";
        reasonInput.focus();
        event.preventDefault();
        return;
      }

      //Validate Comment:
      if (commentInput.value.trim()) {
        commentInput.value = commentInput.value.trim();
        errorDiv.hidden = true;

        //Error check:
        if (!commentInput.value) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML = "Comment needs to have valid values.";
          commentInput.focus();
          event.preventDefault();
          return;
        }

        if (
          typeof commentInput.value !== "string" ||
          commentInput.value.trim().length === 0
        ) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML =
            "Comment should be a valid string (no empty spaces, should not contain numbers).";
          commentInput.focus();
          event.preventDefault();
          return;
        }

        //Comment should not contain only numbers
        if (!isNaN(commentInput.value)) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML = "Comment should not contain only numbers";
          commentInput.focus();
          event.preventDefault();
          return;
        }

        if (
          commentInput.value.trim().length < 2 ||
          commentInput.value.trim().length > 500
        ) {
          errorDiv.hidden = false;
          errorDiv.className = "error";
          errorDiv.innerHTML =
            "Comment should be at least 2 characters long and a max of 500 characters.";
          commentInput.focus();
          event.preventDefault();
          return;
        }
      } else {
        errorDiv.hidden = false;
        errorDiv.className = "error";
        errorDiv.innerHTML =
          "Your comment can not be empty and needs to have valid values.";
        commentInput.focus();
        event.preventDefault();
        return;
      }

      //Message Sent
      alert(
        "Message sent ✅ - A team VIP (Very Important Person) will jazz up your inbox in 2-3 days. Until then, enjoy the happy hour vibes! 🥂🌟 You will now be routed to the party on the flip side!"
      );
      //wait .5 second to go back to the previous page
      setTimeout("history.go(-1)", 500);
    });
  }
}

// Registration/Login Form
const registrationForm = document.getElementById("registration-form");
const loginForm = document.getElementById("login-form");
const accountForm = document.getElementById("account-form");
const userForm = document.getElementById("user-form");
const errorList = document.getElementById("error-list");
const userErrorList = document.getElementById("user-error-list");
const accountErrorList = document.getElementById("account-error-list");
let errors = [];

const validateName = (type, nameInput) => {
  nameInput.classList.remove("invalid-input");
  if (
    nameInput.value === undefined ||
    nameInput.value === null ||
    nameInput.value === ""
  ) {
    errors.push(`${type} name required.`);
    nameInput.classList.add("invalid-input");
    return;
  }

  if (typeof nameInput.value !== "string") {
    errors.push(`${type} name must be of type string.`);
    nameInput.classList.add("invalid-input");
    return;
  }

  nameInput.value = nameInput.value.trim();

  if (
    !/^[a-zA-Z]+(?:['-][a-zA-Z']+)*$/.test(nameInput.value) ||
    nameInput.value.length < 2 ||
    nameInput.value.length > 25
  ) {
    errors.push(
      `${type} name must be between 2 and 25 characters and can contain only alphabetic characters, hyphens, or apostrophes.`
    );
    nameInput.classList.add("invalid-input");
  }
};

const validateEmail = (emailInput) => {
  emailInput.classList.remove("invalid-input");
  if (
    emailInput.value === undefined ||
    emailInput.value === null ||
    emailInput.value === ""
  ) {
    errors.push(`Email address required.`);
    emailInput.classList.add("invalid-input");
    return;
  }

  if (typeof emailInput.value !== "string") {
    errors.push(`Email address must be of type string.`);
    emailInput.classList.add("invalid-input");
    return;
  }

  emailInput.value = emailInput.value.trim();

  if (
    !/^[^\W_]+([._-][^\W_]+)*@[^\W_]{1,}(\.[^\W_]{2,})(\.[^\W_]{2,})?/.test(
      emailInput.value
    )
  ) {
    errors.push("Email address must be in valid email address format.");
    emailInput.classList.add("invalid-input");
  }
};

const validatePassword = (passwordInput) => {
  passwordInput.classList.remove("invalid-input");
  if (
    passwordInput.value === undefined ||
    passwordInput.value === null ||
    passwordInput.value === ""
  ) {
    errors.push(`Password required.`);
    passwordInput.classList.add("invalid-input");
    return;
  }

  if (typeof passwordInput.value !== "string") {
    errors.push(`Password must be of type string.`);
    passwordInput.classList.add("invalid-input");
    return;
  }

  passwordInput.value = passwordInput.value.trim();

  if (/\s/.test(passwordInput.value)) {
    throw "Password cannot contain spaces.";
  }

  if (!/(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,}/.test(passwordInput.value)) {
    errors.push(
      "Password must be at least 8 characters and contain at least one uppercase character, one number, and one special character."
    );
    passwordInput.classList.add("invalid-input");
  }
};

const validateAccountType = (accountTypeInput) => {
  accountTypeInput.classList.remove("invalid-input");
  if (
    accountTypeInput.value === undefined ||
    accountTypeInput.value === null ||
    accountTypeInput.value === ""
  ) {
    errors.push(`AccountType required.`);
    accountTypeInput.classList.add("invalid-input");
    return;
  }

  if (typeof accountTypeInput.value !== "string") {
    errors.push(`AccountType must be of type string.`);
    accountTypeInput.classList.add("invalid-input");
    return;
  }
  accountTypeInput.value = accountTypeInput.value.trim();
  if (
    !(accountTypeInput.value === "patron" || accountTypeInput.value === "owner")
  ) {
    errors.push("AccountType must either be admin or user.");
    accountTypeInput.classList.add("invalid-input");
  }
};

const validatePhone = (phone) => {
  phone.classList.remove("invalid-input");
  if (phone.value === undefined || phone.value === null || phone.value === "") {
    errors.push(`Phone number required.`);
    phone.classList.add("invalid-input");
    return;
  }

  if (typeof phone.value !== "string") {
    errors.push(`Phone number must be of type string.`);
    phone.classList.add("invalid-input");
    return;
  }
  phone.value = phone.value.trim();

  if (!/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(phone.value)) {
    errors.push("Phone number must be valid.");
    password.classList.add("invalid-input");
  }

  return phone.value.replace(/\D/g, "");
};

if (registrationForm) {
  const firstNameInput = document.getElementById("firstNameInput");
  const lastNameInput = document.getElementById("lastNameInput");
  const phoneInput = document.getElementById("phoneInput");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const confirmPasswordInput = document.getElementById("confirmPasswordInput");
  const accountTypeInput = document.getElementById("accountTypeInput");

  registrationForm.addEventListener("submit", (event) => {
    errors = [];
    errorList.innerHTML = "";
    errorList.classList.add("hide");

    validateName("First", firstNameInput);
    validateName("Last", lastNameInput);
    validatePhone(phoneInput);
    validateEmail(emailInput);
    validatePassword(passwordInput);
    validateAccountType(accountTypeInput);

    if (passwordInput.value !== confirmPasswordInput.value.trim()) {
      errors.push("Passwords do not match.");
    }

    if (errors.length >= 1) {
      event.preventDefault();
      errors.forEach((error) => {
        const li = document.createElement("li");
        li.innerHTML = error;
        errorList.appendChild(li);
      });
      errorList.classList.remove("hide");
    }
  });
}

if (loginForm) {
  const emailInput = document.getElementById("emailInput");

  loginForm.addEventListener("submit", (event) => {
    errors = [];
    errorList.innerHTML = "";
    errorList.classList.add("hide");

    validateEmail(emailInput);
    passwordInput.value = passwordInput.value.trim();

    if (errors.length >= 1) {
      event.preventDefault();
      errors.forEach((error) => {
        const li = document.createElement("li");
        li.innerHTML = error;
        errorList.appendChild(li);
      });
      errorList.classList.remove("hide");
    }
  });
}

if (userForm) {
  const firstNameInput = document.getElementById("firstNameInput");
  const lastNameInput = document.getElementById("lastNameInput");
  const phoneInput = document.getElementById("phoneInput");

  userForm.addEventListener("submit", (event) => {
    errors = [];
    userErrorList.innerHTML = "";
    userErrorList.classList.add("hide");

    validateName("First", firstNameInput);
    validateName("Last", lastNameInput);
    validatePhone(phoneInput);

    if (errors.length >= 1) {
      event.preventDefault();
      errors.forEach((error) => {
        const li = document.createElement("li");
        li.innerHTML = error;
        userErrorList.appendChild(li);
      });
      userErrorList.classList.remove("hide");
    }
  });
}

if (accountForm) {
  const emailInput = document.getElementById("emailInput");
  const newPasswordInput = document.getElementById("newPasswordInput");
  const confirmPasswordInput = document.getElementById("confirmPasswordInput");
  const currentPasswordInput = document.getElementById("currentPasswordInput");

  accountForm.addEventListener("submit", (event) => {
    errors = [];
    accountErrorList.innerHTML = "";
    accountErrorList.classList.add("hide");

    validateEmail(emailInput);
    if (newPasswordInput.value) {
      validatePassword(newPasswordInput);
      confirmPasswordInput.value = confirmPasswordInput.value.trim();
      currentPasswordInput.value = currentPasswordInput.value.trim();

      if (newPasswordInput.value !== confirmPasswordInput.value) {
        errors.push("Passwords do not match.");
      }
    }

    if (errors.length >= 1) {
      event.preventDefault();
      errors.forEach((error) => {
        const li = document.createElement("li");
        li.innerHTML = error;
        accountErrorList.appendChild(li);
      });
      accountErrorList.classList.remove("hide");
    }
  });
}

//WriteReviewForm
(function () {
  let ratingForm = document.getElementById("ratingForm");
  let commentInput = document.getElementById("commentInput");
  let barIdInput = document.getElementById("barIdInput");
  let barNameInput = document.getElementById("barNameInput");
  let errorDiv = document.getElementById("error_div");

  let errors = [];

  function isEmpty(value) {
    return value.trim() === "";
  }

  if (ratingForm) {
    ratingForm.addEventListener("submit", (event) => {
      errors = [];

      if (errorDiv) {
        errorDiv.hidden = true;
        errorDiv.innerHTML = "";
      }

      const ratingInputs = document.getElementsByName("rating");
      let ratingSelected = false;

      // Check if any radio button is checked
      for (const input of ratingInputs) {
        if (input.checked) {
          ratingSelected = true;
          break;
        }
      }

      if (!ratingSelected) {
        errors.push("Client Side: Rating must be selected");
      }

      if (isEmpty(barIdInput.value) || isEmpty(barNameInput.value)) {
        errors.push("Unable to retrieve barId and or barName");
      }

      if (errors.length > 0) {
        let myUL = document.createElement("ul");

        event.preventDefault();
        for (let i = 0; i < errors.length; i++) {
          let myLi = document.createElement("li");
          myLi.classList.add("error");
          myLi.innerHTML = errors[i];
          myUL.appendChild(myLi);
        }
        errorDiv.appendChild(myUL);
        errorDiv.hidden = false;
      }
    });
  }
})();

//EditReviewForm
(function () {
  let ratingForm = document.getElementById("editReviewForm");
  let commentInput = document.getElementById("commentInput");
  let barIdInput = document.getElementById("barIdInput");
  let barNameInput = document.getElementById("barNameInput");
  let errorDiv = document.getElementById("error_div");

  let errors = [];

  function isEmpty(value) {
    return value.trim() === "";
  }

  if (ratingForm) {
    ratingForm.addEventListener("submit", (event) => {
      errors = [];

      if (errorDiv) {
        errorDiv.hidden = true;
        errorDiv.innerHTML = "";
      }

      const ratingInputs = document.getElementsByName("rating");
      let ratingSelected = false;

      // Check if any radio button is checked
      for (const input of ratingInputs) {
        if (input.checked) {
          ratingSelected = true;
          break;
        }
      }

      if (!ratingSelected) {
        errors.push("Client Side: Rating must be selected");
      }

      if (isEmpty(barIdInput.value) || isEmpty(barNameInput.value)) {
        errors.push("Unable to retrieve barId and or barName");
      }

      if (errors.length > 0) {
        let myUL = document.createElement("ul");

        event.preventDefault();
        for (let i = 0; i < errors.length; i++) {
          let myLi = document.createElement("li");
          myLi.classList.add("error");
          myLi.innerHTML = errors[i];
          myUL.appendChild(myLi);
        }
        errorDiv.appendChild(myUL);
        errorDiv.hidden = false;
      }
    });
  }
})();

//-----------------------------------------------------------Geolocation function--------------------------------------------------

// Check for Geolocation API permissions
navigator.permissions
  .query({ name: "geolocation" })
  .then(function (permissionStatus) {
    //console.log("geolocation permission state is ", permissionStatus.state);

    permissionStatus.onchange = function () {
      if (this.state === "denied") {
        alert(
          "Allow Afterhours to use your device location to find bars and events near you!"
        );
      }
      // console.log("geolocation permission state has changed to ", this.state);
    };
  });
//-------------------------------Location Allowed-----------------------------------
const successCallback = (position) => {
  console.log(position);
  if (document.URL.includes("/")) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    //Bar of the day AJAX function
    (function ($) {
      let BODArea = $("#BOD-area");
      let userLocationReq = {
        method: "POST",
        url: "/",
        contentType: "application/json",
        data: JSON.stringify({
          latitude: latitude,
          longitude: longitude,
        }),
      };
      $.ajax(userLocationReq).then(function (responseMessage) {
        if (responseMessage.BOD.name) {
          let element = $(
            `<a href="/bars/${responseMessage.BOD._id}">
          <div class="card">
              ${responseMessage.BOD.name} <br>
              ${responseMessage.BOD.description} <br>
              ${responseMessage.BOD.location.city} <br>
              ${responseMessage.BOD.ratingAverage} <br>
              ${responseMessage.BOD.reviewsCount} reviews <br>
              ${responseMessage.BOD.favoritesCount} favorites <br>
          </div>
        </a>`
          );
          BODArea.append(element);
        } else if (responseMessage.BOD.noBarsFound) {
          let element = $(`<a href="/register">
			<div class="card">
				${responseMessage.BOD.noBarsFound} <br>
				<p>If you want to add the first one, click here to create your bussines account!</p><br>
			</div>
		</a>`);

          BODArea.append(element);
        } else {
          let element = $(`
			<div class="card">
				
				<p>Server Error</p><br>
			</div>
		</a>`);
        }
      });
    })(window.jQuery); //End jQuery
  } //End of Homapage AJAX
  //-------------------------------------------Bar's Page-----------------------------------------------------------

  //Location allowed default list
  if (document.URL.includes("/bars")) {
    // Bars by user pricked (City-State or Zip Code) location using Ajax form

    (e) => {
      e.preventDefault();
      $("#respError").empty();

      const location = $("#findCityInput").val();
      const locType = $("#loc-type-selector").val();

      $.ajax({
        method: "POST",
        url: "/bars",
        contentType: "application/json",
        data: JSON.stringify({
          isAllowed: true,
          isDefault: true,
        }),
      }).then(
        (res) => {
          $("#barList").empty();
          const defaultList = res.reqResponse;

          defaultList.forEach((bar) => {
            $("#barList").append(
              $(
                `<li>
					  <div class="row"></div>
					  <a href="/bars/${bar.bar._id}">
						  <div class="card">
							  ${bar.bar.name} <br>							 
							  ${bar.bar.location.city} <br>
							  ${bar.bar.ratingAverage} <br>
							  ${bar.bar.reviewsCount} reviews <br>
							  ${bar.bar.favoritesCount} favorites <br>
						  </div>
					  </a>
					  </div>
				  </li>`
              )
            );
          });
        },
        (res) =>
          $("#respError").append(`<li>${res.responseJSON.reqResponse}</li>`)
      );
    };

    $("#findByLocation").on("submit", (e) => {
      e.preventDefault();
      $("#respError").empty();

      const location = $("#findCityInput").val();
      const locType = $("#loc-type-selector").val();

      $.ajax({
        method: "POST",
        url: "/bars",
        contentType: "application/json",
        data: JSON.stringify({
          location: location,
          isAllowed: true,
        }),
      }).then(
        (res) => {
          $("#barList").empty();
          const barsInCity = res.reqResponse;

          barsInCity.forEach((bar) => {
            $("#barList").append(
              $(
                `<li>
					  <div class="row"></div>
					  <a href="/bars/${bar.bar._id}">
						  <div class="card">
							  ${bar.bar.name} <br>
							  ${bar.distance} <br>
							  @ ${bar.duration} driving <br>
							  ${bar.bar.location.city} <br>
							  ${bar.bar.ratingAverage} <br>
							  ${bar.bar.reviewsCount} reviews <br>
							  ${bar.bar.favoritesCount} favorites <br>
						  </div>
					  </a>
					  </div>
				  </li>`
              )
            );
          });
        },
        (res) =>
          $("#respError").append(`<li>${res.responseJSON.reqResponse}</li>`)
      );
    });

    //----------------------------------------SORT AND FILTERS (location allowed)---------------------------------------------------------------
    // Sorting loc allowed rendered list
    $("#sortBySelector").change((e) => {
      e.preventDefault();
      $("#respError").empty();

      const option = $("#sortBySelector").val();

      $.ajax({
        method: "POST",
        url: "/bars/sortBy",
        contentType: "application/json",
        data: JSON.stringify({
          option: option,
          isAllowed: true,
        }),
      }).then(
        (res) => {
          $("#barList").empty();
          const barsList = res.reqResponse;

          barsList.forEach((bar) => {
            $("#barList").append(
              $(
                `<li>
					  <div class="row"></div>
					  <a href="/bars/${bar.bar._id}">
						  <div class="card">
							  ${bar.bar.name} <br>
							  ${bar.bar.location.city} <br> 						 
							  ${bar.bar.ratingAverage} <br>
							  ${bar.bar.reviewsCount} reviews <br>
							  ${bar.bar.favoritesCount} favorites <br>
						  </div>
					  </a>
					  </div>
				  </li>`
              )
            );
          });
        },
        (res) =>
          $("#respError").append(`<li>${res.responseJSON.reqResponse}</li>`)
      );
    });
  } // End Bar's page AJAX
}; //End success

//-----------------------------------------------------------Location NOT allowed-------------------------------------------------------------
const errorCallback = (error) => {
  if (document.URL.includes("/")) {
    const latitude = "40.730610";
    const longitude = "-73.935242";
    //Bar of the day AJAX function
    (function ($) {
      let BODArea = $("#BOD-area");
      let userLocationReq = {
        method: "POST",
        url: "/",
        contentType: "application/json",
        data: JSON.stringify({
          latitude: latitude,
          longitude: longitude,
        }),
      };
      $.ajax(userLocationReq).then(function (responseMessage) {
        if (responseMessage.BOD.name) {
          let element = $(
            `<a href="/bars/${responseMessage.BOD._id}">
          <div class="card">
              ${responseMessage.BOD.name} <br>
              ${responseMessage.BOD.description} <br>
              ${responseMessage.BOD.location.city} <br>
              ${responseMessage.BOD.ratingAverage} <br>
              ${responseMessage.BOD.reviewsCount} reviews <br>
              ${responseMessage.BOD.favoritesCount} favorites <br>
          </div>
        </a>`
          );
          BODArea.append(element);
        } else if (responseMessage.BOD.noBarsFound) {
          let element = $(`<a href="/register">
			<div class="card">
				${responseMessage.BOD.noBarsFound} <br>
				<p>If you want to add the first one, click here to create your bussines account!</p><br>
			</div>
		</a>`);

          BODArea.append(element);
        } else {
          let element = $(`
			<div class="card">
				
				<p>Server Error</p><br>
			</div>
		</a>`);
        }
      });
    })(window.jQuery); //End jQuery
  } //

  if (document.URL.includes("/")) {
    //---------------------- without location allowed-------------------------------------

    $("#sortBySelector").change((e) => {
      e.preventDefault();
      $("#respError").empty();

      const option = $("#sortBySelector").val();

      $.ajax({
        method: "POST",
        url: "/bars/sortBy",
        contentType: "application/json",
        data: JSON.stringify({
          option: option,
          isAllowed: false,
        }),
      }).then(
        (res) => {
          $("#barList").empty();
          const barsList = res.reqResponse;

          barsList.forEach((bar) => {
            $("#barList").append(
              $(
                `<li>
					  <div class="row"></div>
					  <a href="/bars/${bar.bar._id}">
						  <div class="card">
							  ${bar.bar.name} <br>							  
							  ${bar.bar.location.city} <br>
							  ${bar.bar.ratingAverage} <br>
							  ${bar.bar.reviewsCount} reviews <br>
							  ${bar.bar.favoritesCount} favorites <br>
						  </div>
					  </a>
					  </div>
				  </li>`
              )
            );
          });
        },
        (res) =>
          $("#respError").append(`<li>${res.responseJSON.reqResponse}</li>`)
      );
    });
  } //End Bar's page
}; //End loc Not allowed

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

//-----------------------------------------end location check-----------------------------------
//Tags filter
if (document.URL.includes("/bars")) {
  $("#filterForm").on("submit", (e) => {
    e.preventDefault();
    errors = [];

    const inputs = $("#filterForm");

    $("#barList").empty();
    $.ajax({
      method: "POST",
      url: "/bars/barsByFilters",
      data: inputs.serialize(),
    }).then((res) => {
      const foundBars = res.reqResponse;
      foundBars.forEach((bar) => {
        $("#barList").append(
          $(
            `<li>
					<div class="row"></div>
					<a href="/bars/${bar.bar._id}">
						<div class="card">
							${bar.bar.name} <br>						
							${bar.bar.location.city} <br>
							${bar.bar.ratingAverage} <br>
							${bar.bar.reviewsCount} reviews <br>
							${bar.bar.favoritesCount} favorites <br>
						</div>
					</a>
					</div>
				</li>`
          )
        );
      }),
        (res) =>
          $("#respError").append(`<li>${res.responseJSON.reqResponse}</li>`);
    });
  });
}
//---------------------------------------Search/ city by user input-------------------------------------

//City Search
if (document.URL.includes("/bars")) {
  $("#findByLocation").on("submit", (e) => {
    e.preventDefault();
    $("#respError").empty();

    const city = $("#findCityInput").val();
    const state = $("#findStateInput").val();

    $.ajax({
      method: "POST",
      url: "/bars",
      contentType: "application/json",
      data: JSON.stringify({
        city: city,
        state: state,
      }),
    }).then(
      (res) => {
        $("#barList").empty();
        const barsInCity = res.reqResponse;

        barsInCity.forEach((bar) => {
          $("#barList").append(
            $(
              `<li>
        <div class="row"></div>
        <a href="/bars/${bar.bar._id}">
          <div class="card">
            ${bar.bar.name} <br>
            ${bar.bar.location.city} <br>       
            ${bar.bar.ratingAverage} <br>
            ${bar.bar.reviewsCount} reviews <br>
            ${bar.bar.favoritesCount} favorites <br>
          </div>
        </a>
        </div>
      </li>`
            )
          );
        });
      },
      (res) =>
        $("#respError").append(`<li>${res.responseJSON.reqResponse}</li>`)
    );
  });
}

$("#favoriteButton").on("submit", (e) => {
	e.preventDefault();
	const inputs = $("#favoriteButton");
	$.ajax({
		method: "PUT",
		url: "/user/favorites",
		data: inputs.serialize(),
	}).then(
		(res) => {
			let favoritesCount = Number($("#favoritesCount").text());
			let buttonText = $("#favorite-submit-button").text();
			buttonText === "Favorite"
				? (buttonText = "Unfavorite") && favoritesCount++
				: (buttonText = "Favorite") && favoritesCount--;
			$("#favorite-submit-button").text(buttonText);
			$("#favoritesCount").text(favoritesCount);
		},
		(res) => {
			$("#favorite-submit-button").text("Error, please refresh.");
			$("#favorite-submit-button").attr("disabled", true);
		}
	);
});

$("#delete-button").on("click", (e) => {
	$("#delete-confirm").removeClass("hide");
});

$("#cancel-delete-button").on("click", (e) => {
	$("#delete-confirm").addClass("hide");
});
