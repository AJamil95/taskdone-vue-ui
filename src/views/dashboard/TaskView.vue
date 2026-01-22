<script setup lang="ts">
import ConfirmDialog from '@/components/global/ConfirmDialog.vue';
import { useDataTable } from '@/composables/useDataTable';
import { useTask } from '@/composables/useTask';
import type { CreateTask, Task, UpdateTask } from '@/interfaces/task.inteface';
import { TaskService } from '@/services/task.service';
import { ref } from 'vue'

const { items, totalItems, loading, search, itemsPerPage, loadItems, refresh } = useDataTable<Task>(
  TaskService.getTasks,
)

const { createTask, updateTask, deleteTask, toggleDoneTask } = useTask()

const options = ref({
  page: 1,
  itemsPerPage: 5,
  search: '',
  sortBy: [{ key: 'name', order: 'asc' }],
})

const headers = [
  { title: 'Nombre', key: 'name', width: '60%' },
  { title: 'Estado', key: 'done' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const loadData = () => {
  loadItems({
    page: options.value.page,
    limit: options.value.itemsPerPage,
    search: options.value.search,
    orderby: options.value.sortBy[0]?.key,
    orderDir: options.value.sortBy[0]?.order,
  })
}

const dialog = ref(false)
const editingTask = ref<Task | null>(null)
const form = ref<CreateTask | UpdateTask>({ name: '' })

const formRef = ref()

const nameRules = [
  (v: string) => !!v || 'El nombre es obligatorio',
  (v: string) => v.length >= 3 || 'Mínimo 3 caracteres',
  (v: string) => v.length <= 255 || 'Máximo 255 caracteres',
  (v: string) => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()\-_\s]+$/.test(v) || 'Solo se permiten caracteres alfanuméricos',
]

const newTask = () => {
  editingTask.value = null
  form.value = { name: '' }
  dialog.value = true
}

const saveTask = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  if (editingTask.value) {
    const updated = await updateTask(editingTask.value.id, form.value as UpdateTask)
    if (updated) refresh()
  } else {
    const created = await createTask(form.value as CreateTask)
    if (created) refresh()
  }
  dialog.value = false
}

const editTask = (task: Task) => {
  editingTask.value = task
  form.value = { name: task.name }
  dialog.value = true
}

const deleteDialog = ref(false)
const taskToDelete = ref<Task | null>(null)

const confirmDelete = (task: Task) => {
  taskToDelete.value = task
  deleteDialog.value = true
}

const deleteConfirmed = async () => {
  if (!taskToDelete.value) return

  const deleted = await deleteTask(taskToDelete.value.id)
  if (deleted) refresh()

  deleteDialog.value = false
  taskToDelete.value = null
}

const toggleDone = async (task: Task) => {
  await toggleDoneTask(task.id, { done: !task.done } as UpdateTask)
  refresh()
}

</script>
<template>
  <v-card flat>
    <template #title>
      <div class="d-flex align-center justify-space-between w-100">
        <span class="text-h6"><strong>Gestión de tareas</strong></span>
        <v-btn color="primary" @click="newTask">
          <v-icon icon="mdi-plus" />
          Agregar Tarea
        </v-btn>
      </div>
    </template>

    <v-card-text>
      <v-text-field
        v-model="search"
        label="Buscar por tarea..."
        prepend-inner-icon="mdi-magnify"
        dense
        variant="outlined"
        clearable
      />
    </v-card-text>

    <v-card-text>
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:search="search"
        v-model:options="options"
        :headers="headers"
        :items="items"
        :items-length="totalItems"
        :loading="loading"
        no-data-text="No hay registros para mostrar"
        loading-text="Cargando datos..."
        items-per-page-text="Registros por página"
        @update:options="loadData"
      >
      <template #header.name="{ column }">
    <strong>{{ column.title }}</strong>
  </template>

  <template #header.done="{ column }">
    <strong>{{ column.title }}</strong>
  </template>

  <template #header.actions="{ column }">
    <strong>{{ column.title }}</strong>
  </template>
        <template #item.done="{ item }">
          <!-- <v-checkbox :model-value="item.done" color="primary" @update:model-value="() => toggleDone(item)" /> -->
            <v-switch
              :model-value="item.done"
              color="success"
              inset
              :label="item.done ? 'Finalizada' : 'Pendiente'"
              @update:model-value="() => toggleDone(item)"
            />
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" color="warning" @click="editTask(item)" />
          <v-btn icon="mdi-delete" size="small" color="error" @click="confirmDelete(item)" />
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>


  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>{{ editingTask ? 'Editar Tarea' : 'Nueva Tarea' }}</v-card-title>
      <v-form ref="formRef">
      <v-card-text>
        <v-textarea v-model="form.name" label="Nombre" :rules="nameRules" rows="3"
  counter="255" maxlength="255" required autofocus/>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="dialog = false">Cancelar</v-btn>
        <v-btn color="primary" @click="saveTask">Guardar</v-btn>
      </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

  <confirm-dialog
    v-model="deleteDialog"
    title="Eliminar tarea"
    @confirm="deleteConfirmed"
  >
    ¿Está seguro de eliminar la tarea
      <strong>{{ taskToDelete?.name }}</strong>?
      Esta acción no se puede deshacer.
  </confirm-dialog>
</template>
