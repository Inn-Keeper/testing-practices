// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/dom'
import { createCounter } from './counter'

describe('createCounter', () => {
  it('increments the displayed count on click', () => {
    document.body.innerHTML = ''
    createCounter(document.body)

    const button = screen.getByRole('button', { name: 'Count: 0' })
    fireEvent.click(button)

    expect(screen.getByRole('button', { name: 'Count: 1' })).toBeTruthy()
  })
})
