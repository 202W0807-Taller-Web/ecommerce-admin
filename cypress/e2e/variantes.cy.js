describe("ProductosVariantesPage - Variantes (ID = 3)", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/catalogo/productos/3/variantes", {
      state: { nombreProducto: "Producto 3" }
    });
  });

  it("Carga la página correctamente", () => {
    cy.contains("Variantes de").should("exist");
    cy.get("table").should("exist");
  });

  it("Filtra variantes por texto en SearchBar", () => {
    // ⭐ Esperar explícitamente a que las variantes carguen en la tabla
    cy.get("table tbody tr", { timeout: 8000 })
      .should("have.length.greaterThan", 0);

    // ⭐ Espera adicional (seguridad)
    cy.wait(5000);

    // ⭐ Escribir "blanco" en la barra de búsqueda
    cy.get("input[placeholder='Buscar producto']").type("blanco");

    cy.wait(300);

    // ⭐ Verificar que el filtrado produjo resultados visibles
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // ⭐ Validar contenido de cada fila filtrada
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row).invoke("text").then((txt) => {
        expect(txt.toLowerCase()).to.include("blanco");
      });
    });
  });

  it("Abre el modal de agregar variante", () => {
    cy.contains("+ Agregar variante").click();

    // 🔥 Tu modal usa "Guardar variante"
    cy.contains("Guardar variante", { timeout: 4000 }).should("exist");

    cy.contains("Cancelar").click();
  });

  it("Abre el modal de eliminar variante", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.get("button").last().click({ force: true });
    });

    cy.contains("¿Seguro que desea eliminar esta variante?").should("exist");
    cy.contains("Cancelar").click();
  });

  it("Checkbox seleccionar todo funciona", () => {
    cy.get("thead input[type='checkbox']").click();

    cy.get("tbody input[type='checkbox']").each((cb) => {
      expect(cb).to.be.checked;
    });

    cy.get("thead input[type='checkbox']").click();

    cy.get("tbody input[type='checkbox']").each((cb) => {
      expect(cb).not.to.be.checked;
    });
  });

  // -----------------------------------------------------------
  // 🔥 TEST: Agregar una variante correctamente
  // -----------------------------------------------------------
  it("Agrega una variante correctamente", () => {
    // 1) esperar a que la tabla tenga filas
    cy.get("table tbody tr", { timeout: 10000 }).should("have.length.greaterThan", 0);

    // guardar conteo inicial
    cy.get("table tbody tr").then(($rowsBefore) => {
      const initialCount = $rowsBefore.length;

      // 2) abrir modal
      cy.contains("+ Agregar variante").click();

      // 3) esperar a que aparezca el modal y que no esté el loader
      cy.contains("Guardar variante", { timeout: 8000 }).should("exist");
      cy.contains("Cargando atributos...", { timeout: 8000 }).should("not.exist");

      // 4) llenar SKU y Precio
      cy.get("input[placeholder='Ej. SKU-12345']").type("TEST-CYPRESS-001");
      cy.get("input[placeholder='Ej. 99.90']").type("199.90");

      // 5) seleccionar la primera opción válida de Color
      cy.get("select").eq(0).find("option").not('[value=""]').first().then(($opt) => {
        const val = $opt.val();
        if (val) cy.get("select").eq(0).select(String(val));
      });

      // 6) seleccionar la primera opción válida de Talla
      cy.get("select").eq(1).find("option").not('[value=""]').first().then(($opt) => {
        const val = $opt.val();
        if (val) cy.get("select").eq(1).select(String(val));
      });

      // 7) adjuntar un archivo de imagen en memoria
      cy.get("input[type='file']").then(($input) => {
        const blob = new Blob(["dummy content"], { type: "image/png" });
        const file = new File([blob], "dummy.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        $input[0].files = dataTransfer.files;
        cy.wrap($input).trigger("change", { force: true });
      });

      // 8) click en Guardar variante
      cy.contains("Guardar variante").click();

      // 9) esperar a que el modal desaparezca
      cy.contains("Guardar variante", { timeout: 10000 }).should("not.exist");

      // 10) esperar recarga y verificar incremento en filas
      cy.get("table tbody tr", { timeout: 10000 }).should(($rowsAfter) => {
        expect($rowsAfter.length).to.be.greaterThan(initialCount);
      });

      // 11) verificar que la nueva variante aparece por precio
      cy.contains("199.90").should("exist");
    });
  });
});
