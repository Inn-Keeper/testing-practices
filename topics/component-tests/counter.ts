export function createCounter(container: HTMLElement): void {
  let count = 0
  const button = document.createElement('button')
  button.textContent = `Count: ${count}`
  button.addEventListener('click', () => {
    count += 1
    button.textContent = `Count: ${count}`
  })
  container.appendChild(button)
}
