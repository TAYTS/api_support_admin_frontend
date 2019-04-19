<template>
  <div class="main__container">
    <v-btn
      v-if="!this.$parent.jobLevelIsNewJobs"
      class="email-button"
      color="#a6b9f7"
      round
      large
      @click="emailUser()"
    >E-mail User</v-btn>
    <div class="header__container">
      <div class="ticket-header">
        <h2>{{ messageHeader.title }}</h2>
        <span>{{ messageHeader.dateTime }}</span>
      </div>
      <hr>
      <h3>{{ messageHeader.category}}</h3>
      <div>{{ messageHeader.sender }}</div>
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
    <div v-show="messageReady" class="action__container">
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
    <v-snackbar v-model="snackbar" :timeout="timeout" bottom>
      {{ snackbarText }}
      <v-btn dark flat @click="snackbar=false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="snackbarEmail" :timeout="timeout" top right>
      {{ snackbarEmailText }}
      <v-btn dark flat @click="snackbarEmail = false">Close</v-btn>
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
        title: "",
        sender: "",
        dateTime: "",
        category: ""
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
      snackbarText: "",
      snackbarEmail: false,
      snackbarEmailText: "Email is successfully sent."
    };
  },
  methods: {
    refreshMessageContent: function() {
      this.id = this.$route.params.messageID;
      var messageID = this.$route.params.messageID;
      var jobLevel = this.$route.params.jobLevel;
      if (messageID == "0") {
        this.messageHeader.title = "";
        this.messageHeader.sender = "";
        this.messageHeader.dateTime = "";
        this.messageHeader.category = "";
      } else {
        this.$store
          .dispatch("tickets/getSingleTicket", { jobLevel, messageID })
          .then(response => {
            if (response.title) {
              this.messageHeader.title = response.title;
              this.messageHeader.sender = response.sender;
              this.messageHeader.dateTime = response.dateTime;
              this.messageHeader.category = response.category;
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
    },
    emailUser() {
      var messageID = this.$route.params.messageID;
      this.$store.dispatch("tickets/emailUser", { messageID }).then(status => {
        if (status == 1) {
          this.snackbarEmail = true;
        } else {
          this.snackbar = true;
          this.snackbarText = "Failed to email the user.";
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
.email-button {
  position: absolute;
  top: 70px;
  right: 30px;
}

.main__container {
  margin: 0;
  width: 100%;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header__container {
  width: 100%;
  flex: 1;
  background-color: #bccdf9;
  font-family: sans-serif;
  font-size: 20px;
  padding: 15px;
  border-bottom: 1px solid #ccc;
}

.ticket-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

hr {
  border: 0.5px solid #aaa;
}

.message-loader {
  width: 100%;
  flex: 8;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
}

.messages__container {
  margin: 0;
  padding: 10px 15px;
  background-color: #f4f4f4;
  overflow-x: hidden;
  flex: 5;
}

.action__container {
  width: 100%;
  height: 20%;
  padding: 15px;
  background-color: #f4f4f4;
  text-align: center;
  flex: 1;
}

.file-upload {
  display: none;
}
</style>
