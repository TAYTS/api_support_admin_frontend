<template>
  <v-navigation-drawer class="greyhue" fixed permanent absolute width="250">
    <v-toolbar flat color="primary">
      <v-list>
        <v-list-tile>
          <img class="logo-main" src="../assets/img/Accenture_Logo.svg">
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <AlienAvatar class="avatar"/>
    <div id="name">{{ adminname }}</div>
    <div>
      <button
        v-bind:class="[
          $parent.jobLevelIsNewJobs ? buttonInFocus : buttonOutFocus
        ]"
        class="button"
        @click="changeToNewJobs"
      >
        <img class="button-image" src="../assets/img/_ionicons_svg_ios-document.svg" alt>
        <div class="button-text">New Jobs</div>
      </button>
      <button
        v-bind:class="[
          $parent.jobLevelIsNewJobs ? buttonOutFocus : buttonInFocus
        ]"
        class="button"
        @click="changeToMyJobs"
      >
        <img class="button-image" src="../assets/img/_ionicons_svg_md-briefcase.svg" alt>
        <div class="button-text">My Jobs</div>
      </button>
    </div>
    <div class="admin-btn-grp">
      <v-btn block large depressed color="btn1" @click="activateDialog">
        <v-icon left>person_add</v-icon>Register Account
        <v-spacer/>
      </v-btn>
      <v-btn block large depressed color="btn1" @click="signOut">
        <v-icon left>exit_to_app</v-icon>Logout
        <v-spacer/>
      </v-btn>
    </div>
    <RegistrationDialog/>
  </v-navigation-drawer>
</template>

<script>
import RegistrationDialog from "@/components/RegistrationDialog.vue";
import AlienAvatar from "@/components/AlienAvatar.vue";
import EventBus from "@/store/eventBus.js";

export default {
  components: {
    RegistrationDialog,
    AlienAvatar
  },
  data() {
    return {
      adminName: "Insert admin name here",
      buttonInFocus: "button-in-focus",
      buttonOutFocus: "button-out-focus"
    };
  },
  props: ["adminname"],
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
      });
    },
    activateDialog() {
      EventBus.$emit("openRegistrationDialog");
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
  padding: 5px 0;
  text-align: center;
  font-size: 18px;
}

.avatar {
  height: 28vh;
  background: #a6b9f7;
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

.register {
  bottom: 45px;
  position: absolute;
  width: 100%;
}

.register > button {
  margin: 0;
}
</style>