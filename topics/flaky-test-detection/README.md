# Flaky Test Detection

A flaky test passes and fails intermittently with no code change —
usually from hidden non-determinism (timing, shared state, network,
randomness). Automatic retry (Vitest's `retry` test option, used below)
*masks* flakiness so a run goes green, but it is a detection/mitigation
tool, not a fix: a test that needed a retry to pass is telling you
something real broke or raced, and the real fix is removing the
non-determinism, not retrying forever.

**When to use it:** any test suite running in CI long enough to have
accumulated a test that "sometimes just fails" — retry keeps it from
blocking merges while you track down the root cause, and a rising retry
rate over time is itself a signal worth watching.

**Example:** `example.ts`'s `createUnstableOperation` fails its first two
calls on purpose; `example.test.ts` uses Vitest's per-test `{ retry: 3 }`
option to demonstrate the mechanism. The unstable operation is created
once, outside the test body, so its internal call count survives across
retries — mirroring a real flaky dependency, where it's the dependency's
state that changes between attempts, not the test itself.

## References

- [Vitest: retry](https://vitest.dev/config/#retry)
- [Google Testing Blog: Flaky Tests at Google and How We Mitigate Them](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html)
- [BuildPulse (a common flaky-test tracking service)](https://buildpulse.io/)
