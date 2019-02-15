<template>
  <v-app id="inspire">
    <v-navigation-drawer permanent>
      <v-toolbar height="400%">
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
  
      <v-divider></v-divider>
  
      <v-list dense class="pt-0">
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click=""
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
  
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
    data: () => {
            return {
        items: [
            { title: 'Home', icon: 'dashboard' },
            { title: 'About', icon: 'question_answer' }
        ],
        right: null
        }
    }
}
</script>

<style scoped>
.logo-main {
  width: 40vw;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  transform: translateX(-20%);
  opacity: 0;
}
</style>
