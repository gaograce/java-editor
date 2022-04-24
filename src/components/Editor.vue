<template>
  <div style="width: 100%;height:100%;">
    <div class="hello" ref="main" style="width: 100%;height:100%;text-align: left" v-show="model">

    </div>
    <div v-show="!model" style="width: 100%;height:100%;position: relative">
      <span style="font-size: 30px;display: block;position:absolute;left: 50%; top: 50%;transform: translate(-50%, -50%)">
        Please Open A Java File</span>
    </div>
  </div>
</template>

<script>
const {ipcRenderer} = window.require('electron')
import { listen } from "@codingame/monaco-jsonrpc"
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js'
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution'
const { MonacoLanguageClient, CloseAction, ErrorAction, MonacoServices, createConnection } = require('monaco-languageclient')
export default {
  name: 'JavaEditor',
  data() {
    return {
      editor: null,
      websocket: null,
      model: null
    }
  },
  methods: {
    createLanguageClient(connection) {
      return new MonacoLanguageClient({
        name: "Java LSP client",
        clientOptions: {
          documentSelector: ['java'],
          errorHandler: {
            error: () => ErrorAction.Continue,
            closed: () => CloseAction.DoNotRestart
          }
        },
        connectionProvider: {
          get: (errorHandler, closeHandler) => {
            return Promise.resolve(createConnection(connection, errorHandler, closeHandler))
          }
        }
      })
    },
    createModel (filePath) {
      let fileContent = window.require('fs').readFileSync(filePath, 'utf-8').toString()
      return monaco.editor.createModel(fileContent, 'java', monaco.Uri.file(filePath))
    }
  },
  mounted() {
    let self = this
    MonacoServices.install(monaco)
    ipcRenderer.on('open', (event, filePath) => {
      let first = !this.model
      let model = monaco.editor.getModel(monaco.Uri.file(filePath))
      if (!model) {
        model = this.createModel(filePath)
      }
      this.model = model
      if(first) {
        this.$nextTick(() => {
          this.editor = monaco.editor.create(this.$refs.main, {
            model: model
          })
          const url = 'ws://127.0.0.1:5036/java-lsp'
          this.websocket = new WebSocket(url)
          listen({
            webSocket: self.websocket,
            onConnection: connection => {
              console.log("connect")
              const client = self.createLanguageClient(connection);
              const disposable = client.start()
              connection.onClose(() => disposable.dispose());
              console.log(`Connected to "${url}" and started the language client.`);
            }
          })
        })
      } else {
        this.editor.setModel(model)
      }

    })
    ipcRenderer.on('save', () => {
      if(this.model) {
        window.require('fs').writeFileSync(this.model.uri.fsPath, this.model.getValue())
      }
    })
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
