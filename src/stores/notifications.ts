import { defineStore } from 'pinia'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  timeout?: number
}

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[]
  }),

  actions: {
    add(type: NotificationType, message: string, timeout: number = 10000) {
      const id = Math.random().toString(36).substr(2, 9)
      const notification: Notification = {
        id,
        type,
        message,
        timeout
      }
      this.notifications.push(notification)

      if (timeout > 0) {
        setTimeout(() => {
          this.remove(id)
        }, timeout)
      }
    },

    remove(id: string) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    success(message: string, timeout?: number) {
      this.add('success', message, timeout)
    },

    error(message: string, timeout?: number) {
      this.add('error', message, timeout)
    },

    warning(message: string, timeout?: number) {
      this.add('warning', message, timeout)
    },

    info(message: string, timeout?: number) {
      this.add('info', message, timeout)
    }
  }
})
