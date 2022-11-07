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
        <div class="follow">
          <div class="left">
            {{ this.$store.state.followers.length }} {{ this.$store.state.followers.length == 1 ? "Follower" : "Followers"}}
          </div>
          <div class="right">
            {{ this.$store.state.following.length }} {{ "Following"}}

          </div>
        </div>

        <div>
          Depolarize value: {{this.$store.state.depolarize}}
        </div>

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
          <h3>{{ $route.params.username }}'s feed is empty.</h3>
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
    created() {
      this.$store.commit("refreshFeed", this.$route.params.username);
      this.$store.commit("refreshFollowers", this.$route.params.username);
      this.$store.commit("refreshFollowing", this.$route.params.username);
      console.log("feed:", this.$store.state.feed);
      console.log("freets:", this.$store.state.freets);
      console.log("profile followers:", this.$store.state.followers);
      console.log("profile following:", this.$store.state.following);
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

  .follow {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  </style>
  