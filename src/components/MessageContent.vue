<template>
  <div class="main__container">
    <div class="header__container">
      <h1>{{ messageHeader.title }}</h1>
      <h2>{{ messageHeader.sender }}</h2>
      <div>{{ messageHeader.dateTime }}</div>
    </div>
    <div v-show="!messageReady" class="message-loader">
      <v-progress-circular :size="120" :width="10" indeterminate color="primary"></v-progress-circular>
    </div>
    <!-- Iterates through messages list for messages -->
    <div v-show="messageReady" class="messages__container">
      <MessageBubble
        v-for="message in messages"
        :key="message.index"
        :message="message.message"
        :type="message.type"
        :index="message.index"
        :reply="message.reply"
        @download-media="downdloadMedia(message.index)"
      ></MessageBubble>
    </div>
    <div class="action__container">
      <v-btn
        v-if="this.$parent.jobLevelIsNewJobs"
        color="#a6b9f7"
        round
        large
        @click="addtoMyJobs()"
      >Add to My Jobs</v-btn>
      <v-textarea
        v-else
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
        @click:append.stop="sendMessage"
        @click:prepend-inner.stop="addFiles"
        @keyup.enter="sendMessage"
      ></v-textarea>
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
    <v-snackbar v-model="snackbar" bottom>
      {{ snackbarText }}
      <v-btn dark flat @click="snackbar=false">Close</v-btn>
    </v-snackbar>
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
      // Temporary data
      messageHeader: {
        title: "title",
        sender: "sender",
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
      messageReady: false,
      snackbar: false,
      timeout: 3000,
      snackbarText: ""
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
        this.messageHeader.dateTime = "";
      } else {
        this.$store
          .dispatch("tickets/getSingleTicket", { jobLevel, messageID })
          .then(response => {
            if (response !== 0) {
              this.messageHeader.title = response.title;
              this.messageHeader.sender = response.sender;
              this.messageHeader.dateTime = response.dateTime;
            } else {
              console.log("Error in fetching the tickets");
            }
          })
          .catch(error => {
            console.log("Error in ticketID");
            this.messageHeader.title = "";
            this.messageHeader.sender = "";
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
      const messageContainer = document.querySelector(".messages__container");
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
      this.$store.dispatch("messages/downloadMedia", { index }).then(() => {
        EventBus.$emit("finishDownload", index);
      });
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

      if (this.id !== "0") {
        // Get the current ticket channel descriptor
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
      } else {
        this.messageReady = true;
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

.main__container {
  margin: 0;
  width: 100%;
  right: 0;
  height: 100%;
}

.header__container {
  width: 100%;
  height: 20%;
  background-color: white;
  color: #8099ec;
  font-family: sans-serif;
  font-size: 20px;
  padding: 0 10px;
  border-bottom: 2px solid #a6a6a6;
}

.message-loader {
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.messages__container {
  margin: 0;
  padding: 10px;
  background-color: #f4f4f4;
  height: 60%;
  overflow: auto;
}

.action__container {
  width: 100%;
  height: 20%;
  padding: 15px;
  background-color: #f4f4f4;
  text-align: center;
}

.file-upload {
  display: none;
}
</style>
