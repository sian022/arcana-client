Cypress.Commands.add("login", (username, password) => {
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

Cypress.Commands.add("openRegistrationPage", () => {
  cy.get('a[href="/customer-registration"]').then(($link) => {
    if ($link.is(":visible")) {
      cy.get('a[href="/customer-registration"]').click();
      cy.get('a[href="/customer-registration/registration"]').click();
    } else {
      cy.get('button[aria-label="toggle sidebar"]').click();
      cy.get('a[href="/customer-registration"]').click();
      cy.get('a[href="/customer-registration/registration"]').click();
      cy.get(".sidebar__toggleRemove").click();
    }
  });
});
