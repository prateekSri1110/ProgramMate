<template>
    <div class="container">
        <div ref="editorRef" class="editor-container"></div>
        <button class="btn btn-dark m-2" @click="runCode">Run Code</button>
        <button class="btn btn-primary m-2" type="submit">Submit</button>
        <pre class="output">{{ output }}</pre>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/python/python.js'

const editorRef = ref(null)
let editorInstance = null
let pyodide = null
const output = ref('')

async function loadPyodideScript() {
    if (!window.loadPyodide) {
        await import('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js')
    }
    return await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
    })
}

onMounted(async () => {
    pyodide = await loadPyodideScript()
    output.value = '✅ Pyodide loaded.'

    setTimeout(() => {
        editorInstance = CodeMirror(editorRef.value, {
            value: `print("Hello from Python!")`,
            mode: 'python',
            lineNumbers: true,
            lineWrapping: true,
            theme: 'default'
        })

        editorInstance.focus()
    }, 0)
})

const runCode = async () => {
    const code = editorInstance.getValue()
    try {
        const result = await pyodide.runPythonAsync(code)
        output.value = result ?? 'Code ran successfully'
    } catch (err) {
        output.value = err.toString()
    }
}
</script>

<style>
.container {
    padding: 2rem;
    max-width: 800px;
    margin: auto;
}

.editor-container {
    border: 1px solid #ccc;
    min-height: 400px;
}

.CodeMirror {
    height: auto;
    font-size: 16px;
}

.output {
    margin-top: 1rem;
    background: #d4d4d4;
    padding: 1rem;
    color: rgb(0, 0, 0);
    font-family: monospace;
}
</style>
