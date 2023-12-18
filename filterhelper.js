import axios from "axios";
import barData from "./data/bars.js";
import date from "date-and-time";

//Global Variables
let userCity = "";
let userState = "";
let barsDistanceList = [];
let distances = [];
let setUserLoc = {};
let searchLoc = {};

let exportedMethods = {
  async barsDistance(userLocation) {
    let userLoc = "";
    //Call all bars
    const bars = await barData.allBars();
    if (!bars.length)
      throw {
        code: 1,
        msg: "No bars in the data base yet. Try to create one!",
      };

    if (typeof userLocation !== "string") {
      userLoc = userLocation.latitude + "," + userLocation.longitude;
      setUserLoc = userLocation;
    } else {
      if (userLocation.split(",").length === 1) {
        userLoc = userLocation;
      } else {
        const city = userLocation.split(",")[0];
        const state = userLocation.split(",")[1];
        searchLoc = { city: city, state: state };
        userLoc = `${city}%20${state}`;
      }
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
      "AIzaSyCNmw9imxqmAtqkfDn194OzvwuTwjMOZXw";

    //Creating a bar distance time object
    const { data } = await axios.get(url);
    const { rows } = data;
    distances = rows[0];
    console.log(data);

    let userAddress = data.origin_addresses[0];
    if (userAddress[0] === "")
      throw { code: 2, msg: "Invalid City and State!" };
    let splitUserAddress = userAddress.split(", ");
    if (splitUserAddress.length === 4) {
      userCity = splitUserAddress[1];
      const userStateZip = splitUserAddress[2];
      userState = userStateZip.split(" ")[0];
    } else if (splitUserAddress.length === 3) {
      userCity = splitUserAddress[0];
      const userStateZip = splitUserAddress[1];
      userState = userStateZip.split(" ")[0];
    } else if (splitUserAddress.length === 2) {
      userCity = "Unknown";
      const userStateZip = splitUserAddress[0];
      userState = userStateZip.split(" ")[0];
    }
    barsDistanceList = [];
    for (let i = 0; i < bars.length; i++) {
      const barsDistance = {
        bar: bars[i],
        distance: distances.elements[i].distance.text,
        duration: distances.elements[i].duration.text,
      };

      barsDistanceList.push(barsDistance);
    }
    if (barsDistanceList.length === 0) throw { code: 1, msg: "0 Results!" };

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
      const barState = bar.location.state;
      if (barCity === userCity && barState === userState) {
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
        const barState = bar.location.state;
        if (barCity === userCity && barState === userState) {
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
    // let barsAndDistance = [];

    let sortedBars = barsDistanceList.sort(function (a, b) {
      return (
        a.distance.split(" ")[0] - b.distance.split(" ")[0] ||
        b.bar.ratingAverage - a.bar.ratingAverage
      );
    });

    return sortedBars;
  },

  async sortedByRating(bars) {
    let sortedBars = bars.sort(function (a, b) {
      return (
        b.bar.ratingAverage - a.bar.ratingAverage ||
        b.bar.favoritesCount - a.bar.favoritesCount
      );
    });

    return sortedBars;
  },

  async sortedByLikes(bars) {
    let sortedBars = bars.sort(function (a, b) {
      return (
        b.bar.favoritesCount - a.bar.favoritesCount ||
        b.bar.ratingAverage - a.bar.ratingAverage
      );
    });

    return sortedBars;
  },
  async sortedReviews(bars) {
    let sortedBars = bars.sort(function (a, b) {
      return (
        b.bar.reviewsCount - a.bar.reviewsCount ||
        b.bar.ratingAverage - a.bar.ratingAverage
      );
    });

    return sortedBars;
  },

  async cityBars(city, state) {
    let neededLocation = "";
    //const locationArray = trmLocation.split(",");

    //const city = locationArray[0];
    // const state = locationArray[1].trim();

    // neededLocation = `${city.toLowerCase()},${state.toLowerCase()}`;
    //const userCityHolder = userCity;
    //const userStateHolder = userState;
    const allBars = await barData.allBars();

    let barsInCity = [];
    allBars.forEach((bar) => {
      const barCity = bar.location.city;
      const barstate = bar.location.state;
      if (city.length > 0) {
        if (
          barCity.toLowerCase() === city.toLowerCase() &&
          barstate.toLowerCase() === state.toLowerCase()
        ) {
          barsInCity.push(bar);
        }
      } else {
        if (barstate.toLowerCase() === state.toLowerCase()) {
          barsInCity.push(bar);
        }
      }
    });

    let sortedBars = barsInCity.sort(function (a, b) {
      return (
        b.ratingAverage - a.ratingAverage || b.favoritesCount - a.favoritesCount
      );
    });

    // userCity = userCityHolder;
    //userState = userStateHolder;
    return sortedBars;
  },

  async zipCodeBars(zipCode) {
    const userCityHolder = userCity;
    const userStateHolder = userState;
    const allBars = await this.barsDistance(zipCode);
    let barsInCity = [];
    allBars.forEach((bar) => {
      const barCity = bar.bar.location.city;
      const barstate = bar.bar.location.state;

      if (
        barCity.toLowerCase() === userCity.toLowerCase() &&
        barstate.toLowerCase() === userState.toLowerCase()
      ) {
        barsInCity.push(bar);
      }
    });
    userCity = userCityHolder;
    userState = userStateHolder;

    return this.sortedByRating(barsInCity);
  },
  // This function is only used if the location is not provided. This is to add 0 distance.
  async allBarsPlus(bars) {
    // const allbars = await barData.allBars();
    const allBarsPlus = [];

    bars.forEach((x) => {
      const bar = {
        bar: x,
        distance: -1,
        duration: -1,
      };

      allBarsPlus.push(bar);
    });

    return allBarsPlus;
  },
  userLocTrack() {
    const userLocation = `${userCity},${userState}`;

    return userLocation;
  },

  tagsFilter(filterTags, bars) {
    if (filterTags.length === 0) {
      return bars
    }
    let barsFound = new Set();

    bars.forEach((bar) => {
      console.log(bar.bar.tags)
      if (filterTags.every(tag => bar.bar.tags.includes(tag))) {
        barsFound.add(bar)
      }
    });
      
    if (barsFound.size === 0)
      throw {
        code: 1,
        msg: "0 bars found",
      };

    const array = Array.from(barsFound);

    return array;
  }
};

export default exportedMethods;
