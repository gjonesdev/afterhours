let blockedLocation = false;

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const title = document.querySelector("title");
title.textContent = capitalize(title.textContent);

//reports-form
let reportFormDocument = document.getElementById("reports-form");
if (reportFormDocument) reportForm();

/**reports-form */
function reportForm() {
  let reportFormDocument = document.getElementById("reports-form");
  let reasonInput = document.getElementById("reasonInput");
  let commentInput = document.getElementById("commentInput");

  let errorDiv = document.getElementById("error");

  if (reportFormDocument) {
    reportFormDocument.addEventListener("submit", (event) => {
      console.log("report-Form submission fired");
      console.log("Has a form");

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

      //Sent effect
      document.body.classList.add("sent");

      //wait 3.7 second to go back to the previous page
      setTimeout("history.go(-1)", 3700);
    });
  }
}

//Geolocation function

const successCallback = (position) => {
  console.log(position);

  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  //Request to send user location

  (function ($) {
    let BODArea = $("#BOD-area");
    let userLocatetionReq = {
      method: "POST",
      url: "/",
      contentType: "application/json",
      data: JSON.stringify({
        latitude: latitude,
        longitude: longitude,
      }),
    };
    $.ajax(userLocatetionReq).then(function (responseMessage) {
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
}; //End success
const errorCallback = (error) => {
  event.preventDefault();
  alert(
    "Allow Afterhours to use your device location to find bars and events near you!"
  );
};
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

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

    if (passwordInput.value !== confirmPasswordInput.value) {
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

  accountForm.addEventListener("submit", (event) => {
    errors = [];
    accountErrorList.innerHTML = "";
    accountErrorList.classList.add("hide");

    validateEmail(emailInput);
    if (newPasswordInput.value) {
      validatePassword(newPasswordInput);

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
