// Suite simplificada y estable para creación de producto.
// Mantiene solo flujo esencial: abrir/cerrar, validaciones básicas y creación stub.

describe('Crear Nuevo Producto en Admin (mínimo estable)', () => {
  const visitPage = () => {
    cy.visit('http://localhost:5173/catalogo/productos');
    cy.get('body', { timeout: 10000 }).should('exist');
  };

  const openModal = () => {
    cy.contains('button', 'Agregar producto').click();
    cy.contains('h3', 'Agregar nuevo producto', { timeout: 8000 }).should('be.visible');
  };

  const getModal = () => cy.contains('h3', 'Agregar nuevo producto').parent();

  const selectFirstCategoryInModal = () => {
    getModal().within(() => {
      cy.get('select').first().should('exist').within(() => {
        cy.get('option:not([value=""])', { timeout: 8000 }).should('have.length.greaterThan', 0);
      });
      cy.get('select').first().then($sel => {
        const firstReal = Array.from($sel[0].options).find(o => o.value !== '');
        if (firstReal) cy.wrap($sel).select(firstReal.value, { force: true });
      });
    });
  };

  beforeEach(() => {
    cy.viewport(1280, 800);
    visitPage();
  });

  it('muestra el botón para agregar producto', () => {
    cy.contains('button', 'Agregar producto').should('be.visible');
  });

  it('abre y cierra el modal correctamente', () => {
    openModal();
    cy.get('input[placeholder="Ingrese el nombre del producto"]').should('exist');
    cy.contains('button', 'Cancelar').click();
    cy.contains('h3', 'Agregar nuevo producto').should('not.exist');
  });

  // Validaciones separadas para mayor claridad y estabilidad
  it('muestra validación al guardar vacío', () => {
    openModal();
    cy.contains('button', 'Guardar').click();
    cy.contains('Por favor complete todos los campos obligatorios.', { timeout: 6000 }).should('exist');
  });

  it('muestra validación faltando descripción y categoría (solo nombre)', () => {
    openModal();
    cy.get('input[placeholder="Ingrese el nombre del producto"]').type('Nombre solo');
    cy.contains('button', 'Guardar').click();
    cy.contains('Por favor complete todos los campos obligatorios.', { timeout: 6000 }).should('exist');
  });

  it('muestra validación faltando categoría (nombre y descripción)', () => {
    openModal();
    cy.get('input[placeholder="Ingrese el nombre del producto"]').type('Nombre con desc');
    cy.get('textarea[placeholder="Ingrese la descripción del producto"]').type('Descripción presente');
    cy.contains('button', 'Guardar').click();
    cy.contains('Por favor complete todos los campos obligatorios.', { timeout: 6000 }).should('exist');
  });

  it('carga opciones de categoría', () => {
    openModal();
    // Esperar al menos una opción válida
    getModal().within(() => {
      cy.get('select').first().find('option:not([value=""])', { timeout: 8000 }).should('have.length.greaterThan', 0);
    });
  });

  it('muestra nombre de archivo al seleccionar imagen', () => {
    openModal();
    // El input está oculto (display:none); usar force:true
    cy.get('#file-upload').selectFile({ contents: Cypress.Buffer.from('filecontent'), fileName: 'imagen-prueba.jpg', mimeType: 'image/jpeg' }, { force: true });
    cy.contains('imagen-prueba.jpg').should('exist');
  });

  it('restablece campos al cancelar y reabrir', () => {
    openModal();
    cy.get('input[placeholder="Ingrese el nombre del producto"]').type('Nombre temporal');
    cy.get('textarea[placeholder="Ingrese la descripción del producto"]').type('Descripción temporal');
    selectFirstCategoryInModal();
    cy.contains('button', 'Cancelar').click();
    cy.contains('h3', 'Agregar nuevo producto').should('not.exist');
    cy.contains('button', 'Agregar producto').click();
    cy.contains('h3', 'Agregar nuevo producto').should('exist');
    cy.get('input[placeholder="Ingrese el nombre del producto"]').should('have.value', '');
    cy.get('textarea[placeholder="Ingrese la descripción del producto"]').should('have.value', '');
  });

  it('crea producto exitosamente con todos los campos obligatorios', () => {
    cy.intercept('POST', '**/api/productos', { statusCode: 201, body: { id: 999, nombre: 'Producto Completo' } }).as('createFull');
    openModal();
    cy.get('input[placeholder="Ingrese el nombre del producto"]').type('Producto Completo');
    cy.get('textarea[placeholder="Ingrese la descripción del producto"]').type('Descripción completa');
    selectFirstCategoryInModal();
    cy.contains('button', 'Guardar').click();
    cy.wait('@createFull');
    cy.contains('h3', 'Agregar nuevo producto').should('not.exist');
    // Notificación de éxito (pueden ser dos variantes)
    cy.contains(/Producto (agregado|creado) correctamente\./).should('exist');
  });

  it('crea un producto básico con backend stub', () => {
    cy.intercept('POST', '**/api/productos', { statusCode: 201, body: { id: Date.now(), nombre: 'Producto Cypress' } }).as('create');
    openModal();
    cy.get('input[placeholder="Ingrese el nombre del producto"]').type('Producto Cypress');
    cy.get('textarea[placeholder="Ingrese la descripción del producto"]').type('Descripción Cypress');
    selectFirstCategoryInModal();
    cy.contains('button', 'Guardar').click();
    cy.wait('@create');
    cy.contains('h3', 'Agregar nuevo producto').should('not.exist');
    cy.contains(/Producto (agregado|creado) correctamente\./).should('exist');
  });

  it('permite reabrir el modal tras crear', () => {
    cy.intercept('POST', '**/api/productos', { statusCode: 201, body: { id: 2 } }).as('create2');
    openModal();
    cy.get('input[placeholder="Ingrese el nombre del producto"]').type('Reabrir');
    cy.get('textarea[placeholder="Ingrese la descripción del producto"]').type('Desc reabrir');
    selectFirstCategoryInModal();
    cy.contains('button', 'Guardar').click();
    cy.wait('@create2');
    cy.contains('h3', 'Agregar nuevo producto').should('not.exist');
    cy.contains('button', 'Agregar producto').click();
    cy.contains('h3', 'Agregar nuevo producto').should('exist');
  });
});
