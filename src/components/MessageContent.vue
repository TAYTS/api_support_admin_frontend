<template>
  <div>
    <div class="top-outer">
      <div class="px-3 top">
        <div class="invis-text">{{ $route.params.messageID }}</div>
        <!-- There for force update -->
        <h1>{{ messageHeader.title }}</h1>
        <h2>{{ messageHeader.sender }}</h2>
        <div>{{ messageHeader.dateTime }}</div>
      </div>
      <hr />
    </div>
    <div>
      <div
        v-bind:class="[
          this.$parent.jobLevelIsNewJobs ? messagesNewJobs : messagesMyJobs
        ]"
        class="message_scroll"
      >
        <!-- Iterates through messages list for messages -->
        <div class="messages__container">
          <MessageBubble
            v-for="message in messages"
            :key="message.index"
            :message="message.message"
            :type="message.type"
            :reply="message.reply"
            @download-media="downdloadMedia(message.index)"
          ></MessageBubble>
        </div>
      </div>
    </div>
    <div>
      <div v-if="this.$parent.jobLevelIsNewJobs" class="full-row row-new-jobs">
        <v-btn
          color="#a6b9f7"
          round
          left
          class="add-jobs-button"
          @click="addtoMyJobs()"
          >Add to My Jobs</v-btn
        >
      </div>
      <div v-else class="full-row row-my-jobs">
        <v-textarea
          class="text-area"
          v-model="message"
          solo
          flat
          hide-details
          no-resize
          rows="6"
          label="Type here..."
          color="accent"
          background-color="white"
          append-icon="send"
          prepend-inner-icon="attach_file"
          @click.append-icon="sendMedia"
          @click.prepend-icon="sendMessage"
        >
          @keyup.enter="sendMessage" ></v-textarea
        >

        <!-- <div class="attachfile">
          <v-flex xs12 sm3>
            <v-btn flat icon color="accent">
              <v-icon>attach_file</v-icon>
            </v-btn>
          </v-flex>
        </div>
        <div class="sendMessage">
          <v-flex xs12 sm3>
            <v-btn
              flat
              icon
              color="accent"
              @click="sendMessage"
              align-content-end=""
            >
              <v-icon>send</v-icon>
            </v-btn>
          </v-flex>
        </div> -->
        <!-- <v-btn class="send-button" @click="sendMessage">send</v-btn> -->
      </div>
    </div>
  </div>
</template>

