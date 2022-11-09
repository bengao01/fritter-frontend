<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h1>Welcome @{{ $store.state.username }}</h1>
      </header>
      <CreateFreetForm class="freet"/>
    </section>
    <section v-else>
      <header>
        <h1>Welcome to Fritter!</h1>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all freets
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
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
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
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm},
  // Needs to be created instead of mounted otherwise the individual Freets get incorrect followed values
  mounted() {
    this.$refs.getFreetsForm.submit();
    this.$store.commit("refreshFollowers", this.$store.state.username);
    this.$store.commit("refreshFollowing", this.$store.state.username);
    console.log("followers when mounted:", this.$store.state.followers);
    console.log("following when mounted:", this.$store.state.following);
    console.log("freets", this.$store.state.freets);
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 2em;
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
