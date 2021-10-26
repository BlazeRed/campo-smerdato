<template>
  <v-app>
    <v-app-bar color="transparent" absolute flat short>
      <v-spacer />
      <a href="https://github.com/BlazeRed/campo-smerdato">
        <v-avatar size="32">
          <v-img v-bind:src="require('@/assets/github-logo.png')" />
        </v-avatar>
      </a>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App'
}
</script>
