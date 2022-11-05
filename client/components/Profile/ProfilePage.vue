<!-- Default page that also displays freets -->

<template>
    <main>
      <section v-if="$route.params.username">
        <header>
          <h2>Welcome @{{ $route.params.username }}</h2>
        </header>
        <header>
          <div class="left">
            <h2>
              Viewing {{ $route.params.username }}'s feed
              <span v-if="$store.state.filter">
                by @{{ $store.state.filter }}
              </span>
            </h2>
          </div>
          <div class="right">
            <GetFreetsForm
              ref="getFreetsForm"
              value="author"
              placeholder="🔍 Filter by author (optional)"
              button="🔄 Get freets"
            />
          </div>
        </header>
        <section
          v-if="$store.state.feed.length"
        >
          <FreetComponent
            v-for="freet in $store.state.feed"
            :key="freet.id"
            :freet="freet"
          />
        </section>
        <article
          v-else
        >
          <h3>No freets found.</h3>
        </article>
      </section>
    </main>
  </template>
  
  <script>
  import FreetComponent from '@/components/Freet/FreetComponent.vue';
  import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
  
  export default {
    name: 'FreetPage',
    components: {FreetComponent, GetFreetsForm},
    mounted() {
      this.$store.commit("refreshFeed", this.$route.params.username);
      this.$store.commit("refreshFollowers");
      this.$store.commit("refreshFollowing");
      console.log("feed:", this.$store.state.feed);
      console.log("freets:", this.$store.state.freets);
      console.log("followers:", this.$store.state.followers);
      console.log("following:", this.$store.state.following);
    }
  };
  </script>
  
  <style scoped>
  section {
    display: flex;
    flex-direction: column;
  }
  
  header, header > * {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  
  button {
      margin-right: 10px;
  }
  
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
  }
  </style>
  