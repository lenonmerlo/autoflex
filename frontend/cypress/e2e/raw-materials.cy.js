describe("Raw Materials Page", () => {
  const apiRawMaterials = "**/raw-materials";
  const apiRawMaterialById = "**/raw-materials/*";

  beforeEach(() => {
    cy.intercept("GET", apiRawMaterials).as("listRawMaterials");
    cy.visit("/raw-materials");
    cy.wait("@listRawMaterials");
  });

  function fillRawMaterialForm({ code, name, stockQuantity }) {
    cy.get('[data-testid="raw-code"]').clear().type(code);
    cy.get('[data-testid="raw-name"]').clear().type(name);
    cy.get('[data-testid="raw-stock"]').clear().type(String(stockQuantity));
  }

  function submitRawMaterialForm() {
    cy.get('[data-testid="raw-submit"]').should("not.be.disabled").click();
  }

  function closeSuccessModal() {
    cy.contains(".modalTitle", "Success").should("be.visible");
    cy.contains('.modal button[type="button"]', "OK").click();
    cy.contains(".modalTitle", "Success").should("not.exist");
  }

  function getRowByRawCode(code) {
    return cy
      .contains("table tbody tr", code)
      .should("be.visible")
      .then(($tr) => cy.wrap($tr));
  }

  function clickRowEdit(code) {
    getRowByRawCode(code).within(() => {
      cy.get('button[aria-label^="Edit raw material"]').first().click();
    });
  }

  function clickRowDelete(code) {
    getRowByRawCode(code).within(() => {
      cy.get('button[aria-label^="Delete raw material"]').first().click();
    });
  }

  it("should create a new raw material", () => {
    const code = `MAT-${Date.now()}`;
    const name = "Cypress Material";
    const stockQuantity = "123.45";

    cy.intercept("POST", apiRawMaterials).as("createRawMaterial");

    fillRawMaterialForm({ code, name, stockQuantity });
    submitRawMaterialForm();

    cy.wait("@createRawMaterial")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);

    cy.contains(".modal", "Raw material created successfully.").should(
      "be.visible",
    );
    closeSuccessModal();

    getRowByRawCode(code).within(() => {
      cy.contains(name).should("be.visible");
    });
  });

  it("should edit an existing raw material", () => {
    const code = `MAT-EDIT-${Date.now()}`;
    const name = "To Edit";
    const stockQuantity = "10";
    const newName = `Updated Material ${Date.now()}`;
    const newStock = "999.99";

    cy.intercept("POST", apiRawMaterials).as("createRawMaterial");
    fillRawMaterialForm({ code, name, stockQuantity });
    submitRawMaterialForm();
    cy.wait("@createRawMaterial");
    closeSuccessModal();

    clickRowEdit(code);

    cy.intercept("PUT", apiRawMaterialById).as("updateRawMaterial");
    cy.get('[data-testid="raw-name"]').clear().type(newName);
    cy.get('[data-testid="raw-stock"]').clear().type(newStock);
    submitRawMaterialForm();

    cy.wait("@updateRawMaterial").its("response.statusCode").should("eq", 200);

    cy.contains(".modal", "Raw material updated successfully.").should(
      "be.visible",
    );
    closeSuccessModal();

    getRowByRawCode(code).within(() => {
      cy.contains(newName).should("be.visible");
    });
  });

  it("should delete an existing raw material", () => {
    const code = `MAT-DEL-${Date.now()}`;
    const name = "To Delete";
    const stockQuantity = "5";

    cy.intercept("POST", apiRawMaterials).as("createRawMaterial");
    fillRawMaterialForm({ code, name, stockQuantity });
    submitRawMaterialForm();
    cy.wait("@createRawMaterial");
    closeSuccessModal();

    cy.intercept("DELETE", apiRawMaterialById).as("deleteRawMaterial");
    clickRowDelete(code);

    cy.contains(".modalTitle", "Confirm deletion").should("be.visible");
    cy.contains('.modal button[type="button"]', "Delete").click();

    cy.wait("@deleteRawMaterial")
      .its("response.statusCode")
      .should("be.oneOf", [200, 204]);

    cy.contains(".modal", "Raw material deleted successfully.").should(
      "be.visible",
    );
    closeSuccessModal();

    cy.contains("table tbody tr", code).should("not.exist");
  });
});
