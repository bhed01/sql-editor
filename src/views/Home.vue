<template>
  <el-container direction="vertical" style="height: 100%">
    <navbar
      @toggle-side-nav="toggleSideNav"
      :is-sidenav-collapse="isSideNavCollapse"
    />
    <router-view :is-sidenav-collapse="isSideNavCollapse" />
  </el-container>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { isLoggedIn } from "@/utils/auth";

export default {
  name: "Home",
  setup() {
    //redirect to login page if not logedin
    const router = useRouter();
    if (!isLoggedIn()) {
      router.push({ name: "Login" });
    }

    //to control side nav collapse
    const isSideNavCollapse = ref(false);
    const toggleSideNav = () => {
      isSideNavCollapse.value = !isSideNavCollapse.value;
    };

    return {
      isSideNavCollapse,
      toggleSideNav,
    };
  },
  components: { Navbar },
};
</script>