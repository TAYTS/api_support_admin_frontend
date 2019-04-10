<template>
  <div :class="reply === false ? 'message__container reply' : 'message__container'">
    <div class="message">
      <div v-if="type === 'text'">{{ message }}</div>
      <div v-else-if="type === 'media' && reply === false">
        <v-icon color="white" @click="$emit('download-media')">cloud_download</v-icon>
        {{ message }}
      </div>
      <div v-else-if="type === 'media' && reply === true">
        {{ message }}
        <v-icon color="white" @click="$emit('download-media')">cloud_download</v-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageBubble",
  props: ["message", "type", "reply"]
};
</script>

<style scoped>
.message__container {
  margin: 5px;
  width: 100%;
}

.message {
  display: inline-block;
  max-width: 55%;
  padding: 10px 5px 10px 5px;
  margin-bottom: 5px;
  border-radius: 5px;
  background-color: #e0bdf5;
  word-wrap: break-word;
  font-size: 15px;
  text-align: left;
}

.reply {
  text-align: right;
}
</style>
