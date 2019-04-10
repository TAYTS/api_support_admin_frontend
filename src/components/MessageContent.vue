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
        v-bind:class="[this.$parent.jobLevelIsNewJobs ? messagesNewJobs : messagesMyJobs]"
        class="message_scroll"
      >
        <!-- Iterates through messages list for messages -->
        <div v-show="!messageReady" class="message-loader">
          <v-progress-circular :size="120" :width="10" indeterminate color="primary"></v-progress-circular>
        </div>
        <div v-show="messageReady" class="messages__container">
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
          @click:prepend-inner.stop="addFiles"
        ></v-textarea>
        <!-- <v-btn class="send-button" @click="sendMessage">send</v-btn> -->
      </div>
    </div>
    <input
      class="file-upload"
      type="file"
      multiple="true"
      ref="upload"
      @change="handleAddFiles($event.target.files)"
    >
    <v-dialog class="upload-dialog" v-model="dialog" persistent max-width="600px" lazy>
      <v-card>
        <v-toolbar dark color="accent">
          <v-toolbar-title class="title text-xs-center">Confirm Upload</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-select
              color="accent"
              v-model="files"
              label="Files"
              append-icon
              prepend-icon="attach_file"
              readonly
              return-object
              multiple
              :hint="uploadHint"
              persistent-hint
              item-text="name"
              item-value="name"
              :items="files"
              @click:prepend.stop="addFiles"
            >
              <template slot="selection" slot-scope="props">
                <v-chip
                  class="chip--select-multi"
                  close
                  :key="props.item.name"
                  @input="removeFile(props.index)"
                >{{ props.item.name }}</v-chip>
              </template>
            </v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red lighten-2" :disabled="uploading" @click="cancelUpload">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="accent"
            :loading="uploading"
            :disabled="uploading"
            @click.prevent="confirmUpload"
          >Confirm</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      messages: [],
      dialog: false,
      files: [],
      fileSize: 0,
      maxFileSize: 10485760, // 10MB
      acceptFileTypes: ["application/pdf", "image/jpeg", "image/png"],
      uploadHint: "Max limit 10MB. (Supported format: .pdf, .jpg, .jpeg, .png)",
      uploading: false,
      messageReady: false
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
      const messageContainer = document.querySelector(".message_scroll");
      this.$store
        .dispatch("messages/getMessages", { id_channel: this.id })
        .then(messages => {
          if (this.id != 0) {
            this.messages = [...messages];
            // Scroll to the bottom of the message container
            setTimeout(() => {
              messageContainer.scrollTop = messageContainer.scrollHeight;
            }, 1);
          } else {
            this.messages = [];
          }
        });
    },
    downdloadMedia(index) {
      this.$store.dispatch("messages/downloadMedia", { index });
    },
    addFiles() {
      this.$refs.upload.click();
    },
    removeFile(key) {
      const size = this.files[key].size;
      this.fileSize -= size;
      this.files.splice(key, 1);
      this.files = [...this.files]; // Replace with new object
      if (this.files.length === 0) {
        this.uploading = true;
        this.dialog = false;
      }
    },
    handleAddFiles(files) {
      let maxLimit;
      let fileTypeErr = 0;
      if (files.length === 0) {
        return;
      }

      const types = this.acceptFileTypes;

      for (let i = 0, file, push; i < files.length; i++) {
        file = files[i];
        // Check allowed file types
        push = this.acceptFileTypes.includes(file.type);
        if (push === false) {
          this.snackbar = true;
          this.snackbarText =
            "Unsupported file format. (Supported format: .pdf, .jpg, .jpeg, .png)";
        }
        // Check no duplicate files
        for (let j = 0, item; j < this.files.length; j++) {
          item = this.files[j];
          if (item.name === file.name) {
            push = false;
            break;
          }
        }
        // Check the total uploaded files size
        push = this.fileSize + file.size > this.maxFileSize ? false : push;
        maxLimit = this.fileSize + file.size > this.maxFileSize ? true : false;
        // if the file upload greater than the maximum limit
        // notify the user through snackbar
        if (maxLimit) {
          this.snackbar = true;
          this.snackbarText =
            "Some files are unable to upload due upload limit.";
        }
        if (push) {
          this.fileSize += file.size;
          this.files.push({
            name: file.name,
            type: file.type,
            size: file.size,
            file
          });
        }
      }
      this.$refs.upload.value = "";

      // Prompt dialog
      if (this.files.length > 0) {
        this.dialog = true;
        this.uploading = false;
      } else {
        this.dialog = false;
        this.uploading = false;
      }
    },
    cancelUpload() {
      this.fileSize = 0;
      this.files = [];
      this.dialog = false;
    },
    confirmUpload() {
      // Send media files
      const files = this.files;
      const id_channel = this.id;
      this.uploading = true;
      this.$store
        .dispatch("messages/sendMedia", { files, id_channel })
        .then(status => {
          if (status > 0) {
            // Success
            // Clear the buffer
            this.fileSize = 0;
            this.files = [];
            this.dialog = false;
          }
        });
    }
  },
  mounted() {
    this.$store
      .dispatch("messages/getMessages", { id_channel: this.id })
      .then(messages => {
        this.messages = [...messages];
      });
    EventBus.$on("refreshContent", () => {
      this.messages = [];
      this.messageReady = false;
      this.refreshMessageContent();
      this.updateMessage();

      // Ge the current ticket channel descriptor
      const channelDes = this.$store.getters["messages/getChannel"](this.id);

      if (channelDes) {
        channelDes.getChannel().then(channel => {
          this.channel = channel;
          // Add event listener to the channel
          this.channel.on("messageAdded", this.updateMessage);
          setTimeout(() => {
            this.messageReady = true;
          }, 500);
        });
      }
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

.message-loader {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
