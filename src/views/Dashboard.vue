<template>
  <div id="outerDiv">
    <div class="split left" />
    <div class="split right">
      <message-content />
    </div>

    <navigation-bar />
    <message-list id="messagelist" />
  </div>
</template>

<style scoped>
#messagelist {
  margin-left: 175px;
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

/* Control the left side */
.left {
  left: 0;
  width: 675px;
}

/* Control the right side */
.right {
  right: 0;
  width: calc(100% - 675px);
  background-color: white;
}
</style>

<script>
import NavigationBar from "@/components/NavigationBar.vue";
import MessageList from "@/components/MessageList.vue";
import MessageContent from "@/components/MessageContent.vue";

export default {
  data() {
    return {
      items: [],
      jobLevel: this.$route.params.jobLevel,
      messageID: this.$route.params.messageID,
      lastNewJobs: 0,
      lastMyJobs: 0,
      selectedMsgNo: 0,
      changedCache: false,
      refreshMessageListSingleton: true
    };
  },
  components: {
    NavigationBar,
    MessageList,
    MessageContent
  },
  methods: {
    changeToNewJobs: function() {
      this.jobLevel = "newjobs";
      this.changedCache = true;
      this.refreshMessageList();
    },
    changeToMyJobs: function() {
      this.jobLevel = "myjobs";
      this.changedCache = true;
      this.refreshMessageList();
    },
    refreshMessageList: function() {
      this.items = [];
      // Pull data from the database
      var jobLevel = this.jobLevel;
      var messageID = this.$route.params.messageID;
      this.$store
        .dispatch("tickets/getTickets", { jobLevel })
        .then(response => {
          if (response !== 0) {
            //check if first visit, loads latest message
            if (this.changedCache) {
              var lastTicket =
                jobLevel == "myjobs" ? this.lastMyJobs : this.lastNewJobs;
              //loads previous job task if it's its jobs/0
              //if the loaded job is 0, then load the latest item
              lastTicket =
                lastTicket == "0" ? response[0].ticketID : lastTicket;
            } else {
              var lastTicket = messageID == "0" ? response[0].ticketID : messageID;
            }
            var latestTicketRoute = "/" + jobLevel + "/" + lastTicket;
            this.$router.replace(latestTicketRoute);

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
              this.refreshMessageListSingleton = true;
            }
          } else {
            console.log("Error in fetching the tickets");
          }
        });
    },
    nextItem: function() {
      // Loads the next post once current post has been added to 'myjobs'
      // Todo: Improve code for effeciency
      var found = false;
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].postID == this.$route.params.messageID) {
          found = true;
        } else if (found) {
          if (this.items[i].postID != undefined) {
            this.$router.push(
              "/" + this.$route.params.jobLevel + "/" + this.items[i].postID
            );
            break;
          }
        }
      }
    }
  },
  mounted() {
    this.refreshMessageList();
        // 1. Check if the user has been authenticate
    this.$store.dispatch("user/authenticate", {}).then(status => {
      // 1.2 Redirect to login page if the user is not authenticated
      if (status === 0) {
        this.$router.replace("/login");
      }
      // 1.1 Render the user page if the user is authenticated
    });
  }
};
</script>
