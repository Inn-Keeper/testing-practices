import { Given, When, Then } from '@cucumber/cucumber'
import assert from 'node:assert/strict'
import { greet } from './greet'

let visitorName: string | undefined
let greeting: string

Given('a visitor named {string}', function (name: string) {
  visitorName = name
})

Given('a visitor with no name', function () {
  visitorName = undefined
})

When('they request a greeting', function () {
  greeting = greet(visitorName)
})

Then('the greeting should be {string}', function (expected: string) {
  assert.equal(greeting, expected)
})
