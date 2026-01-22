import { useAlert } from '@/composables/useAlert'
import { ENV } from '@/config/env'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import axios from 'axios'

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: ENV.API_URL,
})

// Interceptor para añadir el token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();  
      const { open } = useAlert();       
      authStore.logout();                
      router.push({ name: 'login' });    
      open('Sesión expirada. Por favor, inicia sesión nuevamente.', 'warning');
    }
    return Promise.reject(error);  
  }
);

// Interceptor de errores
// TODO: agregar interteceptor de erroes al tener login

export default api
