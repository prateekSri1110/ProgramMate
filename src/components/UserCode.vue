<template>
    <span v-if="!isAuthenticated"></span>

    <div class="container-fluid code">
        <div class="row">
            <!-- Question Side -->
            <div class="col-6 p-5">
                <button class="btn btn-light mb-3" @click="getRandom">Get Random Question</button>

                <ul v-if="randomProgram">
                    <h1> <strong>Q. </strong>{{ randomProgram.title }}</h1>
                    <p>{{ randomProgram.problem }}</p>
                    <li v-for="(ex, index) in randomProgram.sample" :key="index">
                        <strong>Input: </strong>{{ ex.Input }}<br />
                        <strong>Output: </strong>{{ ex.Output }}
                    </li>
                </ul>
            </div>

            <!-- Code Editor Side -->
            <div class="col-6 bg-light p-4">
                <h3>Write Your Code</h3>
                <CodeEditor />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import '../allCss.css'
import CodeEditor from './codeEditor.vue'


const authenticated = false;

const programs = ref([
    {
        id: 1,
        title: 'Check Even or Odd',
        problem: 'Given a number n, check whether it is even or odd. Return true for even and false for odd.',
        sample: [
            { Input: 'n = 15', Output: 'false' },
            { Input: 'n = 44', Output: 'true' }
        ]
    },
    {
        id: 2,
        title: 'Find if a character is vowel or consonant',
        problem: "Given a character, check if it is vowel or consonant.",
        sample: [
            { Input: "x = 'c'", Output: 'Consonant' },
            { Input: "x = 'u'", Output: 'Vowel' }
        ]
    },
    {
        id: 3,
        title: 'Sum of Digits',
        problem: 'Given a positive number n. Find the sum of all the digits of n.',
        sample: [
            { Input: 'n = 687', Output: '21' },
            { Input: 'n = 12', Output: '3' }
        ]
    },
    {
        id: 4,
        title: 'Find the Largest Number Among Three Numbers',
        problem: 'Given 3 integer numbers, the task is to find the largest number among them.',
        sample: [
            { Input: 'a = 10, b = 22, c = 19', Output: '22' },
            { Input: 'a = 12, b = 7, c = 9', Output: '12' }
        ]
    }
])

const randomProgram = ref(null)

function getRandom() {
    const index = Math.floor(Math.random() * programs.value.length)
    randomProgram.value = programs.value[index]
}

</script>

<style scoped>
li {
    list-style: none;
}

p {
    font-size: 1.3rem;
}
</style>