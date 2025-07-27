<template>
    <div class="admin container text-center mt-5">
        <form class="admin form-control mx-auto p-4" style="max-width: 400px;" @submit.prevent="login">
            <h4 class="mb-4">ADMIN</h4>
            <!-- login using email and password (only authorized emails can login as admin) -->
            <input class="form-control mb-3" v-model="email" type="email" placeholder="Email" required />
            <input class="form-control mb-3" v-model="password" type="password" placeholder="Password" required />
            <button class="btn btn-primary w-100" :disabled="loading">
                {{ loading ? "Logging in..." : "Login" }}
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

// admin login logic to check if email is authorized to login as admin
const login = async () => {
    loading.value = true;

    try {
        const q = query(
            collection(db, 'admins'),
            where('email', '==', email.value),
            where('password', '==', password.value)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const adminDoc = snapshot.docs[0];
            const adminId = adminDoc.id;

            // route to admin panel along with logged in admin's Id for further use
            router.push(`/admin/${adminId}`);
        } else {
            alert('❌ Invalid email or password. Only Admins can login here!');
        }
    } catch (err) {
        alert(`❌ Error: ${err.message}`);
    } finally {
        loading.value = false;
    }
};
</script>
