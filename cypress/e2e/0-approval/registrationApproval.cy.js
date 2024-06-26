/// <reference types="cypress" />

describe("Registration Approval", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5111/login");
    cy.login("djjimenez", "1234");

    // Navigate to registration approval page
    cy.openApprovalPage();
    cy.url().should("include", "/approval/registration-approval");
  });

  it("should approve a registration", () => {
    // Approve a registration
    cy.intercept("PUT", "/api/RegularClients/ApproveClientRegistration/*").as(
      "approveRegistration"
    );

    cy.approveRegistration().then((businessName) => {
      // Wait for the response
      cy.wait("@approveRegistration").then((interception) => {
        //Go to approved tab and search
        cy.contains("Approved Clients").click();
        cy.get('input[type="search"]').type(businessName);

        if (interception.response.statusCode === 200) {
          cy.get("td").contains(businessName).should("be.visible");
        } else {
          cy.get("td").contains(businessName).should("not.be.visible");
        }

        // Logout
        cy.logout();
        cy.url().should("equal", "http://localhost:5111/login");
        //Login as ADMIN
        cy.login("admin", "admin");
        // Navigate to registration  page
        cy.openRegistrationPage();
        cy.url().should("include", "/customer-registration/registration");
        // Go to approved tab and search
        cy.contains("Approved Clients").click();
        cy.get('input[type="search"]').type(businessName);

        if (interception.response.statusCode === 200) {
          cy.get("td").contains(businessName).should("be.visible");
        } else {
          cy.get("td").contains(businessName).should("not.be.visible");
        }
      });
    });
  });

  it("should reject a registration", () => {
    // Reject a registration
    cy.intercept("PUT", "/api/Clients/RejectClientRegistration/*").as(
      "rejectRegistration"
    );

    cy.rejectRegistration().then((businessName) => {
      // Wait for the response
      cy.wait("@rejectRegistration").then((interception) => {
        //Go to approved tab and search
        cy.contains("Rejected Clients").click();
        cy.get('input[type="search"]').type(businessName);

        if (interception.response.statusCode === 200) {
          cy.get("td").contains(businessName).should("be.visible");
        } else {
          cy.get("td").contains(businessName).should("not.be.visible");
        }

        // Logout
        cy.logout();
        cy.url().should("equal", "http://localhost:5111/login");
        // Login as ADMIN
        cy.login("admin", "admin");
        // Navigate to registration page
        cy.openRegistrationPage();
        cy.url().should("include", "/customer-registration/registration");

        //Go to approved tab and search
        cy.contains("Rejected Clients").click();
        cy.get('input[type="search"]').type(businessName);

        if (interception.response.statusCode === 200) {
          cy.get("td").contains(businessName).should("be.visible");
        } else {
          cy.get("td").contains(businessName).should("not.be.visible");
        }
      });
    });
  });
});

// Define custom commands
Cypress.Commands.add("approveRegistration", () => {
  return cy
    .get('[data-testid="actions"]')
    .first()
    .click()
    .then(() => {
      const businessNamePosition = 1;
      // Get the businessName of a column in the same row
      return cy
        .get('[data-testid="actions"]')
        .first()
        .parents("tr")
        .find(`td:nth-child(${businessNamePosition})`)
        .invoke("text")
        .then(async (text) => {
          cy.contains("View").click();

          cy.viewRegistrationDetails();

          // Approve
          cy.get('[data-testid="approve-registration"]').click();
          cy.contains("Yes").click();
          // Return the text
          return text;
        });
    });
});

Cypress.Commands.add("rejectRegistration", () => {
  return cy
    .get('[data-testid="actions"]')
    .first()
    .click()
    .then(() => {
      const businessNamePosition = 1;
      // Get the businessName of a column in the same row
      return cy
        .get('[data-testid="actions"]')
        .first()
        .parents("tr")
        .find(`td:nth-child(${businessNamePosition})`)
        .invoke("text")
        .then(async (text) => {
          cy.contains("View").click();

          cy.viewRegistrationDetails();

          // Reject
          cy.get('[data-testid="reject-registration"]').click();
          cy.get('[data-testid="reject-reason"]').type("Sample Reason");
          cy.get('[data-testid="confirm-reason"]').click();
          cy.contains("Yes").click();

          // Return the text
          return text;
        });
    });
});

Cypress.Commands.add("viewRegistrationDetails", () => {
  // Personal Info should be visible
  cy.get(".viewRegistrationModal__personalInfo").should("be.visible");
  cy.contains("Next").click();
  // Terms and Conditions should be visible
  cy.get(".viewRegistrationModal__termsAndConditions").should("be.visible");
  cy.contains("Next").click();
  // Attachments should be visible only if attachments are present
  cy.contains("Attachments");
  cy.get(".viewRegistrationModal__attachments").should("be.visible");
  cy.contains("Next").click();
  // Freebies should be visible
  cy.get(".viewRegistrationModal__listingFee").should("be.visible");
  cy.contains("Next").click();
  // Listing Fee should be visible
  cy.get(".viewRegistrationModal__listingFee").should("be.visible");
  cy.contains("Next").click();
  // Other Expenses should be visible
  cy.get(".viewRegistrationModal__listingFee").should("be.visible");
});

Cypress.Commands.add("logout", () => {
  cy.get('[data-testid="account-menu"]').click();
  cy.contains("Logout").click();
});
