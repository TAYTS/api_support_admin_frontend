<template>
  <div class="search__container">
    <div id="search-bg" class="pb-0">
      <v-form>
        <v-container class="primary">
          <v-layout>
            <v-flex xs12 md12 class="pb-0 pt-0">
              <v-text-field
                label="Search..."
                append-icon="search"
                class="pb-0"
                color="accent"
                single-line
                flat
                v-model="search"
                hide-details
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </div>
    <v-list three-line class="items">
      <template v-for="(item, index) in filteredItems">
        <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
        <div v-else-if="item.divider" :key="index">
          <v-divider></v-divider>
          <v-list-tile
            v-bind:class="[item.selected ? selectedClass : '']"
            v-if="item.title"
            :key="index"
            @click="openMessage(index, item.postID)"
          >
            <v-container class="pa-0 ma-0">
              <v-layout fill-height class="pa-0">
                <v-list-tile-content>
                  <div id="message_title">
                    <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  </div>
                  <div id="message_details">
                    <v-list-tile-title v-html="item.title" color="white"></v-list-tile-title>
                  </div>
                </v-list-tile-content>
              </v-layout>
            </v-container>
          </v-list-tile>
        </div>
      </template>
    </v-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      adminName: "Insert admin name here",
      items: [],
      selectedClass: "selected-class",
      lastIndex: 0
    };
  },
  computed: {
    filteredItems: function() {
      return this.$parent.items.filter(item => {
        if (this.search.length > 0) {
          if (item.title) {
            return item.title.toLowerCase().match(this.search.toLowerCase());
          }
        } else {
          return true;
        }
      });
    }
  },
  methods: {
    openMessage: function(index, postID) {
      this.$parent.openMessage(index, postID);
    }
  }
};
</script>

<style scoped>
.search__container {
  overflow: hidden;
  width: 26%;
  min-width: 350px;
  height: 100vh;
}

/* width */
::-webkit-scrollbar {
  width: 11px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 4px grey;
  border-radius: 10px;
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

.items {
  padding: 0;
  max-height: calc(100% - 64px);
  overflow-x: hidden;
}

#search-bg {
  background-color: #f7e8ff;
}

.selected-class {
  background-color: #f4f4f4;
}

#message_title {
  font-size: 20px;
  color: #000000;
  opacity: 0.75;
  font-family: HelveticaNeueMedium;
}
#message_details {
  font-size: 15px;
  color: #8099ec;
}
</style>
