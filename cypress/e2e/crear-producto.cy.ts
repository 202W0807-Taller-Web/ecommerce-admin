describe('Crear Producto — Flujo Básico Confiable', () => {
  const visitPage = () => {
    cy.visit('http://localhost:5173/catalogo/productos');
    cy.get('body', { timeout: 10000 }).should('exist');
  };

  const openModal = () => {
    cy.contains('button', 'Agregar producto').click();
    cy.contains('h3', 'Agregar nuevo producto', { timeout: 8000 }).should('be.visible');
  };

  const getModal = () => cy.contains('h3', 'Agregar nuevo producto').parent();

  beforeEach(() => {
    cy.viewport(1280, 800);
    visitPage();
  });

  it('Muestra botón "Agregar producto" en la página', () => {
    cy.contains('button', 'Agregar producto').should('be.visible');
  });

  it('Abre modal y permite cerrarlo con "Cancelar"', () => {
    openModal();
    cy.get('input[placeholder="Ingrese el nombre del producto"]').should('exist');
    cy.contains('button', 'Cancelar').click();
    cy.contains('h3', 'Agregar nuevo producto').should('not.exist');
  });

  it('Valida error al intentar guardar formulario vacío', () => {
    openModal();
    cy.contains('button', 'Guardar').click();
    cy.contains('Por favor complete todos los campos obligatorios.', { timeout: 6000 }).should('exist');
  });

  it('Valida error cuando solo se completa el nombre', () => {
    openModal();
    cy.get('input[placeholder="Ingrese el nombre del producto"]').type('Nombre solo');
    cy.contains('button', 'Guardar').click();
    cy.contains('Por favor complete todos los campos obligatorios.', { timeout: 6000 }).should('exist');
  });

  it('Valida error sin categoría (nombre y descripción completos)', () => {
    openModal();
    cy.get('input[placeholder="Ingrese el nombre del producto"]').type('Nombre con desc');
    cy.get('textarea[placeholder="Ingrese la descripción del producto"]').type('Descripción presente');
    cy.contains('button', 'Guardar').click();
    cy.contains('Por favor complete todos los campos obligatorios.', { timeout: 6000 }).should('exist');
  });

  it('Carga y muestra opciones válidas en el select de categoría', () => {
    openModal();
    getModal().within(() => {
      cy.get('select').first().find('option:not([value=""])', { timeout: 8000 }).should('have.length.greaterThan', 0);
    });
  });

  it('Selecciona todas las opciones del modal (categoría y atributos)', () => {
    openModal();
    getModal().within(() => {
      cy.get('select').first().find('option:not([value=""])', { timeout: 8000 }).should('have.length.greaterThan', 0);
      cy.get('select').first().find('option:not([value=""])').first().then($opt => {
        const value = $opt.val() as string;
        cy.get('select').first().select(value, { force: true });
      });
      cy.get('select').first().should(($sel) => {
        expect(($sel.val() || '') as string).to.not.equal('');
      });

      cy.get('label').then($labels => {
        const nombres = ['Género', 'Deporte', 'Tipo', 'Colección'];
        nombres.forEach(nombre => {
          const label = Array.from($labels).find(l => l.textContent?.trim() === nombre + ':');
          if (label) {
            cy.wrap(label).parent().find('select').first().find('option:not([value=""])').should('have.length.greaterThan', 0);
            cy.wrap(label).parent().find('select').first().find('option:not([value=""])').first().then($opt => {
              const value = $opt.val() as string;
              cy.wrap(label).parent().find('select').first().select(value, { force: true });
            });
            cy.wrap(label).parent().find('select').first().should(($sel) => {
              expect(($sel.val() || '') as string).to.not.equal('');
            });
          }
        });
      });
    });
  });

  it('Crea producto exitosamente (nombre, descripción y categoría seleccionada)', () => {
    cy.intercept('POST', '**/api/productos', { statusCode: 201, body: { id: 999, nombre: 'Producto Completo' } }).as('createFull');
    openModal();
    cy.get('input[placeholder="Ingrese el nombre del producto"]').type('Producto Completo');
    cy.get('textarea[placeholder="Ingrese la descripción del producto"]').type('Descripción completa');
    getModal().within(() => {
      cy.get('select').first().find('option:not([value=""])').first().then($opt => {
        const value = $opt.val() as string;
        cy.get('select').first().select(value, { force: true });
      });
      cy.get('select').first().should(($sel) => {
        expect(($sel.val() || '') as string).to.not.equal('');
      });
    });
    cy.contains('button', 'Guardar').click();
    cy.wait('@createFull');
    cy.contains('h3', 'Agregar nuevo producto').should('not.exist');
    cy.contains(/Producto (agregado|creado) correctamente\./).should('exist');
  });

});
