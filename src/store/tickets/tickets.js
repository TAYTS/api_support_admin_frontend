import axios from "../../axios/ticketAxios";

const state = {
  open: [],
  close: []
};

const actions = {
  getTickets(context, payload) {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      return axios
        .get("/tickets/retrieve-tickets/" + payload["jobLevel"], {
          headers: {
            "X-CSRF-TOKEN": access_token
          }
        })
        .then(response => {
          if (response.status === 200) {
            return response.data;
          } else {
            return 0;
          }
        })
        .catch(() => {
          return 0;
        });
    } else {
      return new Promise(resolve => {
        resolve(0);
      });
    }
  },
  getSingleTicket(context, payload) {
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
              "X-CSRF-TOKEN": access_token
            }
          }
        )
        .then(response => {
          if (response.status === 200) {
            return response.data;
          } else {
            return 0;
          }
        })
        .catch(() => {
          return 0;
        });
    } else {
      return new Promise(resolve => {
        resolve(0);
      });
    }
  },
  moveToMyJobs(context, payload) {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      return axios
        .get("/tickets/move-to-my-jobs/" + payload["messageID"], {
          headers: {
            "X-CSRF-TOKEN": access_token
          }
        })
        .then(response => {
          if (response.status === 200 && response.data.status === 1) {
            return 1;
          } else {
            return 0;
          }
        })
        .catch(() => {
          return 0;
        });
    } else {
      return new Promise(resolve => {
        resolve(0);
      });
    }
  },
  emailUser(context, payload) {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      return axios
        .get("/tickets/email-user/" + payload["messageID"], {
          headers: {
            "X-CSRF-TOKEN": access_token
          }
        })
        .then(response => {
          if (response.status === 200 && response.data.status === 1) {
            return 1;
          } else {
            return 0;
          }
        })
        .catch(() => {
          return 0;
        });
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
