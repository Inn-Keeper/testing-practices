# Load Tests

Send traffic at a system under a realistic, expected load and measure
throughput and latency — not to break it (that's [Stress Tests](../stress-tests/README.md)),
but to confirm it performs acceptably under normal conditions.

**When to use it:** before a launch or a traffic-sensitive change, against
a staging environment sized like production.

**Example:** `example.ts` starts the [System Tests](../system-tests/README.md)
server in-process and points `autocannon` at its `/health` endpoint for a
short, illustrative run.

**Run it:** `pnpm run loadtest`. This prints numbers for a human to read,
not a pass/fail result — real load testing sets throughput/latency
thresholds specific to the system under test, which this generic example
doesn't have.

## References

- [autocannon docs](https://github.com/mcollina/autocannon)
- [k6 docs (a common production load-testing tool)](https://grafana.com/docs/k6/latest/)
- [Grafana: Load testing basics](https://grafana.com/load-testing/)
