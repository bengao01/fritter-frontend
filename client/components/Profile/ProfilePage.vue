<template>
  <main>
    <section v-if="$route.params.username">
      <header>
        <div>
          <h1>
            Viewing {{ $route.params.username }}'s feed
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h1>
        </div>
        <div>
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
          <p id="followTitle">
            {{ this.$store.state.followers.length }} {{ this.$store.state.followers.length == 1 ? "Follower" : "Followers"}}
          </p>
          <section id="followers"
            v-if="$store.state.followers.length"
          >
            <FollowerComponent
              v-for="follow in $store.state.followers"
              :key="follow.id"
              :follow="follow"
              :follower="true"
            />
          </section>
        </div>
        <div class="right">
          <p id="followTitle">
            {{ this.$store.state.following.length }} {{ "Following"}}
          </p>
          <section id="following"
            v-if="$store.state.following.length"
          >
            <FollowerComponent
              v-for="follow in $store.state.following"
              :key="follow.id"
              :follow="follow"
              :follower="false"
            />
          </section>
        </div>
      </div>

      <div id="depolarize" v-if="$store.state.username === $route.params.username">
        <div id="depolarizeValue">
          Depolarize Feed: {{ this.$store.state.depolarize ? "On" : "Off"}}
        </div>
        <button id="depolarizeButton"
          @click="toggleDepolarizeValue"
        >
          Toggle Depolarize Setting
        </button>
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
import FollowerComponent from '@/components/Profile/FollowerComponent.vue';

export default {
  name: 'ProfilePage',
  components: {FreetComponent, GetFreetsForm, FollowerComponent},
  mounted() {
    this.$store.commit("refreshFeed", this.$route.params.username);
    this.$store.commit("refreshFollowers", this.$route.params.username);
    this.$store.commit("refreshFollowing", this.$route.params.username);
    console.log("feed:", this.$store.state.feed);
    console.log("freets:", this.$store.state.freets);
    console.log("profile followers:", this.$store.state.followers);
    console.log("profile following:", this.$store.state.following);
  },
  methods: {
    toggleDepolarizeValue() {
      const params = {
        method: 'PATCH',
        body: JSON.stringify({depolarize: !this.$store.state.depolarize}),
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully changed Depolarize value!', status: 'success'
          });
          // Refresh the feed after successfully changing the depolarize value
          this.$store.commit("refreshFeed", this.$route.params.username);
        }
      };
      this.requestDepolarize(params);
    },
    async requestDepolarize(params) {
      /**
       * Submits a request to the depolarize endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        let r;
        console.log(options);
        r = await fetch(`/api/users`, options);
        
        if (!r.ok) {
          console.log("Failed to change depolarize value");
          const res = await r.json();
          console.log("res is:", res);
        } else {
          const res = await r.json();
          console.log("res from depolarize:", res);
          this.$store.commit("setDepolarize", res.user.depolarize)
          console.log("new depolarize Value is:", this.$store.state.depolarize)
        }

        params.callback();
      } catch (e) {
        console.log("error in depolarize request:", e)
      }
    },
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

  h1 {
    font-size: 2em;
  }

  #depolarizeValue {
    font-size: 1.1em;
    margin-left: 5px;
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
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: -30px;
    margin-bottom: 10px;
    height: 200px;

  }

  #followTitle {
    text-decoration: underline;
    font-size: 1.15em;
  }

  .left {
    margin-top: 0;
    vertical-align: text-top;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    vertical-align: top;
    height: 70%;
    /* align-items:; */
    /* border: 1px solid #111;
    padding: 0.5rem;
    border-radius: 20px; */
  }

  .right {
    margin-top: 0;
    vertical-align: text-top;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    vertical-align: top;
    height: 70%;
    overflow: scroll;
  }

  #depolarize {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  #following {
    margin-top: 5px;
    overflow-y: auto;
  }

  #depolarizeButton {
    margin-top: 5px;
    background-color: #1DA1F2;
    color: #F5F8FA;
    font-size: 1em;
    position: relative; 
    border-radius: 20px;

  }

  #followers {
    margin-top: 5px;
    overflow-y: auto;
  }

</style>
  