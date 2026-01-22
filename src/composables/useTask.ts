import { TaskService } from '@/services/task.service'
import { useRequest } from './useRequest'
import { useAlert } from './useAlert'
import type { CreateTask, UpdateTask, Task } from '@/interfaces'

export function useTask() {
  const { loading, error, run } = useRequest()
  const { open } = useAlert()

  const createTask = async (payload: CreateTask): Promise<Task | null> => {
    try {
      const task = await run(() => TaskService.createTask(payload))
      open('Tarea creada', 'success')
      return task
    } catch {
      open(error.value ?? 'Error al crear tarea', 'error')
      return null
    }
  }

  const updateTask = async (id: number, payload: UpdateTask): Promise<Task | null> => {
    try {
      const task = await run(() => TaskService.updateTask(id, payload))
      open('Tarea actualizada', 'success')
      return task
    } catch {
      open(error.value ?? 'Error al actualizar tarea', 'error')
      return null
    }
  }

  const toggleDoneTask = async (id: number, payload: UpdateTask): Promise<Task | null> => {
    try {
      const task = await run(() => TaskService.toggleDoneTask(id, payload))
      open('Estado actualizado', 'success')
      return task
    } catch {
      open(error.value ?? 'Error al actualizar el estado de la tarea', 'error')
      return null
    }
  }

  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      await run(() => TaskService.deleteTask(id))
      open('Tarea eliminada', 'success')
      return true
    } catch {
      open(error.value ?? 'Error al eliminar tarea', 'error')
      return false
    }
  }

  return {
    loading,
    createTask,
    updateTask,
    deleteTask,
    toggleDoneTask
  }
}