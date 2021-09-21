context('LOGS', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.visit(Cypress.config().baseUrl + '/#/logs', { timeout: 10000 });
  });

  it('[LOGS] perform logs request successfully', () => {
    cy.intercept('GET', '/v2/log?*').as('getLogRequest');
    cy.wait('@getLogRequest').its('response.statusCode').should('eq', 200);
  });

  it('[LOGS] create rows for the virtual scroll table', () => {
    cy.get('.virtual-scroll-container')
      .find('.virtualScrollRow');
  });

  it('[LOGS] should fill the last row of the table with the last value received', () => {
    cy.wait(1000).then(() => {
      cy.get('.stop-stream').click();

      cy.window()
        .its('store')
        .then((store) => {
          store.select('logsAction')
            .subscribe((data) => {
              if (!data.stream) {
                const lastRecord = data.entities[data.ids[data.ids.length - 1]];

                cy.get('.virtual-scroll-container .virtualScrollRow.used')
                  .last()
                  .find('.log-message')
                  .should(($span) => {
                    expect($span.text().trim()).to.equal(lastRecord.message);
                  });
              } else {
                cy.get('.stop-stream').click();
              }
            });
        });
    });
  });

  it('[LOGS] should initially select the last record and fill the right details part with its message', () => {
    cy.get('.stop-stream').click();
    cy.wait(1500).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('logsAction').subscribe((data) => {
            if (!data.stream) {
              const lastRecord = data.entities[data.ids[data.ids.length - 1]];

              cy.get('#virtualScrollTableDetails .non-json-container').should('contain', lastRecord.message);
            } else {
              cy.get('.stop-stream').click();
            }
          });
        });
    });
  });

  it('[LOGS] should fill the right details part with the message of the clicked row - the second last record in our case', () => {
    cy.wait(1000).then(() => {
      cy.get('.stop-stream').click();

      cy.window()
        .its('store')
        .then((store) => {
          store.select('logsAction')
            .subscribe((data) => {
              if (!data.stream) {
                const secondLastRecord = data.entities[data.ids[data.ids.length - 2]];

                cy.get('.virtual-scroll-container .virtualScrollRow.used')
                  .eq(-2)
                  .trigger('click');

                cy.get('#virtualScrollTableDetails .non-json-container').should('contain', secondLastRecord.message);
              } else {
                cy.get('.stop-stream').click();
              }
            });
        });
    });
  });

  it('[LOGS] should change the value of the virtual scroll element when scrolling', () => {
    let beforeScrollValue;

    cy.wait(1000).then(() => {
      cy.get('.stop-stream').click();

      cy.window()
        .its('store')
        .then((store) => {
          store.select('logsAction')
            .subscribe((data) => {
              if (!data.stream) {
                cy.get('.virtual-scroll-container .virtualScrollRow.used')
                  .last()
                  .find('.log-message')
                  .then(($span) => {
                    beforeScrollValue = $span.text();
                  });

                cy.get('.virtual-scroll-container').scrollTo('top');

                cy.get('.virtual-scroll-container .virtualScrollRow.used')
                  .last()
                  .find('.log-message')
                  .should(($span) => {
                    expect($span.text()).to.not.equal(beforeScrollValue);
                  });
              } else {
                cy.get('.stop-stream').click();
              }
            });
        });
    });
  });

  it('[LOGS] should jump to the first page', () => {
    cy.get('.stop-stream').click();
    cy.wait(300).then(() => cy.get('#firstPage').click());

    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('logsAction').subscribe((data) => {
            if (!data.stream) {
              cy.wrap(data.entities[data.ids[0]].originalId).should('eq', 0);
              cy.get('#firstPage').should('be.disabled');
              cy.get('#previousPage').should('be.disabled');
            }
          });
        });
    });
  });

  it('[LOGS] should jump to the last page', () => {
    cy.get('.stop-stream').click();
    cy.wait(300).then(() => cy.get('#previousPage').click());
    cy.wait(600).then(() => cy.get('#previousPage').click());
    cy.wait(1000).then(() => cy.get('#lastPage').click());

    cy.wait(2000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('logsAction').subscribe((data) => {
            if (!data.stream) {
              cy.wrap(data.activePage.id).should('eq', data.pages[data.pages.length - 1]);
              cy.get('#lastPage').should('be.disabled');
              cy.get('#nextPage').should('be.disabled');
            }
          });
        });
    });
  });

  it('[LOGS] should search logs by time', () => {
    let placeholder;
    cy.get('.custom-bottom-form-field input').invoke('attr', 'placeholder').should(value => {
      placeholder = value.replace('e.g: ', '');
    });
    cy.wait(1000).then(() => {

      const minutes = placeholder.slice(3, 5);
      const twoDigit = (val) => val < 10 ? `0${val}` : val;

      if (Number(minutes) > 1) {
        const inputValue = placeholder.replace(':' + minutes + ':', ':' + twoDigit(Number(minutes) - 1) + ':');

        cy.get('.custom-bottom-form-field input').type(inputValue);

        cy.wait(1000).then(() => {
          cy.window()
            .its('store')
            .then((store) => {
              store.select('logsAction').subscribe((logs) => {
                cy.wrap(logs.stream).should('be.false');
                cy.wrap(logs.timestamp).should('not.be.undefined');

                let rowMessage;
                let rightContainerValue;
                cy.get('.virtual-scroll-container .virtualScrollRow.used.hover .log-message').should(value => {
                  rowMessage = value.text();
                });
                cy.get('#virtualScrollTableDetails .non-json-container').should(value => {
                  rightContainerValue = value.text();
                });
                cy.wait(500).then(() => {
                  cy.wrap(rowMessage).should('eq', rightContainerValue);
                });
              });
            });
        });
      }
    });
  });

  it('[LOGS] should search logs by text', () => {
    cy.get('.stop-stream').click();
    cy.wait(1500).then(() => {
      cy.get('.virtual-scroll-container .virtualScrollRow.used', { timeout: 20000 }).then(() => {
        const textToSearch = 'timed';
        cy.get('.search-div input.search-box').type(textToSearch, { force: true });
        cy.get('.search-div input.search-box').type('{enter}', { force: true });
        cy.wait(10000).then(() => {
          cy.window()
            .its('store')
            .then((store) => {
              store.select('logsAction').subscribe((data) => {
                const allContainSearchedString = Object.keys(data.entities).map(key => data.entities[key]).every(entry => entry.message === textToSearch);
                cy.wrap(allContainSearchedString).should('eq',true);
              });
            });
        });
      });
    });
  });
});
