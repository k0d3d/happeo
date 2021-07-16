const axios = require("axios");

let currentRequests = [];
let unresolvedQueue = []
let batchedIds = [];
const MAX_REQUEST_COUNT = 3;

const baseURL =  "https://europe-west1-quickstart-1573558070219.cloudfunctions.net";
axios.defaults.baseURL = baseURL;



axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // console.log(config.params)
    if (config.url !== '/file-batch-api') return Promise.resolve(config)
    return new Promise((resolve, reject) => {
      // currentRequests.push()
      currentRequests = [...currentRequests, ...config.params.ids];
      if (currentRequests.length === MAX_REQUEST_COUNT) {
        // reset file count
        config.params = {
          ids: currentRequests,
        };
        // let batchInstance = axios.create({baseURL})
        // batchInstance.get(config.url, {
        //   params: {
        //     ids: currentRequests,
        //   },
        // })
        // .then(axiosRes => {
        //   resolve(axiosRes.config)
        // })
        // .catch(error => reject(error))

        resolve(config)

      } else {
        config.ADDED_TO_QUEUE = true
        reject(config)
      }
    });
    // return Promise.resolve(config);
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {

    console.log('response should be ', response.statusText)
    unresolvedQueue.forEach(({resolve, reject}) => {
      console.log(`item`)
      resolve(response)
    })
    unresolvedQueue = []
    currentRequests = [];
    return Promise.resolve(response);
    return new Promise ((resolve, reject) => {
      console.log('response should be ', response.statusText)

      batchInstance
      .then(response => {
        resolve(response.config)
      }, error => reject(error))
    })


    if (response.config.ADDED_TO_QUEUE) {
    }
  },
  (error) => {
    const unresolvedItem = new Promise((resolve, reject) => {
      // resolve([])
      unresolvedQueue.push({resolve, reject})
    })
    return unresolvedItem
  }
);

module.exports = axios;
