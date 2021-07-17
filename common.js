const axios = require("axios");

let currentRequests = [];
let unresolvedQueue = [];


const baseURL =
  "https://europe-west1-quickstart-1573558070219.cloudfunctions.net";


axios.defaults.baseURL = baseURL;

let interval;

axios.interceptors.request.use(
  function (config) {
    return new Promise((resolve, reject) => {
      currentRequests = [...currentRequests, ...config.params.ids];
      interval =
        interval ||
        setInterval(function () {
          clearInterval(interval);

          const lastRequestFile = unresolvedQueue.pop()
          const lastRequest = Object.values(lastRequestFile)[0];

          config.lastRequestFileId = Object.keys(lastRequestFile)[0]
          config.params = {
            ids: currentRequests,
          };

          lastRequest.resolve(config);
        }, 1000);

      unresolvedQueue.push({
        [config.params.ids.join("-")]: { resolve, reject },
      });
    });
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {

    unresolvedQueue.forEach((item, idx, arr) => {
      const fileId = Object.keys(item)[0];
      const fileData = Object.values(item)[0];
      // rejecting the request here ensures the 
      // http call is not made. 
      // this interceptor will catch this with the  
      // below error callback,
      fileData.reject({
        items: fileId
          .split("-")
          .map((item) =>
            response.data.items.find((respItem) => respItem.id === item)
          ).filter(Boolean),
      });
    });


    unresolvedQueue = [];
    currentRequests = [];

    return {
      items: response.config.lastRequestFileId
        .split("-")
        .map((item) =>
          response.data.items.find((respItem) => respItem.id === item)
        ).filter(Boolean),
    };
  },
  (error) => {
    // luckily we can return a promise 
    return new Promise((resolve, reject) => {
      // old school error check
      if (error instanceof Error) {
        reject(error)
      } else {
        resolve(error);
      }
    });
  }
);

module.exports = axios;
