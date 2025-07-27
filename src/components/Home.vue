<script setup>
import AdminLogin from './adminLogin.vue'
import UserLogin from './userLogin.vue'
</script>

<!-- Home page with login as User and login as Admin functionalities -->
<template>
    <div class="container p-5">
        <!-- Header -->
        <div class="text-center my-4">
            <h1>
                Welcome to <span class="text-primary">ProgramMate</span>
            </h1>
            <h5 class="text-muted">
                Code. Compile. Create — Your journey to mastery starts here.
            </h5>
        </div>

        <!-- Login Sections -->
        <div class="row p-4 text-center">
            <!-- User Login -->
            <div class="col-md-6 mt-3 d-flex flex-column align-items-center justify-content-center border-end">
                <UserLogin />
            </div>

            <!-- Admin Login -->
            <div class="col-md-6 mt-3 d-flex flex-column align-items-center justify-content-center">
                <AdminLogin />
            </div>
        </div>
    </div>
</template>

<style scoped>
h1 {
    letter-spacing: 10px;
}
</style>
