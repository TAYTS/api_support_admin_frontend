<template>
  <div>
    <div class="top-outer">
      <div class="pa-3 top">
        <div class="invis-text">{{ $route.params.messageID }}</div>
        <!-- There for force update -->
        <h1>{{ messageHeader.title }}</h1>
        <h2>{{ messageHeader.sender }}</h2>
        <div>{{ messageHeader.dateTime }}</div>
      </div>
      <hr />
    </div>

    <div v-bind:class="[jobLevelIsNewJobs ? messagesNewJobs : messagesMyJobs]">
      <!-- Iterates through messages list for messages -->
      <template v-for="(item, index) in messages">
        <div :key="index">
          <div v-bind:class="[item.senderIsClient ? clientDiv : adminDiv]">
            <div v-bind:class="[item.senderIsClient ? clientBox : adminBox]">
              {{ item.message }}
            </div>
          </div>
        </div>
      </template>
    </div>
    <div>
      <div v-if="jobLevelIsNewJobs" class="full-row row-new-jobs">
        <v-btn class="add-jobs-button">Add to My Jobs</v-btn>
      </div>
      <div v-else class="full-row row-my-jobs">
        <textarea class="text-area"></textarea>
        <v-btn class="send-button">send</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jobLevelIsNewJobs: false,
      adminDiv: "admin-div",
      clientDiv: "client-div",
      adminBox: "admin-box",
      clientBox: "client-box",
      messagesNewJobs: "messages-new-jobs",
      messagesMyJobs: "messages-my-jobs",
      // Temporary data
      messageHeader: {
        title: "title",
        sender: "sender",
        body: "body",
        dateTime: "dateTime"
      },
      messages: [
        {
          message:
            "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with deskt",
          senderIsClient: true,
          dateTime: "2pm or something"
        },
        {
          message:
            "Lmao messaasssssssssssssssssssssssssssssssssssssssssssssssssssssge 2",
          senderIsClient: false,
          dateTime: "2pm or something"
        },
        {
          message: "Lmao message 3",
          senderIsClient: true,
          dateTime: "2pm or something"
        },
        {
          message: "Lmao message 4",
          senderIsClient: false,
          dateTime: "2pm or something"
        },
        {
          message:
            "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with deskt",
          senderIsClient: true,
          dateTime: "2pm or something"
        },
        {
          message:
            "Lmao messaasssssssssssssssssssssssssssssssssssssssssssssssssssssge 2",
          senderIsClient: false,
          dateTime: "2pm or something"
        },
        {
          message: "Lmao message 3",
          senderIsClient: true,
          dateTime: "2pm or something"
        },
        {
          message: "Lmao message 4",
          senderIsClient: false,
          dateTime: "2pm or something"
        },
        {
          message:
            "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with deskt",
          senderIsClient: true,
          dateTime: "2pm or something"
        },
        {
          message:
            "Lmao messaasssssssssssssssssssssssssssssssssssssssssssssssssssssge 2",
          senderIsClient: false,
          dateTime: "2pm or something"
        },
        {
          message: "Lmao message 3",
          senderIsClient: true,
          dateTime: "2pm or something"
        },
        {
          message: "Lmao message 4",
          senderIsClient: false,
          dateTime: "2pm or something"
        }
      ]
    };
  },
  methods: {
    refreshMessageContent: function() {
      var messageID = this.$route.params.messageID;
      var jobLevel = this.$route.params.jobLevel;
      if (jobLevel == "newjobs") {
        this.jobLevelIsNewJobs = true;
      } else {
        this.jobLevelIsNewJobs = false;
      }

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
        });
    }
  },
  mounted() {
    this.refreshMessageContent();
  },
  updated() {
    this.refreshMessageContent();
  }
};
</script>

<style scoped>
.text-area {
  padding: 15px;
  width: calc(99.1% - 675px);
  height: 80%;
  resize: none;
  background-color: white;
  border: 1px solid lightgrey;
}
.messages-new-jobs {
  padding-top: 125px;
  height: auto;
  padding-bottom: 40px;
  /* background-color: aqua; */
  display: inline-block;
}
.messages-my-jobs {
  padding-top: 125px;
  height: auto;
  padding-bottom: 280px;
  /* background-color: aqua; */
  display: inline-block;
}
.full-row {
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #fafafa;
}

.send-button {
  width: calc(98% - 675px);
  z-index: 99;
  height: 38px;
  margin-top: 0;
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
}
.top {
  height: 125px;
}
.add-jobs-button {
  width: calc(98% - 675px);
  z-index: 99;
  height: 40px;
}
.invis-text {
  font-size: 0;
}
.admin-div {
  text-align: right;
  float: right;
  width: 100%;
  padding: 10px 12px 10px 15%;
}
.client-div {
  text-align: left;
  float: left;
  width: 100%;
  padding: 10px 15% 10px 12px;
  height: auto;
}
.admin-box {
  background-color: lightblue;
  display: inline-block;
  padding: 15px;
  border-radius: 10px;
}
.client-box {
  background-color: #f0f0f0;
  display: inline-block;
  padding: 15px;
  border-radius: 10px;
}
</style>
