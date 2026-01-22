import { reactive, readonly } from 'vue'

type AlertType = 'success' | 'error' | 'info' | 'warning'

interface AlertState {
  show: boolean
  message: string
  type: AlertType
}

const state = reactive<AlertState>({
  show: false,
  message: '',
  type: 'info',
})

export const useAlert = () => {
  const open = (msg: string, typeValue: AlertType = 'info') => {
    // console.log('llegando en useAlert', msg)
    state.message = msg
    state.type = typeValue
    state.show = true
  }

  const close = () => {
    state.show = false
  }

  return {
    open,
    close,
    state: readonly(state)
  }
}
