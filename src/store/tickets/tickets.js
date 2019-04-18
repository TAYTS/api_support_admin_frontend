import axios from "../../axios/ticketAxios";

const state = {
  open: [],
  close: []
};

const actions = {
  getTickets({ commit }, payload) {
    let status = 0;
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      //change to access_token when login is working
      return axios
        .get("/tickets/retrieve-tickets/" + payload["jobLevel"], {
          headers: {
            "X-CSRF-TOKEN": access_token //identifies account
            //http only
          }
        })
        .then(response => {
          if (response.status === 200) {
            return response.data;
          } else {
            // Error when trying to get tickets
            return 0;
          }
        }); //end of axios, axios will return a promise to messagelist.vue
      //axios.get is a get request
    } else {
      // Invalid credential
      status = 0;
      return new Promise(resolve => {
        resolve(status);
      });
    }
  },
  getSingleTicket({ commit }, payload) {
    let status = 0;
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      //change to access_token when login is working
      return axios
        .get(
          "/tickets/retrieve-single-ticket/" +
            payload["jobLevel"] +
            "/" +
            payload["messageID"],
          {
            headers: {
              "X-CSRF-TOKEN": access_token //identifies account
              //http only
            }
          }
        )
        .then(response => {
          if (response.status === 200) {
            return response.data;
          } else {
            // Error when trying to get tickets
            return 0;
          }
        }); //end of axios, axios will return a promise to messagelist.vue
      //axios.get is a get request
    } else {
      // Invalid credential
      status = 0;
      return new Promise(resolve => {
        resolve(status);
      });
    }
  },
  moveToMyJobs({ commit }, payload) {
    let status = 0;
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      //change to access_token when login is working
      return axios
        .get("/tickets/move-to-my-jobs/" + payload["messageID"], {
          headers: {
            "X-CSRF-TOKEN": access_token //identifies account
            //http only
          }
        })
        .then(response => {
          if (response.status === 200 && response.data.status === 1) {
            return 1;
          } else {
            // Error when trying to get tickets
            return 0;
          }
        }); //end of axios, axios will return a promise to messagelist.vue
      //axios.get is a get request
    } else {
      // Invalid credential
      status = 0;
      return new Promise(resolve => {
        resolve(status);
      });
    }
  },
  emailUser(context, payload) {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      //change to access_token when login is working
      return axios
        .get("/tickets/email-user/" + payload["messageID"], {
          headers: {
            "X-CSRF-TOKEN": access_token //identifies account
            //http only
          }
        })
        .then(response => {
          if (response.status === 200 && response.data.status === 1) {
            return 1;
          } else {
            // Error when trying to get tickets
            return 0;
          }
        })
        .catch(() => {
          return 0;
        });
      //end of axios, axios will return a promise to messagelist.vue
    } else {
      return new Promise(resolve => {
        resolve(0);
      });
    }
  }
};

const mutations = {
  addTickets(state, tickets) {
    state.open = tickets.open;
    state.close = tickets.close;
  }
};

export const tickets = {
  namespaced: true,
  state,
  actions,
  mutations
};
