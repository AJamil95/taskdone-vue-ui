<script setup lang="ts">
    const props = defineProps<{
        modelValue: boolean
        title?: string
        message?: string
    }>()

    const emit = defineEmits(['update:modelValue','confirm'])

    const close = () => emit('update:modelValue', false)
    const confirm = () => emit('confirm')
</script>

<template>
     <v-dialog :model-value="modelValue" max-width="400" @update:model-value="close">
    <v-card>
      <v-card-title class="text-h6">
        {{ title || 'Confirmación' }}
      </v-card-title>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="close">Cancelar</v-btn>
        <v-btn color="error" @click="confirm">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>