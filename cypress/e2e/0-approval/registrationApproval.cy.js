/// <reference types="cypress" />

describe("Approve Registration", () => {
  beforeEach(() => {
    cy.login("djjimenez", "1234");
  });

  it("should navigate to registration approval page, and approve a registration", () => {
    // Navigate to registration approval page
    cy.openApprovalPage();
    cy.url().should("include", "/approval/registration-approval");

    // Approve a registration
    cy.intercept("PUT", "/RegularClients/ApproveClientRegistration/*").as(
      "approveRegistration"
    );

    cy.approveRegistration();

    // Wait for the response
    cy.wait("@approveRegistration").then((interception) => {
      const responseData = interception.response.body.value;
      if (interception.response.statusCode === 200) {
        cy.contains("Registration approved successfully").should(
          "be.visible",
          "Registration approved successfully"
        );
      } else {
        cy.contains("Registration failed to approve").should(
          "be.visible",
          "failed"
        );
      }
    });
  });
});

// Define custom commands
Cypress.Commands.add("login", (username, password) => {
  cy.visit("http://localhost:5111/login");
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();

  // Ensure successful login
  cy.url().should("equal", "http://localhost:5111/");
  cy.get(".dashboard__top__greetingCard__greeting").should(
    "contain",
    "Fresh morning!"
  );
});

Cypress.Commands.add("openApprovalPage", () => {
  cy.get('a[href="/approval"]').then(($link) => {
    if ($link.is(":visible")) {
      cy.get('a[href="/approval"]').click();
      cy.get('a[href="/approval/registration-approval"]').click();
    } else {
      cy.get('button[aria-label="toggle sidebar"]').click();
      cy.get('a[href="/approval"]').click();
      cy.get('a[href="/approval/registration-approval"]').click();
      cy.get(".sidebar__toggleRemove").click();
    }
  });
});

Cypress.Commands.add("approveRegistration", () => {
  cy.get('[data-testid="actions"]').first().click();
  cy.contains("View").click();

  //Personal Info should be visible
  cy.get(".viewRegistrationModal__personalInfo").should("be.visible");
  cy.contains("Next").click();

  //Terms and Conditions should be visible
  cy.get(".viewRegistrationModal__termsAndConditions").should("be.visible");
  cy.contains("Next").click();

  //Freebies should be visible
  cy.get(".viewRegistrationModal__listingFee").should("be.visible");
  cy.contains("Next").click();

  //Listing Fee should be visible
  cy.get(".viewRegistrationModal__listingFee").should("be.visible");
  cy.contains("Next").click();

  //Other Expenses should be visible
  cy.get(".viewRegistrationModal__listingFee").should("be.visible");

  //Approve
  cy.contains("Approve").click();
  cy.contains("Yes").click();
});
