const axios = require("axios");

let currentRequests = [];
let unresolvedQueue = [];
let batchedIds = [];
const MAX_REQUEST_COUNT = 3;

const baseURL =
"https://europe-west1-quickstart-1573558070219.cloudfunctions.net";

const axiosAltInstance = axios.create({ baseURL })

axios.defaults.baseURL = baseURL;

let interval

axios.interceptors.request.use(
  function (config) {
    return new Promise((resolve, reject) => {
      currentRequests = [...currentRequests, ...config.params.ids];
      interval = interval || setInterval(function () {
        clearInterval(interval);
        axiosAltInstance
          .get('/file-batch-api', {
            params: {
              ids: currentRequests,
            },
          })
          // .then(response => console.log(response.data))
          .then((response) => {
            return resolve(response.data)
            unresolvedQueue.forEach((paramStr) => {
              reject({
                isQueuedItem: true
              })
              // console.log(Object.keys(paramStr)[0]);
              // const { resolve, reject } = Object.values(paramStr)[0];
              // resolve({
              //   items: Object.keys(paramStr)[0]
              //     .split("-")
              //     .map((item) =>
              //       response.data.items.find((respItem) => respItem.id === item)
              //     ),
              // });
            });
            unresolvedQueue = [];
            currentRequests = [];
          });
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
    console.log("response should be ", response);
    return response;

    return Promise.resolve({
      items:
        response.data.items.find((respItem) => respItem.id === lastItem) || [],
    });
  },
  (error) => {
    console.log(error)
    // return Promise.resolve(error)
    return new Promise((resolve, reject) => {
      resolve(error)
    })
  }
);

module.exports = axios;
