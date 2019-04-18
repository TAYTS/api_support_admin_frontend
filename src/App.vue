<template>
  <v-app id="app">
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
@font-face {
  font-family: "HelveticaNeueMedium";
  src: url(./assets/fonts/Helvetica-Neue-Medium.ttf);
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "HelveticaNeueMedium";
}

html,
body {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

v-app {
  width: 100%;
  height: 100%;
}

/* width */
::-webkit-scrollbar {
  width: 11px;
}

/* Track */
::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 4px grey;*/
  /* border-radius: 10px;  */
  background: white;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 20px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #f7e8ff;
}
</style>
