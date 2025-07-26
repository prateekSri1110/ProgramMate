<script setup>
import AdminLogin from './adminLogin.vue';
import UserLogin from './userLogin.vue';

</script>

<template>
    <div class="container p-5 ">
        <div class="text-center my-4">
            <h1>Welcome to <span class="text-primary">ProgramMate</span></h1>
            <h5>Code. Compile. Create — Your journey to mastery starts here.</h5>
        </div>

        <div class="row p-5 text-center">
            <div class="col-md-6 mt-5 d-flex align-content-center justify-content-center border-end">
                <UserLogin />
            </div>

            <div class="col-md-6">
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