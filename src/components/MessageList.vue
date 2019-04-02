<template>
  <v-navigation-drawer v-model="drawer" fixed permanent absolute width="500">
    <div id="search-bg" class="pb-0">
      <v-form v-model="valid">
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
        <v-subheader v-if="item.header" :key="item.header">
          {{ item.header }}
        </v-subheader>
        <div v-else-if="item.divider" :key="index">
          <v-divider></v-divider>
          <v-list-tile
            v-bind:class="[item.selected ? selectedClass : '']"
            v-if="item.title"
            :key="index"
            @click="openMessage(index, item.postID)"
          >
            <!-- <div v-if="item.selected"> selected </div> -->
            <v-container class="pa-0 ma-0">
              <v-layout fill-height class="pa-0">
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title
                    v-html="item.subtitle"
                  ></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-layout>
            </v-container>
          </v-list-tile>
        </div>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
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
  mounted() {
    // for (var i = 0; i < this.$parent.items.length; i++) {
    //   this.$parent.items[i].postID == this.$route.params.messageID
    //     ? (this.lastIndex = i)
    //     : "";
    //   console.log(this.lastIndex);
    // }
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
      this.$router.push("/" + this.$route.params.jobLevel + "/" + postID);
      this.$parent.selectedMsgNo = index;
      for (var i = 0; i < this.$parent.items.length; i++) {
        this.$parent.items[i]["selected"] = false;
      }
      this.$parent.items[index]["selected"] = true;
      // this.$parent.items[this.lastIndex]["selected"] = false;
      // this.lastIndex = index;
    }
  }
};
</script>
