<template>
  <div class="search__container">
    <div id="search-bg" class="pb-0">
      <v-form>
        <v-container class="primary">
          <v-layout>
            <v-flex xs9 md9 class="pb-0 pt-0">
              <v-text-field
                label="Search..."
                append-icon="search"
                class="pb-0"
                color="accent"
                single-line
                flat
                v-model="search"
                v-on:input="refreshContent"
                hide-details
              ></v-text-field>
            </v-flex>
            <v-flex xs7 md7 class="pb-0 pt-0">
              <v-select
                :items="categories"
                label="Filter"
                class="pb-0"
                flat
                hide-details
                v-on:input="refreshContent"
                v-model="category"
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
                  <div id="message_title">
                    <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  </div>
                  <div id="message_details">
                    <v-list-tile-title v-html="item.category" color="white"></v-list-tile-title>
                    <v-list-tile-title v-html="item.datetime" color="white"></v-list-tile-title>
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
import EventBus from "@/store/eventBus.js";
export default {
  data() {
    return {
      search: "",
      category: "All",
      lastTicketID: this.$route.params.messageID,
      adminName: "Insert admin name here",
      items: [],
      selectedClass: "selected-class",
      lastIndex: 0,
      categories: [
        "All",
        "API DevOps",
        "Chart as a Service",
        "Recruiment Platform",
        "Aesop",
        "Travel Marketplace",
        "Banking Lifesyle App",
        "AR Car Visualizer",
        "AR Car Manual",
        "AR Gamification",
        "AR Threatre",
        "AR Menu",
        "AI Wealth Manager",
        "Multilingual Chatbot",
        "AI Translator",
        "Digital Butler",
        "Video Analytics",
        "Sentiment Analysis",
        "ACNAPI MFA Login",
        "Ticketing Platform",
        "Smart Lock",
        "Smart Home",
        "Smart Parkiing",
        "Smart Restaurant",
        "Queuing System",
        "IoT LED Wall",
        "Others"
      ]
    };
  },
  computed: {
    filteredItems: function() {
      return this.$parent.items.filter(item => {
        if (this.search.length > 0 || this.category != "All") {
          if (item.title) {
            if (this.category != "All") {
              return (
                item.title.toLowerCase().match(this.search.toLowerCase()) &&
                item.category.match(this.category)
              );
            } else {
              return item.title.toLowerCase().match(this.search.toLowerCase());
            }
          }
        } else {
          return true;
        }
      });
    }
  },
  methods: {
    refreshContent() {
      if (this.search.length == 0 && this.category == "All") {
        this.$router.push(
          "/" + this.$route.params.jobLevel + "/" + this.lastTicketID
        );
        this.$parent.showSplashFiltered = false;
      } else if (this.filteredItems[0]) {
        this.$router.push(
          "/" + this.$route.params.jobLevel + "/" + this.filteredItems[0].postID
        );
        this.lastTicketID = this.filteredItems[0].postID;
        this.$parent.showSplashFiltered = false;
      } else {
        this.$router.push("/" + this.$route.params.jobLevel + "/0");
        this.$parent.showSplashFiltered = true;
        this.$parent.splashMessage = "No Search Results...";
      }
      EventBus.$emit("refreshContent");
      this.$parent.refreshHighlight();
    },
    openMessage: function(index, postID) {
      this.$parent.openMessage(index, postID);
    }
  },
  mounted() {
    EventBus.$on("removeFilter", () => {
      this.search = "";
      this.category = "All";
    });
    EventBus.$on("refreshFilter", () => {
      if (this.filteredItems[0] && this.search.length != 0 || this.category != "All") {
        this.filteredItems;
        this.refreshContent();
      }
      else if (
        !this.filteredItems[0] &&
        (this.search.length != 0 || this.category != "All")
      ) {
        this.$router.push("/" + this.$route.params.jobLevel + "/0");
        this.$parent.showSplashFiltered = true;
        this.$parent.splashMessage = "No Search Results...";
      }
    });
  }
};
</script>

<style scoped>
.search__container {
  overflow: hidden;
  width: 480px;
  height: 100vh;
}

.items {
  padding: 0;
  height: calc(100vh - 64px);
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
