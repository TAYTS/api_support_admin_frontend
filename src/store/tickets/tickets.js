import axios from "../../axios/loginAxios";
import { stat } from "fs";

const state = {
  open: [],
  close: []
};

const actions = {
  getTickets() {
    let status = 0;
    console.log("getTicket activated");
    const access_token = sessionStorage.getItem("access_token");
    if (true) {//change to access_token when login is working
      console.log("axios activated");
      return axios
        .get("/tickets/retrieve-tickets", {
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
