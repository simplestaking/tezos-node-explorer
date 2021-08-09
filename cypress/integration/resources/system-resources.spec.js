const isOctez = (data) => data.settingsNode.activeNode.type === 'octez';

describe('SYSTEM RESOURCES', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.visit(Cypress.config().baseUrl + '/#/resources/system', { timeout: 2000 });
    cy.wait(1000);
  });

  it('[SYSTEM RESOURCES] should perform get resources request successfully', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (!isOctez(store)) {
            const nodeId = data.settingsNode.activeNode.type === 'octez' ? 'ocaml' : 'tezedge';
            cy.intercept('GET', '/resources/' + nodeId).as('getSystemResources');

            cy.visit(Cypress.config().baseUrl + '/#/resources/system', { timeout: 2000 });
            cy.wait(1000);
            cy.wait('@getSystemResources').its('response.statusCode').should('eq', 200);
          }
        });
      });
  });

  it('[SYSTEM RESOURCES] should parse tezedge RPC response successfully', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(store => {
            const octez = store.settingsNode.activeNode.type === 'octez';
            if (!octez) {
              cy.wrap(store.resources.systemResources.colorScheme.domain).should('have.length', 7);

              const cpu = store.resources.systemResources.cpu;
              const memory = store.resources.systemResources.memory;
              const storage = store.resources.systemResources.storage;
              const io = store.resources.systemResources.io;
              const network = store.resources.systemResources.network;
              const panel = store.resources.systemResources.resourcesPanel;
              cy.wrap(store.resources.systemResources.xTicksValues).should('have.length.above', 0);
              cy.wrap(store.resources.systemResources.colorScheme.domain).should('have.length', 7);

              cy.wrap(cpu.labels).should('have.length', 3);
              cy.wrap(cpu.formattingType).should('eq', '%');
              cy.wrap(cpu.series).should('have.length', 3);
              cpu.series.forEach((s, i) => {
                cy.wrap(s.name.toLowerCase()).should('eq', cpu.labels[i].toLowerCase());
                if (s.series.length) {
                  cy.wrap(s.series[0].name).should('not.be.undefined');
                  cy.wrap(s.series[0].value).should('not.be.undefined');
                }
              });
              cy.wrap(cpu.series.find(s => s.name === 'NODE').series[0].runnerGroups).should('not.be.undefined');

              cy.wrap(memory.labels).should('have.length', 3);
              cy.wrap(memory.formattingType).should('eq', 'MB');
              cy.wrap(memory.series).should('have.length', 3);
              memory.series.forEach((s, i) => {
                cy.wrap(s.name.toLowerCase()).should('eq', memory.labels[i].toLowerCase());
                if (s.series.length) {
                  cy.wrap(s.series[0].name).should('not.be.undefined');
                  cy.wrap(s.series[0].value).should('not.be.undefined');
                }
              });
              cy.wrap(memory.series.find(s => s.name === 'VALIDATORS').series[0].runnerGroups).should('not.be.undefined');

              cy.wrap(storage.labels).should('have.length', 7);
              cy.wrap(storage.formattingType).should('eq', 'GB');
              cy.wrap(storage.series).should('have.length', 7);
              storage.series.forEach((s, i) => {
                cy.wrap(s.name.toLowerCase()).should('eq', storage.labels[i].toLowerCase());
                if (s.series.length) {
                  cy.wrap(s.series[0].name).should('not.be.undefined');
                  cy.wrap(s.series[0].value).should('not.be.undefined');
                }
              });

              cy.wrap(io.labels).should('have.length', 6);
              cy.wrap(io.formattingType).should('eq', 'MB');
              cy.wrap(io.series).should('have.length', 6);
              io.series.forEach((s, i) => {
                cy.wrap(s.name.toLowerCase()).should('eq', io.labels[i].toLowerCase());
                if (s.series.length) {
                  cy.wrap(s.series[0].name).should('not.be.undefined');
                  cy.wrap(s.series[0].value).should('not.be.undefined');
                }
              });
              cy.wrap(io.series.find(s => s.name === 'TOTAL READ').series[0].runnerGroups).should('not.be.undefined');

              cy.wrap(network.labels).should('have.length', 2);
              cy.wrap(network.formattingType).should('eq', 'MB');
              cy.wrap(network.series).should('have.length', 2);
              network.series.forEach((s, i) => {
                cy.wrap(s.name.toLowerCase()).should('eq', network.labels[i].toLowerCase());
                if (s.series.length) {
                  cy.wrap(s.series[0].name).should('not.be.undefined');
                  cy.wrap(s.series[0].value).should('not.be.undefined');
                }
              });

              Object.keys(panel).forEach(key => {
                cy.wrap(panel[key]).should('not.be.undefined');
              });
            }
          });
        });
    });
  });

  it('[SYSTEM RESOURCES] should sort threads by name', () => {
    cy.wait(5000).then(() => {
      cy.get('.thread-container .sort-option:first-child').click();
      cy.wait(1000).then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            store.subscribe(store => {
              cy.wrap(store.resources.systemResources.resourcesPanel.sortBy).should('eq', 'name');
            });
          });
      });
    });
  });

  it('[SYSTEM RESOURCES] should display charts', () => {
    cy.wait(1000)
      .then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            store.subscribe(store => {
              if (!isOctez(store)) {
                store.select('resources')
                  .subscribe(() => {
                    cy.get('.resource-category-block')
                      .its('length')
                      .should(value => expect(value).to.equal(3));
                    cy.get('app-tezedge-line-chart')
                      .its('length')
                      .should(value => expect(value).to.equal(3));
                  });
              }
            });
          });
      });
  });

  it('[SYSTEM RESOURCES] should display tooltip on chart when hovering on it', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(store => {
            if (!isOctez(store) && store.resources.systemResources) {
              cy.get('.tooltip-area')
                .its(2)
                .trigger('mousemove')
                .then(() => {
                  cy.wait(1000).then(() => {
                    cy.get('.ngx-charts-tooltip-content').should(value => expect(value).to.not.equal(undefined));
                  });
                });
            }
          });
        });
    });
  });

  it('[SYSTEM RESOURCES] should display redirection overlay on chart when clicking on it and navigate to network on click', () => {
    cy.wait(3000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(store => {
            if (!isOctez(store) && store.resources.systemResources) {
              cy.get('.tooltip-area')
                .its(2)
                .click(300, 20)
                .then(() => {
                  cy.wait(1000).then(() => {
                    cy.get('app-graph-redirection-overlay .redirection-overlay').should('be.visible');
                    cy.get('app-graph-redirection-overlay .redirection-overlay .pointer').first().click();

                    cy.wait(1000).then(() => {
                      cy.url().should('include', '/network?timestamp=');
                    });
                  });
                });
            }
          });
        });
    });
  });

  it('[SYSTEM RESOURCES] should display redirection overlay on chart when clicking on it and navigate to logs on click', () => {
    cy.wait(3000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(store => {
            if (!isOctez(store) && store.resources.systemResources) {
              cy.get('.tooltip-area')
                .its(2)
                .click(300, 20)
                .then(() => {
                  cy.wait(1000).then(() => {
                    cy.get('app-graph-redirection-overlay .redirection-overlay').should('be.visible');
                    cy.get('app-graph-redirection-overlay .redirection-overlay .pointer').last().click();

                    cy.wait(1000).then(() => {
                      cy.url().should('include', '/logs?timestamp=');
                    });
                  });
                });
            }
          });
        });
    });
  });

});
