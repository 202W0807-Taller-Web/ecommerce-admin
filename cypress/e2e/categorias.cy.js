describe("CategoriasPage - Productos", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/catalogo/productos");
  });

  it("Carga la página correctamente", () => {
    cy.contains("Productos en categoría").should("exist");
    cy.get("table").should("exist");
  });

  it("Ingresa al detalle de variantes del producto ID = 3", () => {
    // Encuentra la fila donde aparece el ID 3
    cy.contains("td", "3")
      .parent()
      .within(() => {
        // Busca el botón que redirige a variantes
        cy.contains("Variantes").click({ force: true });
      });

    cy.url().should("include", "/catalogo/productos/3/variantes");
  });

  it("Filtra productos por texto", () => {
    cy.get("input[placeholder='Buscar']").type("a");
    cy.wait(400);
    cy.get("table tbody tr").should("exist");
  });

  it("Abre modal de agregar producto", () => {
    cy.contains("+ Agregar producto").click();
    cy.contains("Agregar nuevo producto").should("be.visible");
    cy.contains("Cancelar").click();
  });

  it("Paginación funciona", () => {
    cy.contains("Siguiente").click();
    cy.wait(400);
    cy.contains("Anterior").click();
  });

  it("Abre el modal de edición", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.contains("Editar").click();
    });
    cy.contains("Editar producto").should("exist");
    cy.contains("Cerrar").click();
  });

  it("Modal de eliminar funciona", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.contains("Eliminar").click();
    });
    cy.contains("¿Seguro que desea eliminar este producto?").should("exist");
    cy.contains("Cancelar").click();
  });
});
