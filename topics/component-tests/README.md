# Component Tests

Test a UI component in isolation — rendered into a real DOM, driven through
user-facing queries and events, without a browser or the rest of the app.

**When to use it:** for any interactive UI piece (button, form, widget)
where you want confidence in behavior without the cost of a full E2E run.

**Example:** `counter.ts` is a plain-DOM counter button;
`example.test.ts` renders it and clicks through Testing Library.

## References

- [Testing Library: DOM Testing Library docs](https://testing-library.com/docs/dom-testing-library/intro/)
- [Kent C. Dodds: Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
