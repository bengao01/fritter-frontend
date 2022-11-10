import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import NotFound from './NotFound.vue';
import NewsPage from './components/News/NewsPage.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/news', name: 'News', component: NewsPage},
  {path: '/profile/:username', name: 'Profile', component: ProfilePage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }

    if (to.name === 'Profile') {
      // Accessing a profile while signed out redirects to Login page
      if (!router.app.$store.state.username) {
        router.app.$store.commit('alert', {
          message: "You need to be logged in to view user profiles.", status: 'fail'
        })
        next({name: 'Login'});
      }
      const pathParams = to.path.split("/");
      const username = pathParams[pathParams.length - 1];
      console.log("username in router is: ", username);
      router.app.$store.commit("refreshFeed", username);
      router.app.$store.commit("refreshFollowers", username);
      router.app.$store.commit("refreshFollowing", username);
    }
    
  }

  next();
});

export default router;
