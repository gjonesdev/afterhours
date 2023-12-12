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
                if(!commentInput.value){
                    errorDiv.hidden = false;
                    errorDiv.className = 'error';
                    errorDiv.innerHTML = 'Comment needs to have valid values.';
                    commentInput.focus();
                    event.preventDefault();
                    return;
                }
    
                if(typeof commentInput.value !== "string" || commentInput.value.trim().length === 0)
                { 
                    errorDiv.hidden = false;
                    errorDiv.className = 'error';
                    errorDiv.innerHTML = 'Comment should be a valid string (no empty spaces, should not contain numbers).';
                    commentInput.focus();
                    event.preventDefault();
                    return;
                }
    
                //Comment should not contain only numbers
                if(!isNaN(commentInput.value))
                {
                    errorDiv.hidden = false;
                    errorDiv.className = 'error';
                    errorDiv.innerHTML = 'Comment should not contain only numbers';
                    commentInput.focus();
                    event.preventDefault();
                    return;
                }
    
                if(commentInput.value.trim().length < 2 || commentInput.value.trim().length > 500)
                { 
                    errorDiv.hidden = false;
                    errorDiv.className = 'error';
                    errorDiv.innerHTML = 'Comment should be at least 2 characters long and a max of 500 characters.';
                    commentInput.focus();
                    event.preventDefault();
                    return;
                }
               
            } else {
              errorDiv.hidden = false;
              errorDiv.className = 'error';
              errorDiv.innerHTML = 'Your comment can not be empty and needs to have valid values.';
              commentInput.focus();
              event.preventDefault();
              return;
            }
            
        //Sent effect
        document.body.classList.add("sent");

        //wait 3.7 second to go back to the previous page
        setTimeout('history.go(-1)', 3700);
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

			//bindEventsToTodoItem(element);
			// todoItem.replaceWith(element);
		});
	})(window.jQuery); //End jQuery
}; //End success
const errorCallback = (error) => {
	console.log(error);
};
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

//nav bar

var prevScrollPos = window.pageYOffset;
var navbar = document.getElementById("main-nav");

window.onscroll = function () {
	var currentScrollPos = window.pageYOffset;

	if (prevScrollPos > currentScrollPos) {
		navbar.style.top = "0";
		navbar.style.opacity = "1";
	} else {
		navbar.style.top = "-50px";
		navbar.style.opacity = "0";
	}

	prevScrollPos = currentScrollPos;
};

//WriteReviewForm
(function () {
	let ratingForm = document.getElementById('ratingForm');
	let commentInput = document.getElementById('commentInput')
	let barIdInput = document.getElementById('barIdInput')
	let barNameInput = document.getElementById('barNameInput')
	let errorDiv = document.getElementById('error_div')

	let errors = [];

	function isEmpty(value) {
        return value.trim() === '';
    }

	if (ratingForm) {
		ratingForm.addEventListener('submit', (event) => {

			errors = [];

			if (errorDiv) {
				errorDiv.hidden = true;
				errorDiv.innerHTML = '';
			}

			const ratingInputs = document.getElementsByName('rating');
			let ratingSelected = false;
	
			// Check if any radio button is checked
			for (const input of ratingInputs) {
				if (input.checked) {
					ratingSelected = true;
					break;
				}
			}

			if (!ratingSelected) {
				errors.push('Client Side: Rating must be selected')
			}

			if ((isEmpty(barIdInput.value)) || (isEmpty(barNameInput.value))) {
				errors.push('Unable to retrieve barId and or barName')
			}

			if (errors.length > 0) {
				let myUL = document.createElement('ul');
		
				event.preventDefault();
				for (let i = 0; i < errors.length; i++) {
					let myLi = document.createElement('li');
					myLi.classList.add('error');
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
	let ratingForm = document.getElementById('editReviewForm');
	let commentInput = document.getElementById('commentInput')
	let barIdInput = document.getElementById('barIdInput')
	let barNameInput = document.getElementById('barNameInput')
	let errorDiv = document.getElementById('error_div')

	let errors = [];

	function isEmpty(value) {
        return value.trim() === '';
    }

	if (ratingForm) {
		ratingForm.addEventListener('submit', (event) => {

			errors = [];

			if (errorDiv) {
				errorDiv.hidden = true;
				errorDiv.innerHTML = '';
			}

			const ratingInputs = document.getElementsByName('rating');
			let ratingSelected = false;
	
			// Check if any radio button is checked
			for (const input of ratingInputs) {
				if (input.checked) {
					ratingSelected = true;
					break;
				}
			}

			if (!ratingSelected) {
				errors.push('Client Side: Rating must be selected')
			}

			if ((isEmpty(barIdInput.value)) || (isEmpty(barNameInput.value))) {
				errors.push('Unable to retrieve barId and or barName')
			}

			if (errors.length > 0) {
				let myUL = document.createElement('ul');
		
				event.preventDefault();
				for (let i = 0; i < errors.length; i++) {
					let myLi = document.createElement('li');
					myLi.classList.add('error');
					myLi.innerHTML = errors[i];
					myUL.appendChild(myLi);
				}
				errorDiv.appendChild(myUL);
				errorDiv.hidden = false;
			}
		});
	}
})();