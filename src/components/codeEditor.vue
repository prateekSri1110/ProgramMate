<template>
    <div class="container">
        <div v-if="!isEditorReady" class="text-muted mb-3">⏳ Loading editor and Pyodide...</div>

        <div ref="editorRef" class="editor-container mb-3"></div>

        <div class="mt-3">
            <button class="btn btn-dark m-2" @click="runCode">Run Code</button>
        </div>

        <pre class="output bg-light p-3 rounded border">{{ output }}</pre>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import CodeMirror from 'codemirror'     //code Mirror integratio for code pallete
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/python/python.js'

const editorRef = ref(null)
const editorInstance = ref(null)
const pyodide = ref(null)
const output = ref('')
const isEditorReady = ref(false)

const emit = defineEmits(['submitCode', 'update:code'])

async function loadPyodideScript() {
    if (!window.loadPyodide) {
        await import('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js')
    }
    return await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
    })
}

onMounted(async () => {
    try {
        pyodide.value = await loadPyodideScript()
        output.value = '✅ Pyodide loaded successfully.'

        editorInstance.value = CodeMirror(editorRef.value, {
            value: `print("Hello from Python!")`,
            mode: 'python', // language mode set to 'python'
            lineNumbers: true,
            lineWrapping: true,
            theme: 'default',
        })

        editorInstance.value.on('change', () => {
            emit('update:code', editorInstance.value.getValue())
        })

        isEditorReady.value = true
        editorInstance.value.focus()
    } catch (e) {
        output.value = '❌ Failed to load Pyodide: ' + e.toString()
    }
})

// logic to get code and run it in python 
const runCode = async () => {
    try {
        const code = editorInstance.value.getValue()

        await pyodide.value.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = mystdout = StringIO()
sys.stderr = mystderr = StringIO()
    `)

        await pyodide.value.runPythonAsync(code)

        const stdout = await pyodide.value.runPythonAsync('mystdout.getvalue()')
        const stderr = await pyodide.value.runPythonAsync('mystderr.getvalue()')

        output.value = stderr || stdout || '✅ Code ran with no output.'
    } catch (err) {
        output.value = '❌ Error: ' + err.toString()
    }
}
</script>

<style scoped>
.editor-container {
    border: 1px solid #ccc;
    border-radius: 5px;
    min-height: 300px;
}

.output {
    white-space: pre-wrap;
    font-family: monospace;
    font-size: 1rem;
}
</style>
