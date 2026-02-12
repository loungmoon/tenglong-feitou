<template>
  <v-app>
    <v-main class="login-bg">
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card
          class="pa-10"
          elevation="12"
          max-width="450"
          width="100%"
          rounded="lg"
        >
          <v-card-title class="text-h5 text-center font-weight-bold mb-2">
            欢迎回来 ✨
          </v-card-title>

          <v-card-subtitle class="text-center mb-6">
            登录你的账号
          </v-card-subtitle>

          <v-form v-model="valid" @submit.prevent="login">
            <v-text-field
              v-model="username"
              label="用户名称"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              :rules="usernameRules"
              class="mb-4"
              required
            />

            <v-text-field
              v-model="password"
              label="用户密码"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              :rules="passwordRules"
              class="mb-6"
              required
            />

            <v-btn
              block
              size="large"
              color="primary"
              rounded="lg"
              :loading="loading"
              :disabled="!valid || loading"
              type="submit"
            >
              登录
            </v-btn>
          </v-form>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { loginApi } from "@/api/auth.api"
import { setToken } from "@/utils/request"
import { useNotify } from "@/composables/useNotifiy"
import md5 from "md5"

const router = useRouter()
const notify = useNotify()

const valid = ref(false)
const username = ref("")
const password = ref("")
const showPassword = ref(false)
const loading = ref(false)

const usernameRules = [
  v => !!v || "请输入用户名",
  v => v.length >= 3 || "用户名至少 3 位",
  v => v.length <= 20 || "用户名不能超过 20 位",
  v => /^[a-zA-Z0-9_]+$/.test(v) || "用户名只能包含字母、数字或下划线",
]

const passwordRules = [
  v => !!v || "请输入密码",
  v => v.length >= 6 || "密码至少 6 位",
]

const login = async () => {
  if (!valid.value || loading.value) return

  loading.value = true
  try {
    const res = await loginApi({
      username: username.value,
      password: md5(password.value),
    })

    if (!res.data || !res.data.token) {
      throw new Error(res.msg || "登录失败")
    }

    setToken(res.data.token)

    notify.success(res.msg || "登录成功")
    // router.replace("/layout")
    window.location.replace("/layout")
  } catch (err) {
    notify.error(
      err?.response?.data?.msg ||
      err?.message ||
      "账号或密码错误"
    )
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.login-bg {
  background: linear-gradient(135deg, #eae7ee, #2575fc);
}
</style>
