const state = {
  access_token: "",
  refresh_token: ""
};

const actions = {
  login({ commit }, payload) {
    return this._vm.$http
      .post("/users/login", payload, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      .then(response => {
        if (response.status === 200 && response.data.status === 1) {
          commit("get_tokens");
          sessionStorage.setItem("remember", payload.remember);
          return response.data.status;
        } else {
          deleteAllCookies();
          return 0;
        }
      })
      .catch(() => {
        return 0;
      });
  },
  authenticate({ commit }) {
    commit("get_tokens");
    let status;
    if (state.access_token && state.refresh_token) {
      const remember = sessionStorage.getItem("remember");
      if (remember === "true") {
        this._vm.$http
          .get("/users/refresh", {
            headers: {
              "Content-Type": "applicati1on/json",
              "X-CSRF-TOKEN": state.refresh_token
            },
            withCredentials: true
          })
          .then(response => {
            if (response.status === 200 && response.data.status === 1) {
              commit("get_tokens");
              status = 1;
            } else {
              status = 0;
              deleteAllCookies();
            }
          });
      } else {
        this._vm.$http
          .get("/users/authenticate", {
            headers: {
              "Content-Type": "applicati1on/json",
              "X-CSRF-TOKEN": state.access_token
            },
            withCredentials: true
          })
          .then(response => {
            if (response.status === 200 && response.data.status === 1) {
              commit("get_tokens");
              status = 1;
            } else {
              status = 0;
              deleteAllCookies();
            }
          });
      }
    } else {
      status = 0;
    }
    return new Promise(resolve => {
      resolve(status);
    });
  }
};

const mutations = {
  get_tokens(state) {
    // Get the CSRF cookies
    const cookies = document.cookie.split(";");
    // Create the regx pattern to extract the csrf token
    const pattern1 = /csrf_access_token=(.*)/;
    const pattern2 = /csrf_refresh_token=(.*)/;

    // Create a buffer for storing the tokens
    let access_token = "";
    let refresh_token = "";

    // Loop and save the token to respective buffer
    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].match(pattern1)) {
        access_token = cookies[i].match(pattern1)[1];
      }
      if (cookies[i].match(pattern2)) {
        refresh_token = cookies[i].match(pattern2)[1];
      }
    }

    state.access_token = access_token;
    state.refresh_token = refresh_token;
  }
};

/*
 * Helper functions
 */
function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

export const user = {
  namespaced: true,
  state,
  actions,
  mutations
};
