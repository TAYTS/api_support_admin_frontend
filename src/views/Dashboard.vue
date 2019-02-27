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
  },
  mounted() {
    // 1. Check if the user has been authenticate
    this.$store.dispatch("user/authenticate", {}).then(status => {
      // 1.2 Redirect to login page if the user is not authenticated
      if (status === 0) {
        this.$router.replace("/login");
      }
      // 1.1 Render the user page if the user is authenticated
    });
  }
};
</script>

<style>
#messagelist {
  margin-left: 175px;
}
</style>
