import axios from "axios";
import barsFunctions from "./data/bars.js";
import date from "date-and-time";

//Global Variables
let userCity = "";
let barsDistanceList = [];

let exportedMethods = {
  async barsDistance(userLocation, bars) {
    const myKey = "AIzaSyCNmw9imxqmAtqkfDn194OzvwuTwjMOZXw";
    const userLoc = userLocation.latitude + "," + userLocation.longitude;

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
    const distances = rows[0];

    for (let i = 0; i < bars.length; i++) {
      const barsDistance = {
        bar: bars[i],
        distance: distances.elements[i],
      };
      barsDistanceList.push(barsDistance);
    }

    let userAddress = data.origin_addresses[0];
    userCity = userAddress.split(", ")[1];

    return barsDistanceList;
  },
  // Finding the BOD
  async barOfTheDay(allBars) {
    //Variables
    const candidatesToBOD = [];
    const now = new Date();
    const today = date.format(now, "MM/DD/YYYY");
    const aBOD = [];
    let hasEvent = false;
    let cityBar = false;
    let eventToday = false;
    const cityBars = [];

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
      //Sorting BOD (bar of the date) candidates, first by rating and then by likes
      let sortedCandidates = [];
      if (candidatesToBOD.length > 1) {
        sortedCandidates = candidatesToBOD.sort(function (a, b) {
          return (
            b.ratingAverage - a.ratingAverage || a.likesCount - b.likesCount
          );
        });
        const BODId = sortedCandidates[0]._id.toString();
        return barsFunctions.makeBOD(BODId);
      } else if (candidatesToBOD.length === 1) {
        const BODId = candidatesToBOD[0]._id.toString();
        return barsFunctions.makeBOD(BODId);
      } else if (!cityBars.length) {
        return {
          message: `We have not bars listed in ${userCity} yet. We are working on adding more  bars.`,
        };
      } else if (candidatesToBOD.length === 0 && !eventToday) {
        if (cityBars.length > 1) {
          sortedCandidates = cityBars.sort(function (a, b) {
            return (
              b.ratingAverage - a.ratingAverage || a.likesCount - b.likesCount
            );
          });
          const BODId = sortedCandidates[0]._id.toString();
          return barsFunctions.makeBOD(BODId);
        } else {
          const BODId = cityBars[0]._id.toString();
          return barsFunctions.makeBOD(BODId);
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
