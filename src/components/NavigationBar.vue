<template>
  <v-navigation-drawer fixed permanent absolute width="175">
    <div id="logo-bg">
      <div id="logo-main">
        <img src="../assets/img/Accenture_Support_Staff.svg" alt />
      </div>
    </div>
    <div id="name-bg">
      <div id="name-main">
        <b>{{ adminName }}</b>
      </div>
    </div>
    <div>
      <button
        v-bind:class="[
          $parent.jobLevelIsNewJobs ? buttonInFocus : buttonOutFocus
        ]"
        class="button"
        @click="changeToNewJobs()"
      >
        <img
          class="button-image"
          src="../assets/img/_ionicons_svg_ios-document.svg"
          alt
        />
        <div class="button-text">New Jobs</div>
      </button>
      <button
        v-bind:class="[
          $parent.jobLevelIsNewJobs ? buttonOutFocus : buttonInFocus
        ]"
        class="button"
        @click="changeToMyJobs()"
      >
        <img
          class="button-image"
          src="../assets/img/_ionicons_svg_md-briefcase.svg"
          alt
        />
        <div class="button-text">My Jobs</div>
      </button>
    </div>
    <div>
      <v-dialog v-model="dialog" max-width="600px">
        <template v-slot:activator="{ on }">
          <!-- <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
          <div class="register">
            <button class="button" v-on="on">
              <img
                class="button-image"
                src="../assets/img/_ionicons_svg_md-person-add.svg"
                alt
              />
              <div class="button-text">Register Account</div>
            </button>
          </div>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Register new admin</span>
          </v-card-title>
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
            <v-btn color="purple darken-1" flat @click="dialog = false"
              >Close</v-btn
            >
            <v-btn
              color="purple darken-1"
              flat
              :disabled="!valid"
              @click="submit()"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="confirmation" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Registration successful!</v-card-title>

          <v-card-text
            >New user account has been succesfully created, use it to log in
            next time.</v-card-text
          >

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="purple darken-1" flat="flat" @click="closeWindow()"
              >Okay</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="logout">
      <button class="button logout-button" @click="signOut()">
        <img
          class="button-image"
          src="../assets/img/_ionicons_svg_ios-log-out.svg"
          alt
        />
        <div class="button-text">Logout</div>
      </button>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
#logo-bg {
  background-color: #f7e8ff;
  padding-top: 10px;
}

#logo-main {
  width: 130px;
  margin: auto;
  padding-right: 4px;
}

#name-bg {
  background-color: #dedede;
  padding-top: 15px;
  padding-bottom: 15px;
}

#name-main {
  text-align: center;
}

.logout-button:focus {
  outline: none;
  background: #f0ddf5;
}

.register {
  bottom: 45px;
  position: absolute;
  background: #eeeeee;
  width: 100%;
}

.logout {
  bottom: 0;
  position: absolute;
  background: #e0e0e0;
  width: 100%;
}
.button-image {
  width: 30px;
  margin-top: 7px;
  float: left;
  margin-left: 30px;
}

.button-text {
  text-align: left;
  padding: 10px;
  margin-left: 60px;
  font-size: 18px;
  color: #000000;
}

.button-in-focus {
  background: #f0ddf5;
}

.button-out-focus {
  background-color: #ffffff;
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
  background: #fafafa;
}

.button:focus {
  outline: none;
}
</style>

<script>
export default {
  data() {
    return {
      dialog: false,
      adminName: "Insert admin name here",
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
  methods: {
    closeWindow() {
      this.confirmation = false;
      this.dialog = false;
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
        this.confirmation = true;

        this.$store
          .dispatch("user/register", {
            email,
            password
          })
          .then(status => {
            if (status === 1) {
              this.$router.replace("/");
            } else {
              this.error = true;
              this.email = "";
              this.password = "";
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