<script>
import MessageBubble from "@/components/MessageBubble.vue";
import EventBus from "@/store/eventBus.js";
export default {
  components: {
    MessageBubble
  },
  data() {
    return {
      id: this.$route.params.messageID,
      messagesNewJobs: "messages-new-jobs",
      messagesMyJobs: "messages-my-jobs",
      // Temporary data
      messageHeader: {
        title: "title",
        sender: "sender",
        body: "body",
        dateTime: "dateTime"
      },
      message: "",
      channel: null,
      messages: [
        {
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisos felis blandit magna. Suspendisse a massa fringilla, cursus metus non, finibus enim. Sed venenatis malesuada urna, euismod suscipit neque maximus vitae. ",
          reply: false,
          type: "text"
        },
        {
          message:
            "Loreobortis nibh, ac lobortis eros felis blandit magna. Suspendisse a massa fringilla, cursus metus non, finibus enim. Sed venenatis malesuada urna, euismod suscipit neque maximus vitae. ",
          reply: true,
          type: "text"
        },
        {
          message:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ismod suscipit neque maximus vitae. ",
          reply: false,
          type: "message"
        },
        {
          message:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet elementum nisi. Vispendisse a massa fringilla, cursus metus non, finibus enim. Sed venenatis malesuada urna, euismod suscipit neque maximus vitae. ",
          reply: true,
          type: "message"
        }
      ]
    };
  },
  methods: {
    refreshMessageContent: function() {
      // this.id = this.$route.params.messageID;
      // // Replace all id's with $route statement if app is bugging out
      // var messageID = this.$route.params.messageID;
      // var jobLevel = this.$route.params.jobLevel;
      // if (messageID == "0") {
      //   // todo replace this with opacity white box
      //   this.messageHeader.title = "";
      //   this.messageHeader.sender = "";
      //   this.messageHeader.body = "";
      //   this.messageHeader.dateTime = "";
      // } else {
      //   this.$store
      //     .dispatch("tickets/getSingleTicket", { jobLevel, messageID })
      //     .then(response => {
      //       if (response !== 0) {
      //         this.messageHeader.title = response.title;
      //         this.messageHeader.sender = response.sender;
      //         this.messageHeader.body = response.body;
      //         this.messageHeader.dateTime = response.dateTime;
      //       } else {
      //         console.log("Error in fetching the tickets");
      //       }
      //     });
      // }
    },
    addtoMyJobs: function() {
      var messageID = this.$route.params.messageID;
      this.$store
        .dispatch("tickets/moveToMyJobs", { messageID })
        .then(status => {
          if (status !== 0) {
            // loads next item in list
            this.$parent.nextItem();
            // refreshes the current list
            this.$parent.refreshMessageList();
            this.refreshMessageContent();
          } else {
            console.log("Error in fetching the tickets");
          }
        });
    },
    ticketListing() {
      this.$router.replace({ name: "TicketListing" });
    },
    sendMessage() {
      const message = this.message;
      if (message.trim() !== "") {
        this.$store
          .dispatch("messages/sendMessage", {
            message,
            id_channel: this.id
          })
          .then(status => {
            if (status) {
              this.message = "";
              this.updateMessage();
            }
          });
      } else {
        this.message = "";
      }
    },
    updateMessage() {
      this.$store
        .dispatch("messages/getMessages", { id_channel: this.id })
        .then(messages => {
          if (this.id != 0) {
            this.messages = [...messages];
          } else {
            this.messages = [];
          }
        });
    },
    downdloadMedia(index) {
      this.$store.dispatch("messages/downloadMedia", { index });
    }
  },
  mounted() {
    // EventBus.$on("refreshContent", () => {
    //   this.messages = [];
    //   this.refreshMessageContent();
    //   this.updateMessage();
    // });
  }
  // updated() {
  //   this.refreshMessageContent();
  // }
};
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 2px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 20px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #808080;
}

.message__container {
  margin: 5px 0;
  width: 100%;
  right: 0;
  padding: 0 10px 0 10px;
  height: 100%;
}

.text-area {
  margin: 5px 50px;
  width: calc(100% - 850px);
  resize: none;
  height: calc(100% - 34px);
  background-color: #f4f4f4;
  border: 1px solid lightgrey;
}

.messages-new-jobs {
  margin: 9px 0px 5px 0;
  top: 127px;
  height: calc(100% - 70px);
  width: calc(100% - 750px);
  display: block;
  overflow: auto;
  position: fixed;
  background-color: #f4f4f4;
  /* display: inline-block; */
}
.messages-my-jobs {
  margin: 9px 0 5px 0;
  top: 127px;
  height: calc(100% - 250px);
  width: calc(100% - 750px);
  display: block;
  overflow: auto;
  position: fixed;
  background-color: #f4f4f4;
  /* padding-bottom: 210px; */
  /* background-color: aqua; */
  /* display: inline-block; */
}
.full-row {
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #f4f4f4;
  padding-bottom: 15px;
}

.row-new-jobs {
  height: 100px;
  width: calc(100% - 750px);
  text-align: center;
  height: calc(100% - 700px);
}

.top-outer {
  position: fixed;
  width: 100%;
  background-color: white;
  display: block;
  color: #8099ec;
  font-family: sans-serif;
  height: calc(100% - 200px);
  margin-bottom: 0;
  padding-bottom: 0;
  font-size: 20px;
}
.top {
  height: 135px;
}
.add-jobs-button {
  width: 180px;
  background-color: #000000;
  height: 60px;
}

.invis-text {
  font-size: 0;
  background-color: #000000;
  color: #f4f4f4;
}
</style>
