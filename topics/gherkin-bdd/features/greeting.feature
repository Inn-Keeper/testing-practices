Feature: Greeting a user
  As a visitor
  I want to be greeted by name
  So that the app feels personal

  Scenario: Greeting with a name
    Given a visitor named "Ada"
    When they request a greeting
    Then the greeting should be "Hello, Ada!"

  Scenario: Greeting an anonymous visitor
    Given a visitor with no name
    When they request a greeting
    Then the greeting should be "Hello, stranger!"
