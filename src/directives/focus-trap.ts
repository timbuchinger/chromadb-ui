interface FocusTrapElement extends HTMLElement {
  _focusTrap?: {
    handleFocus: (event: FocusEvent) => void
  }
}

export const focusTrap = {
  mounted(el: FocusTrapElement) {
    el._focusTrap = {
      handleFocus: (event: FocusEvent) => {
        const focusableElements = el.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstFocusable = focusableElements[0] as HTMLElement
        const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

        // If focus is outside the element, bring it back in
        if (!el.contains(event.target as Node)) {
          firstFocusable.focus()
        }
      }
    }

    document.addEventListener('focus', el._focusTrap.handleFocus, true)
  },

  unmounted(el: FocusTrapElement) {
    if (el._focusTrap) {
      document.removeEventListener('focus', el._focusTrap.handleFocus, true)
      delete el._focusTrap
    }
  }
}
