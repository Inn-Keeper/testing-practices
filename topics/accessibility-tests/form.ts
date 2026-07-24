export function createSignupForm(container: HTMLElement): void {
  const label = document.createElement('label')
  label.setAttribute('for', 'email')
  label.textContent = 'Email address'

  const input = document.createElement('input')
  input.type = 'email'
  input.id = 'email'

  container.appendChild(label)
  container.appendChild(input)
}
