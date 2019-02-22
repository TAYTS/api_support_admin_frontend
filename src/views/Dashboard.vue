<template>
  <div>
    <navigation-bar></navigation-bar>
    <message-list id="messagelist"></message-list>
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
