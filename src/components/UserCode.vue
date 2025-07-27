<template>
    <span v-if="!isAuthenticated">You are not authenticated.</span>
    <div v-else class="container-fluid code">
        <router-link to="/" class="btn btn-light">@ HOME</router-link>
        <div class="row">
            <!-- Question Side -->
            <div class="col-6 p-5">
                <button class="btn btn-light mb-3 text-uppercase" @click="getRandom">Get Random Question</button>

                <div v-if="randomProgram">
                    <h2><strong>Q. </strong>{{ randomProgram.title }}</h2>
                    <p>{{ randomProgram.problem }}</p>
                    <ul>
                        <li v-for="(ex, index) in randomProgram.sample" :key="index">
                            <strong>Input:</strong> {{ ex.Input }}<br />
                            <strong>Output:</strong> {{ ex.Output }}
                        </li>
                    </ul>
                </div>
            </div>

            <!-- CodeEditor Side -->
            <div class="col-6 bg-light p-4">
                <h3>Write Your Code</h3>
                <CodeEditor v-model:code="code" />
                <button class="btn btn-primary m-3" @click="submitCode">Submit</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import CodeEditor from './codeEditor.vue'
import '../allCss.css'

const isAuthenticated = ref(false)
const user = ref(null)

const code = ref('')
const randomProgram = ref(null)

// List of all programs (static data)
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
        problem: 'Given a character, check if it is vowel or consonant.',
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

// random function to generate random program by index
function getRandom() {
    const index = Math.floor(Math.random() * programs.value.length)
    randomProgram.value = programs.value[index]
}

onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            isAuthenticated.value = true
            user.value = {
                name: currentUser.displayName || 'Anonymous',
                email: currentUser.email
            }
        } else {
            isAuthenticated.value = false
        }
    })
})

// submit code with the current user's details to collections
async function submitCode() {
    const question = randomProgram.value
    const codeContent = code.value

    if (!question || !codeContent || codeContent.trim() === '') {
        alert('⚠️ Please select a question and write your code before submitting.')
        return
    }

    try {
        await addDoc(collection(db, 'submissions'), {
            name: user.value.name,
            email: user.value.email,
            questionId: question.id,
            questionTitle: question.title,
            questionText: question.problem,
            code: codeContent,
            timestamp: serverTimestamp()
        })

        alert('✅ Submission saved to Firestore!')
        console.log("Submitted:", {
            user: user.value,
            question: randomProgram.value,
            code: code.value
        })

    } catch (error) {
        alert('❌ Error saving submission: ' + error.message)
    }
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
