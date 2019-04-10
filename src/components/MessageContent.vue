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
      <hr>
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
        <v-btn class="add-jobs-button" @click="addtoMyJobs()">Add to My Jobs</v-btn>
      </div>
      <div v-else class="full-row row-my-jobs">
        <v-textarea
          class="text-area"
          v-model="message"
          solo
          flat
          hide-details
          no-resize
          rows="5"
          label="Type here..."
          prepend-inner-icon="attach_file"
          color="accent"
          background-color="lightbackground"
          @keyup.enter="sendMessage"
        ></v-textarea>
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
      messages: []
    };
  },
  methods: {
    refreshMessageContent: function() {
      this.id = this.$route.params.messageID;

      // Replace all id's with $route statement if app is bugging out
      var messageID = this.$route.params.messageID;
      var jobLevel = this.$route.params.jobLevel;
      if (messageID == "0") {
        // todo replace this with opacity white box
        this.messageHeader.title = "";
        this.messageHeader.sender = "";
        this.messageHeader.body = "";
        this.messageHeader.dateTime = "";
      } else {
        this.$store
          .dispatch("tickets/getSingleTicket", { jobLevel, messageID })
          .then(response => {
            if (response !== 0) {
              this.messageHeader.title = response.title;
              this.messageHeader.sender = response.sender;
              this.messageHeader.body = response.body;
              this.messageHeader.dateTime = response.dateTime;
            } else {
              console.log("Error in fetching the tickets");
            }
          })
          .catch(error => {
            console.log("Error in ticketID");
            this.messageHeader.title = "";
            this.messageHeader.sender = "";
            this.messageHeader.body = "";
            this.messageHeader.dateTime = "";
          });
      }
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
    const messageContainer = document.querySelector(".message_scroll");
    this.channel = this.$store.getters["messages/getChannel"](this.id);
    this.$store
      .dispatch("messages/getMessages", { id_channel: this.id })
      .then(messages => {
        this.messages = [...messages];
        // Scroll to the bottom of the message container
        setTimeout(() => {
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }, 1);
        if (this.channel) {
          this.channel.on("messageAdded", this.updateMessage);
        }
      });
    EventBus.$on("refreshContent", () => {
      this.messages = [];
      this.refreshMessageContent();
      this.updateMessage();
    });
  }
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
  margin: 15px;
  width: calc(100% - 705px);
  height: 90%;
  resize: none;
  background-color: white;
  border: 1px solid lightgrey;
}
.messages-new-jobs {
  margin: 5px 0 5px 0;
  top: 120px;
  height: calc(100% - 165px);
  width: calc(100% - 675px);
  display: block;
  overflow: auto;
  position: fixed;
  /* background-color: aqua; */
  /* display: inline-block; */
}
.messages-my-jobs {
  margin: 5px 0 5px 0;
  top: 120px;
  height: calc(75% - 125px);
  width: calc(100% - 675px);
  display: block;
  overflow: auto;
  position: fixed;
  /* padding-bottom: 210px; */
  /* background-color: aqua; */
  /* display: inline-block; */
}
.full-row {
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #fafafa;
}

.row-new-jobs {
  height: 50px;
}

.row-my-jobs {
  height: 25%;
}
.top-outer {
  position: fixed;
  width: 100%;
  background-color: white;
  display: block;
  height: 20%;
  margin-bottom: 0;
  padding-bottom: 0;
}
.top {
  height: 125px;
}
.add-jobs-button {
  width: calc(100% - 675px);
  z-index: 99;
  height: 40px;
}
.invis-text {
  font-size: 0;
}
</style>
