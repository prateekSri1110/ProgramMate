<template>
    <div class="p-2">
        <!-- home button to go back to home page -->
        <router-link to="/" class="btn btn-light">@ HOME</router-link>

        <div class="container mt-3">
            <!-- admin panel (all admin details and add/remove feature) -->
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
                            <!-- delete admin -->
                            <b @click="deleteAdmin(ad.id)" style="cursor: pointer; color: red;">X</b>
                        </td>
                    </tr>
                </tbody>
            </table>

            <hr />

            <!-- add new admin -->
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
        <hr>
        <!-- user submitted program solutions -->
        <div class="container mt-3">
            <h3>User Submissions :</h3>
            <div class="container p-3 border mt-1" v-for="(code, index) in codes" :key="code.id">
                <h5>Submission {{ index + 1 }}</h5>
                <h5><strong>username :</strong> {{ code.name }}</h5>
                <span><strong>email : </strong>{{ code.email }}</span>
                <p><strong>Problem :</strong> {{ code.questionTitle }}</p>
                <p><strong> Code :</strong> {{ code.code }}</p>

                <!-- button to delete user submission (only accessible to admins) -->
                <button class="btn btn-danger text-white" @click="deleteSubmission(code.id)"
                    style="cursor: pointer; color: red;">
                    DELETE SUBMISSION
                </button>
            </div>
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
    serverTimestamp
} from 'firebase/firestore';

const route = useRoute();
const adminId = route.params.id;

const currentAdmin = ref({});
const admin = ref([]);
const codes = ref([]); // Add ref for submissions

// Fetch the current admin info
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

// Fetch the list of all admins
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

// Add new admin to the collection
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
            password: password.trim(),
        });
        newAdmin.value = { name: '', email: '', password: '' };
        await fetchAdminList();
    } catch (e) {
        console.error('❌ Error adding admin:', e);
    }
};

// Delete admin by ID
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

// Fetch user submissions
const getSubmissions = async () => {
    try {
        const queryCode = await getDocs(collection(db, 'submissions'));
        codes.value = queryCode.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (e) {
        console.error('❌ Error fetching submissions:', e);
    }
};

// Delete a submission by ID
const deleteSubmission = async (id) => {
    if (!confirm('❌ Delete this submission?')) return;

    try {
        await deleteDoc(doc(db, 'submissions', id));
        alert('✅ Submission deleted!');
        await getSubmissions(); // refresh list
    } catch (e) {
        console.error('❌ Error deleting submission:', e);
    }

    const deleteSubmission = async (id) => {
        if (!confirm('❌ Delete this submission?')) return;
        try {
            await deleteDoc(doc(db, 'submissions', id));
            alert('✅ Submission deleted!');
            await getSubmissions();
        } catch (e) {
            console.error('❌ Error deleting submission:', e);
        }
    }
};

onMounted(() => {
    fetchCurrentAdmin();
    fetchAdminList();
    getSubmissions();
});
</script>

<style scoped>
span {
    color: rgb(175, 175, 175);
}

h4 {
    letter-spacing: 5px;
}

.btn {
    font-size: 0.8rem;
}
</style>
