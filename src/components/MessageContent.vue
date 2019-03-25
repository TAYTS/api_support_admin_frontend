<template>
  <div>
    <div class="pa-3">
      <div class="invisText">{{ $route.params.messageID }}</div>
      <!-- There for force update -->
      <h1>{{ messageHeader.title }}</h1>
      <h2>{{ messageHeader.sender }}</h2>
      <div>{{ messageHeader.dateTime }}</div>
    </div>
    <hr />
    <div>
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
  </div>
</template>

<style scoped>
.invisText {
  font-size: 0;
}
.adminDiv {
  text-align: right;
  float: right;
  width: 100%;
  padding: 10px 12px 10px 15%;
}
.clientDiv {
  text-align: left;
  float: left;
  width: 100%;
  padding: 10px 15% 10px 12px;
  height: auto;
}
.adminBox {
  background-color: lightblue;
  display: inline-block;
  padding: 15px;
  border-radius: 10px;
}
.clientBox {
  background-color: #f0f0f0;
  display: inline-block;
  padding: 15px;
  border-radius: 10px;
}
</style>

<script>
export default {
  data() {
    return {
      adminDiv: "adminDiv",
      clientDiv: "clientDiv",
      adminBox: "adminBox",
      clientBox: "clientBox",
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
  updated() {
    var messageID = this.$route.params.messageID;
    var jobLevel = this.$route.params.jobLevel;
    console.log(messageID);
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
};
</script>
