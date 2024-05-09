describe("test login", () => {
  it("passes", () => {
    //Visit the login page
    cy.visit("http://localhost:5111/login");

    //Enter the username from fixture
    cy.get('input[name="username"]').type("admin");

    //Enter the password
    cy.get('input[name="password"]').type("admin");

    //Click on the login button
    cy.get('button[type="submit"]').click();
  });
});

describe("test login wrong password", () => {
  it("passes", () => {
    //Visit the login page
    cy.visit("http://localhost:5111/login");

    //Enter the username from fixture
    cy.get('input[name="username"]').type("admin");

    //Enter the password
    cy.get('input[name="password"]').type("admin1");

    //Click on the login button
    cy.get('button[type="submit"]').click();
  });
});
