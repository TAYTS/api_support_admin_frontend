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
          {{
          item.header
          }}
        </v-subheader>
        <div v-else-if="item.divider" :key="index">
          <v-divider></v-divider>
          <v-list-tile v-if="item.title" :key="index" @click>
            <v-container class="pa-0 ma-0">
              <v-layout fill-height class="pa-0">
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
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
.colorTag {
  height: 80px;
  width: 10px;
  background-color: #9acd32;
  margin-right: 15px;
  margin-left: 0;
}
</style>

<script>
export default {
  data() {
    return {
      search: "",
      adminName: "Insert admin name here",
      filter: ["Foo", "Bar", "Fizz", "Buzz"],
      items: [
        // {
        //   title: "Brunch this weekend?",
        //   subtitle:
        //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et pulvinar est. Sed tincidunt faucibus elit, eu aliquam nisl. Nulla fermentum rutrum erat eget consectetur. ",
        //   divider: true,
        //   inset: true
        // },
      ]
    };
  },
  mounted() {
    // Pull data from the database
    this.$store.dispatch("tickets/getTickets").then(response => {
      if (response !== 0) {
        console.log(response.length);
        var i;
        var headerCheck = {
          Today: 0,
          Yesterday: 0,
          Older: 0
        };
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        for (i = 0; i < response.length; i++) {
          var postDate = new Date(response[i].dateTime);
          if (
            headerCheck["Today"] == 0 &&
            postDate.getDate() == today.getDate() &&
            postDate.getMonth() == today.getMonth() &&
            postDate.getFullYear() == today.getFullYear()
          ) {
            headerCheck["Today"] = 1;
            this.items.push({
              header: "Today"
            });
          }
          if (
            headerCheck["Yesterday"] == 0 &&
            postDate.getDate() == yesterday.getDate() &&
            postDate.getMonth() == yesterday.getMonth() &&
            postDate.getFullYear() == yesterday.getFullYear()
          ) {
            headerCheck["Yesterday"] = 1;
            this.items.push({
              header: "Yesterday"
            });
          }
          if (
            headerCheck["Older"] == 0 &&
            postDate.getDate() < yesterday.getDate() ||
            postDate.getMonth() < yesterday.getMonth() ||
            postDate.getFullYear() < yesterday.getFullYear()
          ) {
            headerCheck["Older"] = 1;
            this.items.push({
              header: "Older Tickets"
            });
          }
          this.items.push({
            title: response[i].title,
            subtitle: response[i].body,
            divider: true,
            inset: true
          });
        }
      } else {
        console.log("Error in fetching the tickets");
      }
    });

    // Style the tab view
    const btn = document.getElementById(0);
    const contentBox = document.getElementsByClassName("tabview");
    btn.classList.add("close");
    contentBox[0].classList.add("close");
  },
  computed: {
    filteredItems: function() {
      return this.items.filter(item => {
        if (this.search.length > 0) {
          if (item.title) {
            return item.title.toLowerCase().match(this.search.toLowerCase());
          }
        } else {
          return true;
        }
      });
    }
  }
};
</script>
