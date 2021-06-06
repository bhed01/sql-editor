<template>
  <el-container>
    <div class="card">
      <h1 class="heading"><strong>SQL Editor</strong> <br />Login</h1>
      <form @submit.prevent="submitForm">
        <el-alert
          title="Username: test, Password: test123"
          type="info"
          show-icon
        />
        <el-alert
          v-if="wrong"
          title="Wrong username or password!"
          type="error"
          show-icon
        />
        <div class="form__item">
          <el-input
            autofocus
            placeholder="Username"
            v-model="formData.username"
            clearable
            required
          />
        </div>
        <div class="form__item">
          <el-input
            placeholder="Password"
            v-model="formData.password"
            show-password
            required
          />
        </div>
        <div class="form__item">
          <el-button type="primary" native-type="submit" plain>Login</el-button>
        </div>
      </form>
    </div>
  </el-container>
</template>

<script>
import { isLoggedIn, login } from "@/utils/auth";

import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElAlert } from "element-plus";

export default {
  name: "Login",
  setup() {
    //redirect if user is loged in
    const router = useRouter();
    if (isLoggedIn()) {
      router.push({ name: "Home" });
    }

    const formData = reactive({
      username: "",
      password: "",
    });

    const wrong = ref(false);

    const submitForm = () => {
      if (login(formData.username, formData.password)) {
        router.push({ name: "Home" });
      } else {
        wrong.value = true;
      }
    };

    return {
      formData,
      submitForm,
      wrong,
    };
  },
  components: {
    ElAlert,
  },
};
</script>

<style lang="scss" scoped>
.el-container {
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #e6e6e6;
}
.heading {
  font-size: 1.5rem;
  font-weight: normal;
}
.card {
  text-align: center;
  box-shadow: 0 0 2rem #c2c2c2;
  border-radius: 1rem;
  padding: 1rem 2rem;
  background-color: #fff;
}
.form {
  &__item {
    margin: 1rem 0;
  }
}
.el-alert {
  margin: 0.5rem 0;
}
</style>