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
      jobLevel: this.$route.params.jobLevel
    };
  },
  components: {
    NavigationBar,
    MessageList,
    MessageContent
  },
  methods: {
    changeToNewJobs: function() {
      this.items = [];
      this.jobLevel = "newjobs";
      this.refreshMessageList();
    },
    changeToMyJobs: function() {
      this.items = [];
      this.jobLevel = "myjobs";
      this.refreshMessageList();
    },
    refreshMessageList: function() {
      // Pull data from the database
      console.log("function calledaaaaaaaaaaaaaaaaaaaaaaaaaa");
      var jobLevel = this.jobLevel;
      this.$store
        .dispatch("tickets/getTickets", { jobLevel })
        .then(response => {
          if (response !== 0) {
            var i;
            var headerCheck = {
              Today: 0,
              Yesterday: 0,
              Older: 0
            };
            var today = new Date();
            var yesterday = new Date(
              new Date().setDate(new Date().getDate() - 1)
            );

            for (i = 0; i < response.length; i++) {
              var postDate = new Date(response[i].dateTime);
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
              if (
                (headerCheck["Older"] == 0 &&
                  postDate.getDate() < yesterday.getDate()) ||
                postDate.getMonth() < yesterday.getMonth() ||
                postDate.getFullYear() < yesterday.getFullYear()
              ) {
                headerCheck["Older"] = 1;
                this.items.push({
                  header: "Older Tickets"
                });
              }
              this.items.push({
                title: response[i].title,
                subtitle: response[i].body,
                divider: true,
                inset: true,
                postID: response[i].postID
              });
            }
          } else {
            console.log("Error in fetching the tickets");
          }
        });
    }
  },
  mounted() {
    this.refreshMessageList();
  }
  // mounted() {
  //   // 1. Check if the user has been authenticate
  //   this.$store.dispatch("user/authenticate", {}).then(status => {
  //     // 1.2 Redirect to login page if the user is not authenticated
  //     if (status === 0) {
  //       this.$router.replace("/login");
  //     }
  //     // 1.1 Render the user page if the user is authenticated
  //   });
  // }
};
</script>
