<template>
  <div>
    <navigation-bar />
    <message-list id="messagelist" />
  </div>
</template>

<script>
import NavigationBar from "@/components/NavigationBar.vue";
import MessageList from "@/components/MessageList.vue";

export default {
  components: {
    NavigationBar,
    MessageList
  }
};
</script>

<style>
#messagelist {
  margin-left: 175px;
}
</style>
