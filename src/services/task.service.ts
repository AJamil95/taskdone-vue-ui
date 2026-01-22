import api from "@/api/axios";
import type { Task, CreateTask, UpdateTask, ParamsDataTable } from '@/interfaces'

export const TaskService = {
    async getTasks(params: ParamsDataTable): Promise<{total: number;page:number; pages: number; data: Task[]}>{
        const {data} = await api.get('/tasks',{params});
        return data;
    },

  async createTask(payload: CreateTask): Promise<Task> {
    const { data } = await api.post('/tasks', payload)
    return data
  },

  async updateTask(id: number, payload: UpdateTask): Promise<Task> {
    const { data } = await api.put(`/tasks/${id}`, payload)
    return data
  },

  async toggleDoneTask(id: number, payload: UpdateTask): Promise<Task> {
    const { data } = await api.patch(`/tasks/${id}`, payload)
    return data
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },
}