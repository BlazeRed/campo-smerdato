<template>
  <v-app>
    <v-app-bar color="transparent" absolute flat short>
      <v-spacer />
      <a href="https://github.com/BlazeRed/campo-smerdato">
        <v-avatar size="32">
          <v-img src="./assets/github-logo.png" />
        </v-avatar>
      </a>
    </v-app-bar>

    <v-main class="bg-pattern">
      <router-view/>
    </v-main>
  </v-app>
</template>

<style>
.bg-pattern {
  background-image: url("~@/assets/bg-pattern.png");
  background-repeat: repeat;
  background-size: 186px 186px;
}

.bg-transparent {
  background: transparent;
}
</style>

<script>
export default {
  name: 'App'
}
</script>
