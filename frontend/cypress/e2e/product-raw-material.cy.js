describe("Product–Raw Material Page", () => {
  const apiProducts = "**/products";
  const apiRawMaterials = "**/raw-materials";
  const apiProductRawMaterialsByProduct =
    "**/product-raw-materials/by-product/*";
  const apiProductRawMaterials = "**/product-raw-materials";
  const apiProductRawMaterialById = "**/product-raw-materials/*";

  function closeSuccessModal() {
    cy.contains(".modalTitle", "Success").should("be.visible");
    cy.contains('.modal button[type="button"]', "OK").click();
    cy.contains(".modalTitle", "Success").should("not.exist");
  }

  function createProductViaUI({ code, name, price }) {
    cy.intercept("GET", apiProducts).as("listProducts");
    cy.visit("/products");
    cy.wait("@listProducts");

    cy.intercept("POST", apiProducts).as("createProduct");
    cy.get('[data-testid="product-code"]').clear().type(code);
    cy.get('[data-testid="product-name"]').clear().type(name);
    cy.get('[data-testid="product-price"]').clear().type(String(price));
    cy.get('[data-testid="product-submit"]').should("not.be.disabled").click();

    cy.wait("@createProduct")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);
    cy.contains(".modal", "Product created successfully.").should("be.visible");
    closeSuccessModal();
  }

  function createRawMaterialViaUI({ code, name, stockQuantity }) {
    cy.intercept("GET", apiRawMaterials).as("listRawMaterials");
    cy.visit("/raw-materials");
    cy.wait("@listRawMaterials");

    cy.intercept("POST", apiRawMaterials).as("createRawMaterial");
    cy.get('[data-testid="raw-code"]').clear().type(code);
    cy.get('[data-testid="raw-name"]').clear().type(name);
    cy.get('[data-testid="raw-stock"]').clear().type(String(stockQuantity));
    cy.get('[data-testid="raw-submit"]').should("not.be.disabled").click();

    cy.wait("@createRawMaterial")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);
    cy.contains(".modal", "Raw material created successfully.").should(
      "be.visible",
    );
    closeSuccessModal();
  }

  function selectProductByText(text) {
    cy.contains("label", "Select product")
      .find("select")
      .as("productSelect")
      .find("option")
      .contains(text)
      .invoke("val")
      .then((val) => {
        cy.get("@productSelect").select(String(val));
      });
  }

  function selectRawMaterialByText(text) {
    cy.contains("label", "Raw Material")
      .find("select")
      .as("rawSelect")
      .find("option")
      .contains(text)
      .invoke("val")
      .then((val) => {
        cy.get("@rawSelect").select(String(val));
      });
  }

  it("should add, update and remove raw material from a product (BOM)", () => {
    const stamp = Date.now();
    const product = {
      code: `PRD-${stamp}`,
      name: "Cypress Product BOM",
      price: 10,
    };
    const rawMaterial = {
      code: `RM-${stamp}`,
      name: "Cypress Material BOM",
      stockQuantity: 123.45,
    };

    createProductViaUI(product);
    createRawMaterialViaUI(rawMaterial);

    cy.intercept("GET", apiProducts).as("listProducts");
    cy.intercept("GET", apiRawMaterials).as("listRawMaterials");
    cy.intercept("GET", apiProductRawMaterialsByProduct).as("listAssociations");

    cy.visit("/product-raw-materials");
    cy.wait("@listProducts");

    cy.wait("@listRawMaterials");
    cy.wait("@listAssociations");

    selectProductByText(`${product.code} - ${product.name}`);

    cy.wait("@listRawMaterials");
    cy.wait("@listAssociations");

    cy.intercept("POST", apiProductRawMaterials).as("createAssociation");

    selectRawMaterialByText(`${rawMaterial.code} - ${rawMaterial.name}`);
    cy.contains("label", "Required Quantity").find("input").clear().type("2.5");

    cy.contains("button", "Add").click();

    cy.wait("@createAssociation")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);
    cy.contains(".modal", "Raw material added to product.").should(
      "be.visible",
    );
    closeSuccessModal();

    cy.contains("table tbody tr", `${rawMaterial.code} - ${rawMaterial.name}`)
      .should("be.visible")
      .as("assocRow");

    cy.intercept("PUT", apiProductRawMaterialById).as("updateAssociation");
    cy.get("@assocRow")
      .find('input[type="number"]')
      .clear()
      .type("3.75")
      .blur();

    cy.wait("@updateAssociation").its("response.statusCode").should("eq", 200);
    cy.contains(".modal", "Required quantity updated.").should("be.visible");
    closeSuccessModal();

    cy.intercept("DELETE", apiProductRawMaterialById).as("deleteAssociation");
    cy.get("@assocRow").within(() => {
      cy.get('button[aria-label="Remove raw material from product"]').click();
    });

    cy.contains(".modalTitle", "Confirm removal").should("be.visible");
    cy.contains('.modal button[type="button"]', "Remove").click();

    cy.wait("@deleteAssociation")
      .its("response.statusCode")
      .should("be.oneOf", [200, 204]);
    cy.contains(".modal", "Association removed.").should("be.visible");
    closeSuccessModal();

    cy.contains(
      "table tbody tr",
      `${rawMaterial.code} - ${rawMaterial.name}`,
    ).should("not.exist");
  });
});
