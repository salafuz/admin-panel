<template>
  <div class="relative">
    <select 
      :value="modelValue" 
      @input="handleInput($event)" 
      class="select">
      <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface SelectOption {
  value: string | number;
  label: string;
}

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array as () => SelectOption[],
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  }
});

const emit = defineEmits(['update:modelValue']);

const handleInput = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  if (target) {
    emit('update:modelValue', target.value);
  }
};
</script>
