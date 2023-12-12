import axios from "axios";
import barData from "./data/bars.js";
import date from "date-and-time";

//Global Variables
let userCity = "";
let barsDistanceList = [];
let distances = [];
const oldUserLoc = { latitude: "", longitude: "", isNeeded: false };
let setUserLoc = {};
let hasUpdates = false;

let exportedMethods = {
  async barsDistance(userLocation) {
    let userLoc = "";
    //Call all bars
    const bars = await barData.allBars();
    //Google key
    const myKey = "AIzaSyCNmw9imxqmAtqkfDn194OzvwuTwjMOZXw";
    if (typeof userLocation !== "string") {
      userLoc = userLocation.latitude + "," + userLocation.longitude;
      setUserLoc = userLocation;
    } else {
      const city = userLocation.split(",")[0];
      const state = userLocation.split(",")[1];
      setUserLoc = { city: city, state: state };
      userLoc = `${city}%20${state}`;
    }

    let destinations = "";
    bars.forEach((bar) => {
      if (bars[bars.length - 1] !== bar) {
        destinations += `${bar.location.streetAddress}%20${bar.location.city}%20${bar.location.state}%7C`;
      } else {
        destinations += `${bar.location.streetAddress}%20${bar.location.city}%20${bar.location.state}`;
      }
    });

    const url =
      "https://maps.googleapis.com/maps/api/distancematrix/json?destinations=" +
      destinations +
      "&origins=" +
      userLoc +
      "&units=imperial&key=" +
      myKey;

    //Creating a bar distance time object
    const { data } = await axios.get(url);
    const { rows } = data;
    distances = rows[0];
    oldUserLoc.isNeeded = false;

    let userAddress = data.origin_addresses[0];
    userCity = userAddress.split(", ")[1];

    barsDistanceList = [];
    for (let i = 0; i < bars.length; i++) {
      const barsDistance = {
        bar: bars[i],
        distance: distances.elements[i],
      };
      barsDistanceList.push(barsDistance);
    }

    return barsDistanceList;
  },

  async barDistanceHelper(haveUpdates) {
    if (haveUpdates) {
      this.barsDistance(setUserLoc);
    }
  },
  // Finding the BOD
  async barOfTheDay() {
    //Variables
    const candidatesToBOD = [];
    const now = new Date();
    const today = date.format(now, "MM/DD/YYYY");
    const aBOD = [];
    let hasEvent = false;
    let cityBar = false;
    let eventToday = false;
    const cityBars = [];

    //All bars
    const allBars = await barData.allBars();

    //Cehcking if there is a BOD in the user's city
    allBars.forEach((bar) => {
      const barCity = bar.location.city;
      if (barCity === userCity) {
        if (bar.BODDate === today) {
          aBOD.push(bar);
        }
      }
    });
    if (aBOD.length === 0) {
      allBars.forEach((bar) => {
        const events = bar.schedule;
        //const numEvents = bar.schedule.length;
        const barCity = bar.location.city;
        if (barCity === userCity) {
          cityBar = true;
          cityBars.push(bar);
          if (events.length === 0) {
            hasEvent = false;
          } else {
            hasEvent = true;
            events.forEach((event) => {
              if (event.date === today) {
                eventToday = true;
                candidatesToBOD.push(bar);
              }
            });
          }
        }
      });
      //Sorting BOD (bar of the date) candidates, first by rating and then by favorites
      let sortedCandidates = [];
      if (candidatesToBOD.length > 1) {
        sortedCandidates = candidatesToBOD.sort(function (a, b) {
          return (
            b.ratingAverage - a.ratingAverage ||
            b.favoritesCount - a.favoritesCount
          );
        });
        const BODId = sortedCandidates[0]._id.toString();
        return barData.makeBOD(BODId);
      } else if (candidatesToBOD.length === 1) {
        const BODId = candidatesToBOD[0]._id.toString();
        return barData.makeBOD(BODId);
      } else if (!cityBars.length) {
        return {
          noBarsFound: `We have not bars listed in ${userCity} yet. We are working on adding more  bars.`,
        };
      } else if (candidatesToBOD.length === 0 && !eventToday) {
        if (cityBars.length > 1) {
          sortedCandidates = cityBars.sort(function (a, b) {
            return (
              b.ratingAverage - a.ratingAverage || a.likesCount - b.likesCount
            );
          });
          const BODId = sortedCandidates[0]._id.toString();
          return barData.makeBOD(BODId);
        } else {
          const BODId = cityBars[0]._id.toString();
          return barData.makeBOD(BODId);
        }
      }
    } else {
      return aBOD[0];
    }
  },
  async sortedBarsbyDistance() {
    let barsAndDistance = [];

    barsDistanceList.forEach((bar) => {
      const { distance } = bar;
      const barDist = distance.distance.text;
      const barTime = distance.duration.text;
      let tempArray = barDist.split(" ");
      let numDistance = Number(tempArray[0]);
      if (tempArray[1].toLowerCase() === "ft") {
        numDistance = Math.round(numDistance * 0.0001894);
      }
      barsAndDistance.push({
        bar: bar.bar,
        distance: numDistance,
        duration: barTime,
      });
    });

    let sortedBars = barsAndDistance.sort(function (a, b) {
      return (
        a.distance - b.distance || b.bar.ratingAverage - a.bar.ratingAverage
      );
    });

    return sortedBars;
  },
};

export default exportedMethods;
