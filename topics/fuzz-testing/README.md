# Fuzz Testing

Throw large volumes of random, unstructured, often-malformed input at code
and check that it never crashes or hangs — distinct from
[Property-Based Tests](../property-based-tests/README.md), which assert a
specific structured invariant (e.g. "sorting preserves length"); fuzzing's
only claim is "this doesn't blow up," making it well suited to parsers and
anything that touches untrusted input.

**When to use it:** parsers, deserializers, file-format readers — anywhere
malformed input is expected to arrive eventually and a crash (not just a
wrong answer) is the failure mode you're hunting for.

**Example:** `example.ts`'s `parseQueryString` is fuzzed with `fast-check`'s
`fc.string()` arbitrary (same library as Property-Based Tests, used here in
its "generate anything, assert no throw" mode rather than its
structured-invariant mode).

## References

- [fast-check docs](https://fast-check.dev/)
- [OWASP: Fuzzing](https://owasp.org/www-community/Fuzzing)
- [Google: OSS-Fuzz](https://google.github.io/oss-fuzz/)
