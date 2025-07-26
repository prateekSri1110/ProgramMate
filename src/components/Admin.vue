<template>
    <div class="p-2">
        <router-link to="/" class="btn btn-light">@ HOME</router-link>

        <div class="container mt-3">
            <span>ADMIN</span>
            <br />
            <h3 class="text-uppercase">{{ currentAdmin.name }}</h3>
            <h6 class="text-uppercase">{{ currentAdmin.email }}</h6>

            <h2 class="mt-4">Admins</h2>
            <table class="table table-striped table-bordered">
                <thead>
                    <tr class="text-center">
                        <th>#</th>
                        <th>Admin Name</th>
                        <th>Admin Email</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody class="text-center">
                    <tr v-for="(ad, index) in admin" :key="ad.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ ad.name }}</td>
                        <td>{{ ad.email }}</td>
                        <td>
                            <b @click="deleteAdmin(ad.id)" style="cursor: pointer; color: red;">X</b>
                        </td>
                    </tr>
                </tbody>
            </table>

            <hr />

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
import { useRoute } from 'vue-router';
import { db } from '../firebase';
import {
    collection,
    doc,
    deleteDoc,
    addDoc,
    getDocs,
    getDoc,
} from 'firebase/firestore';

const route = useRoute();
const adminId = route.params.id;

const currentAdmin = ref({});
const admin = ref([]);

const fetchCurrentAdmin = async () => {
    try {
        const docRef = doc(db, 'admins', adminId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            currentAdmin.value = docSnap.data();
        } else {
            console.warn('⚠️ No such admin found');
        }
    } catch (e) {
        console.error('❌ Error fetching current admin:', e);
    }
};

const fetchAdminList = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'admins'));
        admin.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (e) {
        console.error('❌ Error fetching admin list:', e);
    }
};

const newAdmin = ref({
    name: '',
    email: '',
    password: '',
});

const addAdmin = async () => {
    const { name, email, password } = newAdmin.value;

    if (!name.trim() || !email.trim() || !password.trim()) {
        alert('❗ Please fill all fields');
        return;
    }

    try {
        await addDoc(collection(db, 'admins'), {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(), // ⚠️ Insecure – Consider hashing or Firebase Auth
        });
        newAdmin.value = { name: '', email: '', password: '' };
        await fetchAdminList();
    } catch (e) {
        console.error('❌ Error adding admin:', e);
    }
};

const deleteAdmin = async (id) => {
    if (!confirm('🗑️ Are you sure you want to delete this admin?')) return;

    try {
        await deleteDoc(doc(db, 'admins', id));
        console.log('✅ Admin deleted:', id);
        await fetchAdminList();
    } catch (e) {
        console.error('❌ Error deleting admin:', e);
    }
};

onMounted(() => {
    fetchCurrentAdmin();
    fetchAdminList();
});
</script>

<style scoped>
span {
    color: rgb(175, 175, 175);
}

h4 {
    letter-spacing: 5px;
}
</style>
