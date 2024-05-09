/// <reference types="cypress" />

// Login before running any tests
before("Login as CDO", () => {
  cy.login("nbaylon", "1234");
});

describe("Register Prospect with CDO", () => {
  it("should successfully login as CDO account", () => {
    // No need to log in here since it's done before all tests
    // assertions remain the same
    cy.url().should("equal", "http://localhost:5111/");
    cy.get(".dashboard__top__greetingCard__greeting").should(
      "contain",
      "Fresh morning!"
    );
  });

  it("should navigate to prospect registration page", () => {
    cy.openProspectingPage();
    cy.url().should("include", "/customer-registration/prospect");
  });

  it("should register a prospect", () => {
    cy.openProspectingPage();
    cy.registerProspect("John Doe", "sample@gmail.com", "9123456789");

    // Assert prospect registration success
    cy.contains(".success-message", "Prospect registered successfully");
  });
});

Cypress.Commands.add("login", (username, password) => {
  cy.visit("http://localhost:5111/login");
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("openProspectingPage", () => {
  cy.get('button[aria-label="toggle sidebar"]').click();
  cy.get('a[href="/customer-registration"]').click();
  cy.get('a[href="/customer-registration/prospect"]').click();
});

Cypress.Commands.add("registerProspect", (name, email, phone) => {
  cy.get(".prospectingStoreList__mainButton").click();
  cy.get('button[type="button"]').click();
  cy.get('input[name="ownersName"]').type(name);
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="phoneNumber"]').type(phone);
  cy.get('button[type="button"]').click();
});
