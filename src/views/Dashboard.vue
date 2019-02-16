<template>
  <v-navigation-drawer v-model="drawer" permanent absolute width="175">
    <v-toolbar flat class="py-3" color="rgba(247,232,255,100)">
      <v-list-tile>
        <img class="logo-main" src="../assets/img/Accenture_Support_Staff.svg" alt>
      </v-list-tile>
    </v-toolbar>
    <v-toolbar flat class="py-1" color="rgba(222,222,222,100)">
      <b>{{ adminName }}</b>
    </v-toolbar>

    <v-list class="pt-0" dense>
      <v-list-tile v-for="item in items" :key="item.title" @click>
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      adminName: "Insert admin name here",
      drawer: true,
      items: [
        //fix icons sizing
        {
          title: "New Jobs",
          icon: "../assets/img/_ionicons_svg_ios-document.svg"
        },
        {
          title: "My Jobs",
          icon: "../assets/img/_ionicons_svg_md-briefcase.svg"
        }
      ],
      right: null
    };
  }
};
</script>

<style scoped>
.logo-area {
  color: #f7e8ff;
}

.logo-main {
  width: 150px;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  transform: translate(-14%, 5%);
}
</style>
