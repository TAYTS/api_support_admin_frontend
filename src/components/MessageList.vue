<template>
  <v-navigation-drawer fixed permanent absolute width="500">
    <div id="search-bg" class="pb-0">
      <v-form>
        <v-container class="py-0">
          <v-layout>
            <v-flex xs12 md12 class="pb-0 pt-0">
              <v-text-field
                label="Search..."
                append-icon="search"
                class="pb-0"
                single-line
                flat
                v-model="search"
                background-color="#f7e8ff"
              ></v-text-field>
            </v-flex>
            <v-flex xs4 md4 class="pb-0 pt-0">
              <v-select
                :items="filter"
                label="Filter"
                class="pb-0"
                single-line
                flat
                background-color="#f7e8ff"
              ></v-select>
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
                  <v-list-tile-title class="title" v-html="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title class="subtitle" v-html="item.subtitle"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-layout>
            </v-container>
          </v-list-tile>
        </div>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      adminName: "Insert admin name here",
      filter: ["Foo", "Bar", "Fizz", "Buzz"],
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
  background: #808080;
}

.items {
  max-height: calc(100% - 62px);
  overflow: auto;
}
#search-bg {
  background-color: #f7e8ff;
  padding-top: 10px;
}

.selected-class {
  background-color: rgb(245, 245, 245);
}
</style>
