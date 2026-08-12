<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    })
    await router.push({ name: 'Dashboard' })
  } catch {
    // L'erreur est déjà renseignée dans le store
  }
}
</script>

<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleSubmit">
      <h2>Connexion</h2>

      <p v-if="error" class="error-message" role="alert">
        {{ error }}
      </p>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          autocomplete="email"
          :disabled="loading"
          placeholder="Entrez votre email"
        />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          autocomplete="current-password"
          :disabled="loading"
          placeholder="Entrez votre mot de passe"
        />
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? 'Connexion…' : 'Se connecter' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.12), transparent 32rem),
    linear-gradient(135deg, #050505 0%, #151515 48%, #ffffff 48%, #f4f4f4 100%);
}

.login-form {
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #111111;
  box-shadow: 12px 12px 0 #111111;
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #050505;
  letter-spacing: 0;
}

.error-message {
  margin: 0 0 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  background-color: #111111;
  color: #ffffff;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #111111;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #111111;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: #ffffff;
  color: #050505;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background-color 0.2s;
}

.form-group input::placeholder {
  color: #737373;
}

.form-group input:focus {
  outline: none;
  border-color: #050505;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.14);
}

.form-group input:disabled {
  background-color: #eeeeee;
  color: #666666;
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #050505;
  color: #ffffff;
  border: 1px solid #050505;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #ffffff;
  color: #050505;
  box-shadow: 4px 4px 0 #050505;
  transform: translate(-2px, -2px);
}

.submit-btn:disabled {
  background-color: #555555;
  border-color: #555555;
  opacity: 0.8;
  cursor: not-allowed;
}
</style>
