<template>
  <v-navigation-drawer fixed permanent absolute width="175">
    <div id="logo-bg">
      <div id="logo-main">
        <img src="../assets/img/Accenture_Support_Staff.svg" alt>
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
    <div class="register">
      <v-btn block large depressed height="56px" color="#e0e0e0" v-on:click="activateDialog">
        <v-icon>person_add</v-icon>Register Account
      </v-btn>
    </div>
    <registration-dialog/>
    <div class="logout">
      <button class="button logout-button" @click="signOut()">
        <img class="button-image" src="../assets/img/_ionicons_svg_ios-log-out.svg" alt>
        <div class="button-text">Logout</div>
      </button>
    </div>
  </v-navigation-drawer>
</template>

<script>
import RegistrationDialog from "@/components/RegistrationDialog.vue";
import EventBus from "@/store/eventBus.js";
export default {
  components: {
    RegistrationDialog
  },
  data() {
    return {
      adminName: "Insert admin name here",
      buttonInFocus: "button-in-focus",
      buttonOutFocus: "button-out-focus"
    };
  },
  methods: {
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
    activateDialog() {
      EventBus.$emit("openRegistrationDialog");
    }
  }
};
</script>

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

.register {
  bottom: 45px;
  position: absolute;
  width: 100%;
}

.register > button {
  margin: 0;
}
</style>