<template>
  <v-navigation-drawer class="greyhue" fixed permanent absolute width="250">
    <v-toolbar flat color="primary">
      <v-list>
        <v-list-tile>
          <img class="logo-main" src="../assets/img/Accenture_Logo.svg">
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <div id="name">
      <b>{{ adminname }}</b>
    </div>
    <div>
      <button
        v-bind:class="[
          $parent.jobLevelIsNewJobs ? buttonInFocus : buttonOutFocus
        ]"
        class="button"
        @click="changeToNewJobs()"
      >
        <img class="button-image" src="../assets/img/_ionicons_svg_ios-document.svg" alt>
        <div class="button-text">New Jobs</div>
      </button>
      <button
        v-bind:class="[
          $parent.jobLevelIsNewJobs ? buttonOutFocus : buttonInFocus
        ]"
        class="button"
        @click="changeToMyJobs()"
      >
        <img class="button-image" src="../assets/img/_ionicons_svg_md-briefcase.svg" alt>
        <div class="button-text">My Jobs</div>
      </button>
    </div>
    <div class="admin-btn-grp">
      <v-btn block large depressed color="btn1" @click="registerDialog = !registerDialog">
        <v-icon left>person_add</v-icon>Register Account
        <v-spacer/>
      </v-btn>
      <v-btn block large depressed color="btn1" @click="signOut">
        <v-icon left>exit_to_app</v-icon>Logout
        <v-spacer/>
      </v-btn>
    </div>
    <div>
      <v-dialog v-model="registerDialog" max-width="600px">
        <v-card>
          <v-toolbar card dark color="primary">
            <v-toolbar-title class="headline">Register new admin</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      v-model="username"
                      :rules="usernameRules"
                      :error-messages="error_messages"
                      @update:error="toggle_error"
                      @input="update_error_message"
                      label="Username"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      :error-messages="error_messages"
                      @update:error="toggle_error"
                      @input="update_error_message"
                      label="Email"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      v-model="password"
                      :rules="passwordRules"
                      :error-messages="error_messages"
                      @update:error="toggle_error"
                      @input="update_error_message"
                      label="Password"
                      type="password"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      v-model="passwordCheck"
                      :rules="passwordCheckRules"
                      :error-messages="error_messages"
                      @update:error="toggle_error"
                      @input="update_error_message"
                      label="Confirm Password"
                      type="password"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="purple darken-1" flat @click="registerDialog = false">Close</v-btn>
            <v-btn color="purple darken-1" flat :disabled="!valid" @click="submit">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="confirmation" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Registration successful!</v-card-title>
          <v-card-text>
            New user account has been succesfully created, use it to log in
            next time.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="purple darken-1" flat="flat" @click="closeWindow">Okay</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      registerDialog: false,
      buttonInFocus: "button-in-focus",
      buttonOutFocus: "button-out-focus",
      valid: false,
      error: false,
      email: "",
      username: "",
      emailRules: [
        v => !!v || "Email is required",
        v => /.+@.+\..+/.test(v) || "Email must be valid"
      ],
      passwordCheckRules: [
        v => !!v || "Confirmation password is required",
        v => v == this.password || "password must match"
      ],
      password: "",
      passwordCheck: "",
      passwordRules: [v => !!v || "Password is required"],
      usernameRules: [v => !!v || "Username is required"],
      error_messages: [],
      confirmation: false
    };
  },
  props: ["adminname"],
  methods: {
    closeWindow() {
      this.confirmation = false;
      this.registerDialog = false;
      this.password = "";
      this.passwordCheck = "";
      this.username = "";
      this.email = "";
      this.valid = false;
      this.error = false;
    },
    submit() {
      const pass = this.$refs.form.validate();
      if (pass) {
        const email = this.email;
        const password = this.password;
        const username = this.username;

        this.$store
          .dispatch("user/register", {
            email,
            username,
            password
          })
          .then(status => {
            if (status === 1) {
              this.confirmation = true;
            } else {
              this.error = true;
              this.email = "";
              this.password = "";
              this.passwordCheck = "";
              this.username = "";
              this.error_messages.push("Invalid username or password!");
            }
          });
      }
    },
    changeToMyJobs: function() {
      if (
        this.$parent.refreshMessageListSingleton &&
        this.$route.params.jobLevel != "myjobs"
      ) {
        this.$parent.refreshMessageListSingleton = false;
        this.$parent.changeToMyJobs();
      }
    },
    changeToNewJobs: function() {
      if (
        this.$parent.refreshMessageListSingleton &&
        this.$route.params.jobLevel != "newjobs"
      ) {
        this.$parent.refreshMessageListSingleton = false;
        this.$parent.changeToNewJobs();
      }
    },
    signOut: function() {
      this.$store.dispatch("user/logout").then(status => {
        if (status === 1) {
          this.$router.replace("/login");
        } else {
          alert("Unable to logout");
        }
        // Handle the arrow animation
        const arrowIcon = document.querySelector(".arrow-icon");
        arrowIcon.classList.toggle("down");
      });
    },
    toggle_error() {
      this.error = !this.error;
    },
    update_error_message() {
      this.error_messages.pop();
    }
  }
};
</script>

<style scoped>
.logo-main {
  width: 100%;
  height: 100%;
}

#name {
  background-color: #a6b9f7;
  opacity: 0.7;
  padding-top: 19px;
  padding-bottom: 19px;
  text-align: center;
}

.admin-btn-grp {
  bottom: 0;
  position: absolute;
  width: 100%;
}

.admin-btn-grp > button {
  margin: 0;
}

.button-image {
  width: 30px;
  margin-top: 7px;
  float: left;
  opacity: 0.35;
  margin-left: 40px;
}

.button-text {
  text-align: left;
  padding: 10px;
  margin-left: 80px;
  font-size: 15px;
  color: #000000;
  opacity: 0.8;
  font-family: "HelveticaNeueMedium";
}

.button-in-focus {
  background: #f0ddf5;
}

.button-out-focus {
  background-color: #f4f4f4;
}

.button {
  display: block;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  text-decoration: none;
  cursor: pointer;
  width: 100%;
}

.button:hover {
  background: #ececec;
}

.button:focus {
  outline: none;
}
</style>