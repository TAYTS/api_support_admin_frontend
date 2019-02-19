<template>
  <div class="main__container">
    <h1 class="main__title">You have logged in.</h1>
  </div>
</template>


<script>
export default {
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

<style scoped>
.main__container {
  height: 100%;
  width: 100%;
  background-image: linear-gradient(to right bottom, #ffffff, #d099ef);
  display: flex;
}
.main__title {
  margin: auto;
  color: #9f2edf;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 5rem;
}
</style>
