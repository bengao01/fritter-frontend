<template>
    <main>
      <section>
        <header>
          <h2>Welcome to the Verified News Page!</h2>
        </header>
      </section>
      <section>
        <section
          v-if="$store.state.articles.length"
        >
          <NewsComponent
            v-for="freet in $store.state.freets"
            :key="article.id"
            :article="article"
          />
        </section>
        <article
          v-else
        >
          <h3>No articles found.</h3>
        </article>
      </section>
    </main>
  </template>
  
  <script>
  import NewsComponent from '@/components/News/NewsComponent.vue';
  
  export default {
    name: 'NewsPage',
    components: {NewsComponent},
    // Needs to be created instead of mounted otherwise the individual Freets get incorrect followed values
    created() {
      this.$store.commit("refreshArticles");
      console.log("articles", this.$store.state.articles);
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
  