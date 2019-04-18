<template>
  <div id="outerDiv">
    <div class="right">
      <MessageContent v-show="items.length > 0 && !showSplashFiltered"/>
      <SplashMessage :message="splashMessage" v-show="items.length === 0 || showSplashFiltered"/>
    </div>
    <Navigation-bar :adminname="adminName"/>
    <MessageList id="messagelist"/>
  </div>
</template>



<script>
import NavigationBar from "@/components/NavigationBar.vue";
import MessageList from "@/components/MessageList.vue";
import MessageContent from "@/components/MessageContent.vue";
import EventBus from "@/store/eventBus.js";
import SplashMessage from "@/components/SplashMessage.vue";

export default {
  data() {
    return {
      items: [],
      jobLevel: this.$route.params.jobLevel,
      messageID: this.$route.params.messageID,
      lastNewJobs: 0,
      lastMyJobs: 0,
      selectedMsgNo: 0,
      refreshMessageListSingleton: true,
      timer: "",
      jobLevelIsNewJobs: this.$route.params.jobLevel == "newjobs",
      adminName: "",
      splashMessage: "",
      showSplashFiltered: false
    };
  },
  components: {
    NavigationBar,
    MessageList,
    MessageContent,
    SplashMessage
  },
  methods: {
    changeToNewJobs: function() {
      this.lastMyJobs = this.$route.params.messageID;
      this.$router.replace("/newjobs/" + this.lastNewJobs);
      this.refreshMessageList();
    },
    changeToMyJobs: function() {
      this.lastNewJobs = this.$route.params.messageID;
      this.$router.replace("/myjobs/" + this.lastMyJobs);
      this.refreshMessageList();
    },
    openMessage: function(index, postID) {
      this.$router.push("/" + this.$route.params.jobLevel + "/" + postID);
      this.selectedMsgNo = index;
      this.refreshHighlight();
      EventBus.$emit("refreshContent");
    },
    refreshMessageList: function() {
      // Pull data from the database
      var jobLevel = this.$route.params.jobLevel;
      var messageID = this.$route.params.messageID;
      this.jobLevelIsNewJobs = this.$route.params.jobLevel == "newjobs";
      var lastTicket;
      var latestTicketRoute;
      this.$store
        .dispatch("tickets/getTickets", { jobLevel })
        .then(response => {
          this.items = [];
          if (messageID === "0") {
            if (response[0]) {
              latestTicketRoute = "/" + jobLevel + "/" + response[0].ticketID;
            } else {
              latestTicketRoute = "/" + jobLevel + "/0";
              if (jobLevel === "newjobs") {
                this.splashMessage = "No New Job At The Moment...";
              } else if (jobLevel === "myjobs") {
                this.splashMessage = "No Job At The Momment...";
              }
            }
            this.$router.replace(latestTicketRoute);
          }
          var i;
          var headerCheck = {
            Today: 0,
            Yesterday: 0,
            Older: 0,
            twoWeeks: 0,
            oneWeek: 0,
            thisWeek: 0
          };
          var today = new Date();
          var yesterday = new Date(
            new Date().setDate(new Date().getDate() - 1)
          );
          var oneWeek = new Date(new Date().setDate(new Date().getDate() - 7));
          var twoWeeks = new Date(
            new Date().setDate(new Date().getDate() - 14)
          );

          for (i = 0; i < response.length; i++) {
            var postDate = new Date(response[i].last_activity);
            if (headerCheck["twoWeeks"] == 0 && postDate < twoWeeks) {
              headerCheck["twoWeeks"] = 1;
              this.items.push({
                header: "Older than two weeks"
              });
            }
            if (
              headerCheck["oneWeek"] == 0 &&
              postDate < oneWeek &&
              postDate > twoWeeks
            ) {
              headerCheck["oneWeek"] = 1;
              this.items.push({
                header: "Last week"
              });
            }
            if (
              headerCheck["thisWeek"] == 0 &&
              postDate < yesterday &&
              postDate > oneWeek &&
              !(
                postDate.getDate() == yesterday.getDate() &&
                postDate.getMonth() == yesterday.getMonth() &&
                postDate.getFullYear() == yesterday.getFullYear()
              )
            ) {
              headerCheck["thisWeek"] = 1;
              this.items.push({
                header: "This week"
              });
            }
            if (
              headerCheck["Today"] == 0 &&
              postDate.getDate() == today.getDate() &&
              postDate.getMonth() == today.getMonth() &&
              postDate.getFullYear() == today.getFullYear()
            ) {
              headerCheck["Today"] = 1;
              this.items.push({
                header: "Today"
              });
            }
            if (
              headerCheck["Yesterday"] == 0 &&
              postDate.getDate() == yesterday.getDate() &&
              postDate.getMonth() == yesterday.getMonth() &&
              postDate.getFullYear() == yesterday.getFullYear()
            ) {
              headerCheck["Yesterday"] = 1;
              this.items.push({
                header: "Yesterday"
              });
            }
            this.items.push({
              title: response[i].title,
              subtitle: response[i].last_activity,
              divider: true,
              inset: true,
              postID: response[i].ticketID,
              category: response[i].category,
              selected:
                response[i].ticketID ==
                (lastTicket == 0 ? response[0].ticketID : lastTicket)
            });
          }

          this.refreshHighlight();
          EventBus.$emit("refreshContent");
          this.refreshMessageListSingleton = true;
        });
    },
    refreshHighlight: function() {
      var messageID = this.$route.params.messageID;

      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i]["postID"] == messageID) {
          this.items[i]["selected"] = true;
        } else {
          this.items[i]["selected"] = false;
        }
      }
    },
    nextItem: function() {
      // Loads the next post once current post has been added to 'myjobs'
      // Todo: Improve code for effeciency
      var found = false;
      var done = false;
      if (this.items.length != 0) {
        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i].postID == this.$route.params.messageID) {
            found = true;
          } else if (found) {
            if (this.items[i].postID) {
              this.$router.push(
                "/" + this.$route.params.jobLevel + "/" + this.items[i].postID
              );
              done = true;
              break;
            }
          }
        }
        if (!done) {
          for (var i = this.items.length - 2; i >= 0; i--) {
            if (this.items[i].postID) {
              this.$router.push(
                "/" + this.$route.params.jobLevel + "/" + this.items[i].postID
              );
              done = true;
              break;
            }
          }
          if (!done) {
            this.$router.push("/" + this.$route.params.jobLevel + "/0");
            this.items = [];
            this.refreshMessageList;
          }
        }
      } else {
        this.$router.push("/" + this.$route.params.jobLevel + "/0");
      }
    }
  },
  mounted() {
    // Below line is to autorefresh message list every 2s
    // this.timer = setInterval(this.refreshMessageList, 2000)

    // 1. Check if the user has been authenticate
    this.$store.dispatch("user/authenticate").then(status => {
      if (status === 1) {
        this.refreshMessageList();
        // 1.1 Render the user page if the user is authenticated
        const adminName = this.$store.getters["user/getUsername"];
        this.adminName = adminName;
        // Get the Twilio access token (assume that it will success)
        this.$store.dispatch("messages/initClient").then(status => {
          if (status === 1) {
            EventBus.$emit("refreshContent");
          }
        });
      } else {
        // 1.2 Redirect to login page if the user is not authenticated
        this.$router.replace("/login");
      }
    });
  }
};
</script>

<style scoped>
#messagelist {
  left: 250px;
  top: 0;
  z-index: 10;
  position: absolute;
  height: 100vh;
}
#outerDiv {
  overflow: hidden;
}

/* Control the right side */
.right {
  height: 100vh;
  width: calc(100vw - 250px - 480px);
  position: absolute;
  z-index: 1;
  top: 0;
  left: calc(250px + 480px);
  overflow-x: hidden;
  background-color: white;
}
</style>