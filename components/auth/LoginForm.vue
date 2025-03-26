&lt;script setup lang="ts"&gt;
import { reactive } from 'vue'
import type { LoginCredentials } from '~/composables/useAuth'

const emit = defineEmits&lt;{
  submit: [credentials: LoginCredentials]
}&gt;()

const credentials = reactive({
  login: '',
  password: ''
})

const handleSubmit = () => {
  emit('submit', { ...credentials })
}
&lt;/script&gt;

&lt;template&gt;
  &lt;form @submit.prevent="handleSubmit" class="space-y-6"&gt;
    &lt;UFormGroup label="Login" name="login"&gt;
      &lt;UInput
        v-model="credentials.login"
        placeholder="Enter your login..."
        size="lg"
        required
      /&gt;
    &lt;/UFormGroup&gt;

    &lt;UFormGroup label="Password" name="password"&gt;
      &lt;UInput
        v-model="credentials.password"
        type="password"
        placeholder="Enter your password..."
        size="lg"
        required
      /&gt;
    &lt;/UFormGroup&gt;

    &lt;UButton
      type="submit"
      color="primary"
      size="lg"
      block
      variant="solid"
    &gt;
      &lt;slot name="button-text"&gt;Login&lt;/slot&gt;
    &lt;/UButton&gt;
  &lt;/form&gt;
&lt;/template&gt;
