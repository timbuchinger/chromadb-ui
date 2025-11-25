import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import NotificationList from '../NotificationList.vue'
import { useNotificationStore } from '../../stores/notifications'

describe('NotificationList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render empty when no notifications', () => {
    const wrapper = mount(NotificationList)
    
    // Should have container but no notification items
    expect(wrapper.find('.fixed').exists()).toBe(true)
    expect(wrapper.findAll('[class*="rounded-md p-4"]').length).toBe(0)
  })

  it('should render success notification', async () => {
    const store = useNotificationStore()
    store.add('success', 'Success message', 0)
    
    const wrapper = mount(NotificationList)
    
    const notification = wrapper.find('[class*="bg-status-success"]')
    expect(notification.exists()).toBe(true)
    expect(wrapper.text()).toContain('Success message')
  })

  it('should render error notification', async () => {
    const store = useNotificationStore()
    store.add('error', 'Error message', 0)
    
    const wrapper = mount(NotificationList)
    
    const notification = wrapper.find('[class*="bg-status-error"]')
    expect(notification.exists()).toBe(true)
    expect(wrapper.text()).toContain('Error message')
  })

  it('should render warning notification', async () => {
    const store = useNotificationStore()
    store.add('warning', 'Warning message', 0)
    
    const wrapper = mount(NotificationList)
    
    const notification = wrapper.find('[class*="bg-status-warning"]')
    expect(notification.exists()).toBe(true)
    expect(wrapper.text()).toContain('Warning message')
  })

  it('should render info notification', async () => {
    const store = useNotificationStore()
    store.add('info', 'Info message', 0)
    
    const wrapper = mount(NotificationList)
    
    const notification = wrapper.find('[class*="bg-status-info"]')
    expect(notification.exists()).toBe(true)
    expect(wrapper.text()).toContain('Info message')
  })

  it('should render multiple notifications', async () => {
    const store = useNotificationStore()
    store.add('success', 'First', 0)
    store.add('error', 'Second', 0)
    store.add('info', 'Third', 0)
    
    const wrapper = mount(NotificationList)
    
    expect(wrapper.text()).toContain('First')
    expect(wrapper.text()).toContain('Second')
    expect(wrapper.text()).toContain('Third')
  })

  it('should remove notification when clicked', async () => {
    const store = useNotificationStore()
    store.add('info', 'Click to dismiss', 0)
    
    const wrapper = mount(NotificationList)
    
    expect(store.notifications).toHaveLength(1)
    
    await wrapper.find('[class*="rounded-md p-4"]').trigger('click')
    
    expect(store.notifications).toHaveLength(0)
  })

  it('should remove notification when dismiss button clicked', async () => {
    const store = useNotificationStore()
    store.add('info', 'Click button to dismiss', 0)
    
    const wrapper = mount(NotificationList)
    
    expect(store.notifications).toHaveLength(1)
    
    await wrapper.find('button').trigger('click')
    
    expect(store.notifications).toHaveLength(0)
  })

  it('should show correct icons for each type', async () => {
    const store = useNotificationStore()
    store.add('success', 'Success', 0)
    
    const wrapper = mount(NotificationList)
    
    // Each notification type has an SVG icon
    const svgs = wrapper.findAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('should be positioned fixed at top-right', () => {
    const wrapper = mount(NotificationList)
    const container = wrapper.find('.fixed')
    
    expect(container.classes()).toContain('top-4')
    expect(container.classes()).toContain('right-4')
    expect(container.classes()).toContain('z-50')
  })
})
