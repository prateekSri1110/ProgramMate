<template>
    <div class="container">
        <div v-if="!isEditorReady" class="text-muted mb-3">⏳ Loading editor and Pyodide...</div>

        <div ref="editorRef" class="editor-container"></div>

        <div class="mt-3">
            <button class="btn btn-dark m-2" @click="runCode">Run Code</button>
            <button class="btn btn-primary m-2" type="submit">Submit</button>
        </div>

        <pre class="output">{{ output }}</pre>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/python/python.js'

const editorRef = ref(null)
const editorInstance = ref(null)
const pyodide = ref(null)
const output = ref('')
const isEditorReady = ref(false)

async function loadPyodideScript() {
    if (!window.loadPyodide) {
        await import('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js')
    }

    const pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/"
    });
}

onMounted(async () => {
    try {
        pyodide.value = await loadPyodideScript()
        output.value = '✅ Pyodide loaded successfully.'

        editorInstance.value = CodeMirror(editorRef.value, {
            value: `print("Hello from Python!")`,
            mode: 'python',
            lineNumbers: true,
            lineWrapping: true,
            theme: 'default'
        })

        editorInstance.value.focus()
        isEditorReady.value = true
    } catch (e) {
        output.value = '❌ Failed to load Pyodide: ' + e.toString()
    }
})

const runCode = async () => {
    try {
        const code = editorInstance.value.getValue()
        const result = await pyodide.value.runPythonAsync(code)
        output.value = result ?? '✅ Code executed with no output.'
    } catch (err) {
        output.value = '❌ Error: ' + err.toString()
    }
}
</script>

<style scoped>
.container {
    padding: 2rem;
    max-width: 800px;
    margin: auto;
}

.editor-container {
    border: 1px solid #ccc;
    min-height: 400px;
    margin-bottom: 1rem;
}

.CodeMirror {
    height: auto;
    font-size: 16px;
}

.output {
    margin-top: 1rem;
    background: #f1f1f1;
    padding: 1rem;
    color: #000;
    font-family: monospace;
    white-space: pre-wrap;
    border-radius: 4px;
}
</style>
