<template>
  <div id="outerDiv">
    <div class="split right">
      <message-content />
    </div>
    <navigation-bar />
    <message-list id="messagelist" />
  </div>
</template>



<script>
import NavigationBar from "@/components/NavigationBar.vue";
import MessageList from "@/components/MessageList.vue";
import MessageContent from "@/components/MessageContent.vue";
import EventBus from "@/store/eventBus.js";

export default {
  data() {
    return {
      items: [
        {
          header: "Two weeks ago",
          divider: true
        },
        {
          title: "Brunch this weekend?",
          subtitle: "06 Apr 2019 11:46 PM",
          divider: true,
          inset: true
        },
        {
          header: "Two weeks ago",
          divider: true
        },
        {
          title: "Brunch this weekend?",
          subtitle: "06 Apr 2019 11:46 PM",
          divider: true,
          inset: true
        },
        {
          title: "Brunch this weekend?",
          subtitle: "06 Apr 2019 11:46 PM",
          divider: true,
          inset: true
        },
        {
          title: "Brunch this weekend?",
          subtitle: "06 Apr 2019 11:46 PM",
          divider: true,
          inset: true
        }
      ],
      jobLevel: this.$route.params.jobLevel,
      messageID: this.$route.params.messageID,
      lastNewJobs: 0,
      lastMyJobs: 0,
      selectedMsgNo: 0,
      refreshMessageListSingleton: true,
      timer: "",
      jobLevelIsNewJobs: this.$route.params.jobLevel == "newjobs"
    };
  },
  components: {
    NavigationBar,
    MessageList,
    MessageContent
  },
  methods: {
    changeToNewJobs: function() {
      this.lastMyJobs = this.$route.params.messageID;
      this.$router.replace("/newjobs/" + this.lastNewJobs);
      // this.refreshMessageList();
      this.refreshMessageListSingleton = true;
      this.jobLevelIsNewJobs = this.$route.params.jobLevel == "newjobs";
    },
    changeToMyJobs: function() {
      this.lastNewJobs = this.$route.params.messageID;
      this.$router.replace("/myjobs/" + this.lastMyJobs);
      // this.refreshMessageList();
      this.refreshMessageListSingleton = true;
      this.jobLevelIsNewJobs = this.$route.params.jobLevel == "newjobs";
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
          if (response !== 0) {
            this.items = [];
            if (messageID == "0") {
              if (response[0]) {
                latestTicketRoute = "/" + jobLevel + "/" + response[0].ticketID;
              } else {
                latestTicketRoute = "/" + jobLevel + "/0";
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
            var oneWeek = new Date(
              new Date().setDate(new Date().getDate() - 7)
            );
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
                selected:
                  response[i].ticketID ==
                  (lastTicket == 0 ? response[0].ticketID : lastTicket)
              });
            }
          } else {
            console.log("Error in fetching the tickets");
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
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].postID == this.$route.params.messageID) {
          found = true;
          console.log("found it!");
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
        }
      }
    }
  },
  mounted() {
    // this.refreshMessageList();
    EventBus.$emit("refreshContent");
    // Below line is to autorefresh message list every 2s
    // this.timer = setInterval(this.refreshMessageList, 2000)

    // 1. Check if the user has been authenticate
    // this.$store.dispatch("user/authenticate").then(status => {
    //   // 1.2 Redirect to login page if the user is not authenticated
    //   if (status === 0) {
    //     this.$router.replace("/login");
    //   } else {
    //     // Get the Twilio access token (assume that it will success)
    //     this.$store.dispatch("messages/initClient").then(status => {
    //       if (status === 1) {
    //         this.$refs.messageContent.updateMessage();
    //       }
    //     });
    //   }
    //   // 1.1 Render the user page if the user is authenticated
    // });
  }
};
</script>

<style scoped>
#messagelist {
  margin-left: 250px;
}
#outerDiv {
  overflow: hidden;
}
.split {
  height: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  overflow-x: hidden;
}


/* Control the right side */
.right {
  right: 0;
  width: calc(100% - 750px);
  background-color: white;
}
</style>