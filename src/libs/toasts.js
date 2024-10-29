import { useToastStore } from '@/store/toast'

const toastStore = useToastStore()

export function noWriteAccessToast() {
  toastStore.createToast({
    title: 'Error',
    description: 'You need to have write access to perform this action.',
    status: 'error'
  })
}
