describe("Products Page", () => {
  const apiProducts = "**/products";
  const apiProductById = "**/products/*";

  beforeEach(() => {
    cy.intercept("GET", apiProducts).as("listProducts");
    cy.visit("/products");
    cy.wait("@listProducts");
  });

  function fillProductForm({ code, name, price }) {
    cy.get('[data-testid="product-code"]').clear().type(code);
    cy.get('[data-testid="product-name"]').clear().type(name);
    cy.get('[data-testid="product-price"]').clear().type(String(price));
  }

  function submitProductForm() {
    cy.get('[data-testid="product-submit"]').should("not.be.disabled").click();
  }

  function closeSuccessModal() {
    cy.contains(".modalTitle", "Success").should("be.visible");
    cy.contains('.modal button[type="button"]', "OK").click();
    cy.contains(".modalTitle", "Success").should("not.exist");
  }

  function getRowByProductCode(code) {
    return cy
      .contains("table tbody tr", code)
      .should("be.visible")
      .then(($tr) => cy.wrap($tr));
  }

  function clickRowEdit(code) {
    getRowByProductCode(code).within(() => {
      cy.get('[data-testid="product-edit"]').then(($btn) => {
        if ($btn.length) return cy.wrap($btn).click();
        return cy.get('button[aria-label^="Edit product"]').first().click();
      });
    });
  }

  function clickRowDelete(code) {
    getRowByProductCode(code).within(() => {
      cy.get('[data-testid="product-delete"]').then(($btn) => {
        if ($btn.length) return cy.wrap($btn).click();
        return cy.get('button[aria-label^="Delete product"]').first().click();
      });
    });
  }

  it("should create a new product", () => {
    const code = `TEST-${Date.now()}`;

    cy.intercept("POST", apiProducts).as("createProduct");

    fillProductForm({ code, name: "Cypress Product", price: 150 });
    submitProductForm();

    cy.wait("@createProduct")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);

    cy.contains(".modal", "Product created successfully.").should("be.visible");
    closeSuccessModal();

    getRowByProductCode(code).within(() => {
      cy.contains("Cypress Product").should("be.visible");
    });
  });

  it("should edit an existing product", () => {
    const code = `EDIT-${Date.now()}`;

    cy.intercept("POST", apiProducts).as("createProduct");
    fillProductForm({ code, name: "To Edit", price: 10 });
    submitProductForm();
    cy.wait("@createProduct");
    closeSuccessModal();

    clickRowEdit(code);

    cy.intercept("PUT", apiProductById).as("updateProduct");
    cy.get('[data-testid="product-name"]').clear().type("Edited by Cypress");
    cy.get('[data-testid="product-price"]').clear().type("99.9");
    submitProductForm();

    cy.wait("@updateProduct").its("response.statusCode").should("eq", 200);

    cy.contains(".modal", "Product updated successfully.").should("be.visible");
    closeSuccessModal();

    getRowByProductCode(code).within(() => {
      cy.contains("Edited by Cypress").should("be.visible");
    });
  });

  it("should delete an existing product", () => {
    const code = `DEL-${Date.now()}`;

    cy.intercept("POST", apiProducts).as("createProduct");
    fillProductForm({ code, name: "To Delete", price: 5 });
    submitProductForm();
    cy.wait("@createProduct");
    closeSuccessModal();

    cy.intercept("DELETE", apiProductById).as("deleteProduct");
    clickRowDelete(code);

    cy.contains(".modalTitle", "Confirm deletion").should("be.visible");
    cy.contains('.modal button[type="button"]', "Delete").click();

    cy.wait("@deleteProduct")
      .its("response.statusCode")
      .should("be.oneOf", [200, 204]);

    cy.contains(".modal", "Product deleted successfully.").should("be.visible");
    closeSuccessModal();

    cy.contains("table tbody tr", code).should("not.exist");
  });
});
