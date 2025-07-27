<template>
    <!-- User login -->
    <div class="text-center mt-5">
        <h4>USER</h4>
        <button class="btn btn-primary" @click="loginWithGoogle">Login with Google</button>
    </div>
</template>

<script setup>
import { auth, db, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const router = useRouter();

// login with google
const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (user) {
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: serverTimestamp()
            });

            alert(`Welcome, ${user.displayName}`);
            router.replace('/usercode');
        }
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        alert("Login failed: " + error.message);
    }
};
</script>
