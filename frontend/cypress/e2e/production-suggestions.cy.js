describe("Production Suggestions Page", () => {
  const apiProductionSuggestions = "**/production-suggestions";

  beforeEach(() => {
    cy.intercept("GET", apiProductionSuggestions).as("getSuggestions");
    cy.visit("/production-suggestions");
    cy.wait("@getSuggestions")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);
  });

  it("should load production suggestions page", () => {
    cy.contains("Production Suggestions").should("be.visible");

    cy.contains("Total products").should("be.visible");
    cy.contains("Feasible suggestions").should("be.visible");
    cy.contains("Total production value").should("be.visible");

    cy.get("body").then(($body) => {
      const hasEmpty = $body.text().includes("No producible products found.");
      if (hasEmpty) {
        cy.contains("No producible products found.").should("be.visible");
      } else {
        cy.get("table").should("be.visible");
      }
    });
  });

  it("should recalculate suggestions", () => {
    cy.contains("button", "Recalculate").click();
    cy.wait("@getSuggestions")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);
  });
});
