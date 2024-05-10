/// <reference types="cypress" />
import { formatPhoneNumber } from "../../../src/utils/CustomFunctions";

describe("Register Prospect with CDO", () => {
  let prospect; // Declare a variable to hold the fixture data

  before(() => {
    // Load the fixture data before the tests start
    cy.fixture("prospect.json").then((data) => {
      prospect = data;
    });
    // cy.viewport(2000, 1200);
  });

  beforeEach(() => {
    cy.login("nbaylon", "1234");
  });

  it("should login, navigate to prospect registration page, and register a prospect", () => {
    // Navigate to prospect registration page
    cy.openProspectingPage();
    cy.url().should("include", "/customer-registration/prospect");

    // Register a prospect
    cy.intercept("POST", "/api/Prospecting/AddNewProspect").as(
      "registerProspect"
    );

    cy.registerProspect(prospect.successfulProspect);

    // Wait for the response
    cy.wait("@registerProspect").then((interception) => {
      const responseData = interception.response.body.value;
      if (interception.response.statusCode === 200) {
        cy.contains("Prospect added successfully").should(
          "be.visible",
          "Prospect should be added successfully after registration"
        );

        // Continue with adding freebies
        cy.clickYes();

        cy.intercept(
          "POST",
          `/api/Freebies/RequestFreebies/${responseData.id}`
        ).as("requestFreebies");

        cy.requestFreebies();

        cy.wait("@requestFreebies").then((freebieInterception) => {
          if (freebieInterception.response.statusCode === 200) {
            const freebieData = freebieInterception.response.body.value;

            //Continue releasing freebies
            cy.clickYes();

            cy.intercept(
              "PUT",
              `/api/Prospecting/ReleasedProspectingRequest/${
                freebieData.freebies[freebieData.freebies.length - 1]
                  .freebieRequestId
              }`
            ).as("releaseFreebies");

            cy.releaseFreebies();

            cy.wait("@releaseFreebies").then((releaseInterception) => {
              if (releaseInterception.response.statusCode === 200) {
                //Continue to registration
                cy.clickYes();
              }
            });
          }
        });
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

Cypress.Commands.add("openProspectingPage", () => {
  cy.get('button[aria-label="toggle sidebar"]').click();
  cy.get('a[href="/customer-registration"]').click();
  cy.get('a[href="/customer-registration/prospect"]').click();
  cy.get(".sidebar__toggleRemove").click();
});

Cypress.Commands.add(
  "registerProspect",
  ({ name, phone, barangay, city, province, businessName, businessType }) => {
    cy.contains("Main").click();
    cy.contains("Add Prospect").click();

    cy.get('input[name="ownersName"]').type(name);
    //Phone Input ID
    cy.get('[data-testid="phone-number"]').type(phone);
    cy.get('input[name="barangayName"]').type(barangay);
    cy.get('input[name="city"]').type(city);
    cy.get('input[name="province"]').type(province);
    cy.get('input[name="businessName"]').type(businessName);
    cy.get('[data-testid="business-type"]').click();

    // Select the option from the dropdown
    cy.contains("li", businessType.toUpperCase()).click();

    cy.contains("Submit").click();
    cy.clickYes();
  }
);

Cypress.Commands.add("requestFreebies", () => {
  //Select product
  cy.get('[data-testid="product-0"]').click();
  cy.contains("li", "52320").click();

  //Add another row of freebie
  cy.contains("Add Freebie").click();

  //Select another product
  cy.get('[data-testid="product-1"]').click();
  cy.contains("li", "52321").click();

  //Submit and confirm
  cy.contains("Submit").click();
  cy.clickYes();
});

Cypress.Commands.add("releaseFreebies", () => {
  cy.contains("Sign here").click();
  //Sign the react signature canvas with a straight line
  cy.get("canvas")
    .trigger("mousedown", { which: 1, force: true })
    .trigger("mousemove", 100, 100, { force: true })
    .trigger("mouseup", { force: true });
  cy.contains("Confirm").click();

  //Upload file
  cy.get('input[type="file"]').selectFile(
    "./src/assets/images/SisigSample.png",
    { force: true }
  );

  // cy.get('[data-testid="view-freebie-photo"]', {
  //   timeout: 1000,
  // }).click();
  // cy.get(['data-testid="common-modal-close-button"']).click();

  //Release the freebies
  cy.get("button[type=submit]").contains("Release").click();
  cy.clickYes();
});

Cypress.Commands.add("clickYes", () => {
  cy.contains("Yes").click();
});
