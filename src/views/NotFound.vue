<template>
  <el-container>
    <div class="notfound">
      <h1>404</h1>
      <h2>UH OH! You're lost.</h2>
      <p>
        The page you are looking for does not exist. How you got here is a
        mystery. But you can click the button below to go back to the homepage.
      </p>
      <router-link :to="{ name: 'Home' }">
        <el-button type="primary" plain>Home</el-button>
      </router-link>
    </div>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  justify-content: center;
  align-items: center;
}
.notfound {
  max-width: 400px;
  padding: 1rem;
}
h1 {
  font-size: 7.5em;
  margin: 15px 0px;
  font-weight: bold;
}
h2 {
  font-weight: bold;
}
</style>