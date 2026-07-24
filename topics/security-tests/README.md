# Security Tests

Test that code correctly handles hostile input — here, a battery of known
XSS payloads against an output-encoding function. Broader security testing
(SAST static analysis, DAST dynamic scanning, penetration testing) is
tooling-heavy and out of scope for a single code example — see the
references instead.

**When to use it:** anywhere untrusted input reaches an HTML/SQL/shell
context — the encoding or parameterization at that boundary is exactly
what this kind of test verifies.

**Example:** `example.ts`'s `escapeHtml` is tested against real XSS payload
strings (`example.test.ts`) to confirm none of them survive as executable
markup.

## References

- [OWASP: Cross-Site Scripting (XSS) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP ZAP (DAST tool)](https://www.zaproxy.org/)
- [Semgrep (SAST tool)](https://semgrep.dev/)
