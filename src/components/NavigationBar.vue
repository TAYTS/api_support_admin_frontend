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
      <router-link style="text-decoration: none;" to="/newjobs/0">
        <button
          v-bind:class="[jobLevelIsNewJobs ? buttonInFocus : buttonOutFocus]"
          class="button"
          @click="changeToNewJobs()"
        >
          <img
            class="button-image"
            src="../assets/img/_ionicons_svg_ios-document.svg"
            alt
          />
          <div class="button-text">
            New Jobs
          </div>
        </button>
      </router-link>
      <router-link style="text-decoration: none;" to="/myjobs/0">
        <button
          v-bind:class="[jobLevelIsNewJobs ? buttonOutFocus : buttonInFocus]"
          class="button"
          @click="changeToMyJobs()"
        >
          <img
            class="button-image"
            src="../assets/img/_ionicons_svg_md-briefcase.svg"
            alt
          />
          <div class="button-text">
            My Jobs
          </div>
        </button>
      </router-link>
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
  background: #f0f0f0;
}

.button:active {
  background: #ffffff;
  transition-duration: 0.1s;
}

.button:focus {
  outline: 0;
  background: #f0ddf5;
  transition-duration: 0.1s;
}
</style>

<script>
export default {
  data() {
    return {
      adminName: "Insert admin name here",
      jobLevelIsNewJobs: true,
      buttonInFocus: "button-in-focus",
      buttonOutFocus: "button-out-focus"
    };
  },
  methods: {
    changeToMyJobs: function() {
      if (this.$parent.refreshMessageListSingleton) {
        this.$parent.refreshMessageListSingleton = false;
        this.jobLevelIsNewJobs = false;
        this.$parent.changeToMyJobs();
      }
    },
    changeToNewJobs: function() {
      if (this.$parent.refreshMessageListSingleton) {
        this.$parent.refreshMessageListSingleton = false;
        this.jobLevelIsNewJobs = true;
        this.$parent.changeToNewJobs();
      }
    },
    mounted() {
      var jobLevel = this.$route.params.jobLevel;
      if (jobLevel == "newjobs") {
        this.jobLevelIsNewJobs = true;
      } else {
        this.jobLevelIsNewJobs = false;
      }
    }
  }
};
</script>
