<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const signIn = async () => {
  if (document.querySelector('#email').checkValidity()) {
    // validazione email
    await authStore.login({ email, password })

    if (authStore.isAuthenticated) {
      router.push({ path: '/youTube' })
    }
  }
}
</script>
<template>
  <div class="login-overlay">
    <div class="login">
      <div class="login-content">
        <div class="login__title">
          <h1>Log In</h1>
          <p>Effettua il login</p>
        </div>
        <div class="login__logo">
          <img class="logo-img" src="/logo/odiare-logo.jpeg" alt="Logo Odiare non è uno sport" />
        </div>
      </div>
      <hr class="login__separator" />
      <div class="login__main">
        <form action="#" method="POST" v-on:submit.prevent="">
          <input
            v-model="email"
            class="input"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
          />
          <input
            v-model="password"
            class="input"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
          <div class="login__actions">
            <button class="login__submit btn btn-primary" @click="signIn">Log in</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
#app {
  .login-overlay {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: var(--secondary-color);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .login {
      width: 25rem;
      min-height: 19rem;
      border-radius: 0.3rem;
      background-color: white;
      padding: 2.2rem 1.5rem;
      box-shadow: 0 2.5px 5px 3.5px hsla(0, 0%, 55%, 0.4);

      .login-content {
        display: flex;
        justify-content: space-between;
        //justify-content: flex-start;
        //gap: 2rem;
        align-items: center;

        .login__title {
          display: flex;
          justify-content: center;
          flex-direction: column;
          gap: 1rem;
          h1 {
            font-weight: 500;
            margin-bottom: 0;
          }

          p {
            margin-bottom: 0;
          }
        }

        .login__logo {
          --size: 7rem;
          height: var(--size);
          width: var(--size);

          .logo-img {
            width: 100%;
          }
        }
      }

      .login__separator {
        border: none;
        height: 0.07rem;
        background-color: lightgrey;
        margin: 1.5rem 0;
      }

      .login__main {
        .input {
          background-color: white;
          width: 100%;
          height: 2.2rem;
          border: 1px solid #aaa;
          border-radius: 4px;
          padding: 0 0.5rem;
        }

        .input:not(.input:last-of-type) {
          margin-bottom: 1rem;
        }

        .login__forgot {
          font-size: 0.9rem;
        }
      }

      .login__actions {
        .login__submit {
          border: none;
          border-radius: 6px;
          background-color: var(--primary-color);
          color: white;
          font-size: 1rem;
          padding: 0.7rem 1.5rem;
          font-weight: 500;
          letter-spacing: 0.05rem;
          margin-top: 1.5rem;
          cursor: pointer;
          width: 100%;

          transition: transform 0.1s;

          &:active {
            transform: scale(0.9);
            transition: transform 0.05s;
          }

          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
  }
}
</style>
