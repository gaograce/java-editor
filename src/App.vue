<template>
  <div id="app">
    <div style="background: black; height: 40px; width: 100%;color: white;text-align: left">
      <span style="display: inline-block;padding: 5px;font-weight: bold">A Simple Jave Editor</span>
    </div>
    <div style="width: 100%; height: calc(100vh - 60px); padding: 10px">
      <Editor/>
    </div>
  </div>
</template>

<script>
import Editor from './components/Editor.vue'

export default {
  name: 'App',
  components: {
    Editor
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
}
</style>
