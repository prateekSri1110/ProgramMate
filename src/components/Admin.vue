<template>
    <div class="p-2">
        <router-link to="/" class="btn btn-light">@ HOME</router-link>
        <div class="container">
            <h2>Admins</h2>
            <table class="table table-striped table-bordered">
                <thead>
                    <tr class="text-center">
                        <th scope="col">#</th>
                        <th scope="col">Admin Name</th>
                        <th scope="col">Admin Email</th>
                        <th scope="col">Remove</th>
                    </tr>
                </thead>
                <tbody class="text-center">
                    <tr v-for="(ad, index) in admin" :key="ad.id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ ad.name }}</td>
                        <td>{{ ad.email }}</td>
                        <td><b @click="deleteAdmin(ad.id)" style="cursor: pointer; color: red;">X</b></td>
                    </tr>
                </tbody>
            </table>

            <HR />

            <form @submit.prevent="addAdmin" class="row g-2 text-center mt-4">
                <h4>ADD NEW ADMIN</h4>
                <div class="col-md-3">
                    <input v-model="newAdmin.name" class="form-control" type="text" placeholder="Name" />
                </div>
                <div class="col-md-4">
                    <input v-model="newAdmin.email" class="form-control" type="email" placeholder="Email" />
                </div>
                <div class="col-md-4">
                    <input v-model="newAdmin.password" class="form-control" type="password" placeholder="Password" />
                </div>
                <div class="col-md-1">
                    <button class="btn btn-primary" type="submit"><b>+</b></button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../firebase';
import { collection, doc, deleteDoc, addDoc, getDocs } from 'firebase/firestore';

const admin = ref([]);
const fetchadmin = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'admins'));
        admin.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (e) {
        console.error('Error Fetching Admins:', e);
    }
};

const newAdmin = ref({
    name: '',
    email: '',
    password: '',
});
const addAdmin = async () => {
    const name = newAdmin.value.name.trim();
    const email = newAdmin.value.email.trim();
    const password = newAdmin.value.password.trim();

    if (!name || !email || !password) {
        alert('Please fill all fields');
        return;
    }

    try {
        await addDoc(collection(db, 'admins'), {
            name,
            email,
            password
        });

        newAdmin.value = { name: '', email: '', password: '' };
        await fetchadmin();
    } catch (e) {
        console.error('Error Adding Admin:', e);
    }
};

const deleteAdmin = async (adminId) => {
    if (!confirm('Delete this Admin?')) return;

    try {
        await deleteDoc(doc(db, 'admins', adminId));
        console.log('Admin deleted : ', adminId);
        await fetchadmin();
    } catch (e) {
        console.error('Error Deleting Admin:', e);
    }
}
onMounted(fetchadmin);
</script>

<style>
h4 {
    letter-spacing: 5px;
}
</style>