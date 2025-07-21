<script>
import axios from 'axios';
export default {
    data() {
        return {
            email: '',
            password: '',
            errorMessage: ''
        };
    },
    methods: {
        handleLogin() {
            axios.post('http://localhost:3000/login', {
                nom: this.email,           // ou "email" si ton backend attend ce champ
                motdepasse: this.password
            })
                .then(response => {
                    this.$router.push('/affectations'); // ou '/dashboard', '/home', etc.
                })
                .catch(error => {
                    if (error.response) {
                        this.errorMessage = error.response.data.message;
                    } else {
                        this.errorMessage = 'Erreur réseau, impossible de se connecter';
                    }
                });
        }
    },
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="card-relative w-full max-w-sm shadow-2xl">
            <div class="card-bg"></div>
            <div class="card-content bg-white relative p-6">
                <h1 class="text-3xl font-extrabold text-primary text-center mb-6">
                    Facturation Matériel Informatique
                </h1>


                <form @submit.prevent="handleLogin">
                    <h2 class="text-2xl font-bold text-center mb-4">Connexion</h2>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Email</span>
                        </label>
                        <input type="text" v-model="email" placeholder="email@example.com" class="input input-bordered"
                            required />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Mot de passe</span>
                        </label>
                        <input type="password" v-model="password" placeholder="********" class="input input-bordered"
                            required />
                    </div>

                    <div v-if="errorMessage" class="error-message">
                        {{ errorMessage }}
                    </div>

                    <div class="form-control mt-6">
                        <button type="submit" class="btn btn-primary">Se connecter</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="card-bg">
            <svg viewBox="0 0 200 200" class="w-full h-full opacity-10">
                <rect x="10" y="10" width="60" height="40" rx="5" ry="5" fill="#007bff" />
                <rect x="80" y="10" width="40" height="60" rx="5" ry="5" fill="#ff5722" />
                <rect x="10" y="60" width="110" height="10" fill="#999999" />
                <circle cx="140" cy="30" r="20" fill="#00c853" />
            </svg>
        </div>
    </div>
</template>

<style scoped>
.error-message {
    color: red;
    margin-top: 10px;
}
</style>
