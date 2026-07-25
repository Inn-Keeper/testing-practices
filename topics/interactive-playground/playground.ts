import kaplay from 'kaplay'
import { escapeHtml } from '../security-tests/example'

type Character = {
  playHappy: () => void
  playFail: () => void
}

function createCharacter(canvas: HTMLCanvasElement): Character {
  const k = kaplay({
    canvas,
    width: 200,
    height: 200,
    background: [240, 244, 248],
    debug: false,
    global: false,
  })

  const bean = k.add([
    k.circle(40),
    k.pos(k.center()),
    k.anchor('center'),
    k.color(120, 140, 200), // idle: neutral blue-gray
    k.scale(1),
  ])

  let celebrating = false

  // Idle: a gentle continuous "breathing" wobble, paused during a reaction.
  bean.onUpdate(() => {
    if (celebrating) return
    bean.scale = k.vec2(k.wave(0.95, 1.05, k.time()))
  })

  function playHappy(): void {
    celebrating = true
    bean.color = k.rgb(70, 190, 120)
    k.tween(k.vec2(1), k.vec2(1.4), 0.15, (v) => { bean.scale = v }, k.easings.easeOutQuad)
      .then(() => {
        k.tween(k.vec2(1.4), k.vec2(1), 0.4, (v) => { bean.scale = v }, k.easings.easeOutElastic)
          .then(() => { celebrating = false })
      })
  }

  function playFail(): void {
    // Defensive only: escapeHtml is correct, so this branch should never
    // fire for real input — kept so the pass/fail check in runTest() below
    // reflects a real assertion outcome, not a decorative always-true
    // animation.
    celebrating = true
    bean.color = k.rgb(200, 70, 70)
    k.tween(k.vec2(1), k.vec2(0.85), 0.15, (v) => { bean.scale = v }, k.easings.easeInOutSine)
      .then(() => { celebrating = false })
  }

  return { playHappy, playFail }
}

function main(): void {
  const inputEl = document.querySelector<HTMLInputElement>('#playground-input')
  const runButton = document.querySelector<HTMLButtonElement>('#playground-run')
  const rawEl = document.querySelector<HTMLElement>('#playground-raw')
  const escapedEl = document.querySelector<HTMLElement>('#playground-escaped')
  const verdictEl = document.querySelector<HTMLElement>('#playground-verdict')
  const canvas = document.querySelector<HTMLCanvasElement>('#playground-canvas')

  if (!inputEl || !runButton || !rawEl || !escapedEl || !verdictEl || !canvas) {
    throw new Error('playground.html is missing an expected element')
  }

  let character: Character | null = null
  try {
    character = createCharacter(canvas)
  } catch (error) {
    // The escape/assert/display flow below works with or without the
    // canvas character (e.g. no WebGL in a headless test runner) — the
    // property being demonstrated doesn't depend on the animation.
    console.warn('interactive-playground: character animation unavailable', error)
  }

  function runTest(): void {
    // Non-null assertions are safe here: the guard above already throws if
    // any of these elements are missing, but TS can't carry that narrowing
    // into a nested function declaration capturing outer `const`s.
    const raw = inputEl!.value
    const escaped = escapeHtml(raw)
    // The same property the real test suite asserts (security-tests/example.test.ts):
    // expect(escapeHtml(payload)).not.toMatch(/[<>]/)
    const passed = !/[<>]/.test(escaped)

    rawEl!.textContent = raw
    escapedEl!.textContent = escaped
    verdictEl!.textContent = passed
      ? 'PASS — expect(escapeHtml(input)).not.toMatch(/[<>]/)'
      : 'FAIL — a bare < or > survived escaping'

    if (passed) {
      character?.playHappy()
    } else {
      character?.playFail()
    }
  }

  runButton.addEventListener('click', runTest)
}

main()
