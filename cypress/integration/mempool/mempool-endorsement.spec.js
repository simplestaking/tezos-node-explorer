import { testForTezedge } from '../../support';

const beforeEndorsementTest = (test) => {
  let tested = false;
  cy.visit(Cypress.config().baseUrl + '/#/mempool/endorsements', { timeout: 100000 })
    .window()
    .its('store')
    .then({ timeout: 6500 }, store => {
      return new Cypress.Promise((resolve) => {
        setTimeout(() => resolve(), 6000);
        store.select('mempool').subscribe(mempool => {
          if (!tested && mempool.endorsementState.endorsements.length > 0) {
            tested = true;
            testForTezedge(test);
            resolve();
          }
        });
      });
    });
};

context('MEMPOOL ENDORSEMENT', () => {

  // it('[MEMPOOL ENDORSEMENT] should have status code 200 for get mempool operations request', () => beforeEndorsementTest(() => {
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       store.select('settingsNode').subscribe(settingsNode => {
  //         store.select(state => state.monitoring.networkStats).subscribe(networkStats => {
  //           const currentBlock = networkStats.lastAppliedBlock.hash;
  //           const level = networkStats.lastAppliedBlock.level;
  //           if (currentBlock && level) {
  //             cy.request(`${settingsNode.activeNode.http}/dev/shell/automaton/endorsing_rights?block=${currentBlock}&level=${level}`)
  //               .its('status')
  //               .should('eq', 200);
  //           }
  //         });
  //       });
  //     });
  // }));
  //
  it('[MEMPOOL ENDORSEMENT] should create rows for the virtual scroll table', () => beforeEndorsementTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.endorsementState.endorsements.length > 0) {
            cy.get('app-endorsement .table-container .row')
              .should('be.visible');
          }
        });
      });
  }));
  //
  // it('[MEMPOOL ENDORSEMENT] should display correct color based on status', () => beforeEndorsementTest(() => {
  //   let oneStrike = false;
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       store.select('mempool').subscribe(mempool => {
  //         if (mempool.endorsementState.endorsements.length > 0) {
  //           console.log(mempool.endorsementState.endorsements.length);
  //           if (!oneStrike) {
  //             oneStrike = true;
  //             const endorsements = mempool.endorsementState.endorsements;
  //             endorsements.forEach((endorsement, index) => {
  //               cy.get('.row:nth-child(' + (index + 1) + ')')
  //                 .find('.status')
  //                 .should('have.class', endorsement.status || 'missing', { timeout: 0 });
  //             });
  //           }
  //         }
  //       });
  //     });
  // }));
  //
  // it('[MEMPOOL ENDORSEMENT] should show red text for big values for delta column', () => beforeEndorsementTest(() => {
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       store.select('mempool').subscribe(mempool => {
  //         if (mempool.endorsementState.endorsements.length > 0) {
  //           if (mempool.endorsementState.endorsements[0].delta > 50000000) {
  //             cy.get('.row:not(.head):first-child span:nth-child(4) span.text-red')
  //               .should('be.visible');
  //           }
  //         }
  //       });
  //     });
  // }));
  //
  // it('[MEMPOOL ENDORSEMENT] should show yellow text for big values for delta column', () => beforeEndorsementTest(() => {
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       store.select('mempool').subscribe(mempool => {
  //         if (mempool.endorsementState.endorsements.length > 0) {
  //           const index = mempool.endorsementState.endorsements.findIndex(e => e.delta > 20000000 && e.delta < 50000000);
  //           if (index !== -1) {
  //             cy.get('.row:not(.head):nth-child(' + (index + 1) + ') span:nth-child(4) span.text-yellow')
  //               .should('be.visible');
  //           }
  //         }
  //       });
  //     });
  // }));
  //
  // it('[MEMPOOL ENDORSEMENT] should sort column by decode delta', () => beforeEndorsementTest(() => {
  //   let sorted = false;
  //   let checked = false;
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       store.select('mempool').subscribe(mempool => {
  //         const mempoolEndorsements = mempool.endorsementState.endorsements;
  //         if (mempoolEndorsements.length > 0) {
  //           if (sorted && !checked) {
  //             checked = true;
  //             mempoolEndorsements.forEach((e, i) => {
  //               if (mempoolEndorsements[i + 1]) {
  //                 expect((mempoolEndorsements[i].decodeTimeDelta ?? 0) >= (mempoolEndorsements[i + 1].decodeTimeDelta ?? 0)).to.be.true;
  //               }
  //             });
  //           }
  //           if (!sorted) {
  //             cy.get('.row.head span:nth-child(7)')
  //               .click()
  //               .wait(500)
  //               .get('.row.head span:nth-child(7) mat-icon.show')
  //               .should('be.visible')
  //               .then(() => sorted = true);
  //           }
  //         }
  //       });
  //     });
  // }));
  //
  // it('[MEMPOOL ENDORSEMENT] should sort column by decode', () => beforeEndorsementTest(() => {
  //   let sorted = false;
  //   let checked = false;
  //   cy.get('.row.head span:last-child mat-checkbox')
  //     .click()
  //     .wait(500)
  //     .window()
  //     .its('store')
  //     .then(store => {
  //       store.select('mempool').subscribe(mempool => {
  //         const mempoolEndorsements = mempool.endorsementState.endorsements;
  //         if (mempoolEndorsements.length > 0) {
  //           if (sorted && !checked) {
  //             checked = true;
  //             mempoolEndorsements.forEach((e, i) => {
  //               if (mempoolEndorsements[i + 1]) {
  //                 expect((mempoolEndorsements[i].decodeTime ?? 0) >= (mempoolEndorsements[i + 1].decodeTime ?? 0)).to.be.true;
  //               }
  //             });
  //             return;
  //           }
  //           if (!sorted) {
  //             cy.get('.row.head span:nth-child(7)')
  //               .click()
  //               .wait(500)
  //               .get('.row.head span:nth-child(7) mat-icon.show')
  //               .should('be.visible')
  //               .then(() => sorted = true);
  //           }
  //         }
  //       });
  //     });
  // }));
  //
  // it('[MEMPOOL ENDORSEMENT] should move searched baker at the top of the table', () => beforeEndorsementTest(() => {
  //   let haveValue;
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       store.select('mempool').subscribe(mempool => {
  //         if (mempool.endorsementState.endorsements.length > 9) {
  //           const tenthEndorsement = mempool.endorsementState.endorsements[9];
  //           if (!haveValue) {
  //             haveValue = true;
  //             cy.get('app-endorsement .table-container .row:nth-child(10) span:nth-child(2) span')
  //               .should(span => {
  //                 expect(span.text().trim()).to.equal(tenthEndorsement.bakerName || tenthEndorsement.bakerHash);
  //               })
  //               .get('app-endorsement .table-container .row:nth-child(1) span:nth-child(2) span')
  //               .should(span => {
  //                 expect(span.text().trim()).to.not.equal(tenthEndorsement.bakerName || tenthEndorsement.bakerHash);
  //               })
  //               .get('.table-footer input')
  //               .type(tenthEndorsement.bakerHash, { force: true })
  //               .wait(300)
  //               .get('app-endorsement .table-container .row:nth-child(1) span:nth-child(2) span')
  //               .should(span => {
  //                 expect(span.text().trim()).to.equal(tenthEndorsement.bakerName || tenthEndorsement.bakerHash);
  //                 expect(localStorage.getItem('activeBaker')).to.equal(tenthEndorsement.bakerHash);
  //               });
  //           }
  //         }
  //       });
  //     });
  // }));
  //
  // it('[MEMPOOL ENDORSEMENT] should display statistics for all types of endorsements', () => beforeEndorsementTest(() => {
  //   let haveValue;
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       store.select('mempool').subscribe(mempool => {
  //         if (mempool.endorsementState.endorsements.length > 0) {
  //           const stats = mempool.endorsementState.statistics;
  //           if (!haveValue) {
  //             haveValue = true;
  //             cy.get('app-endorsement-statistics .mem-stats-row:nth-child(2) div:last-child')
  //               .should(div => {
  //                 expect(div.text().trim()).to.equal(stats.endorsementTypes[0].value.toString());
  //               })
  //               .get('app-endorsement-statistics .mem-stats-row:nth-child(3) div:last-child')
  //               .should(div => {
  //                 expect(div.text().trim()).to.equal(stats.endorsementTypes[1].value.toString());
  //               })
  //               .get('app-endorsement-statistics .mem-stats-row:nth-child(4) div:last-child')
  //               .should(div => {
  //                 expect(div.text().trim()).to.equal(stats.endorsementTypes[2].value.toString());
  //               })
  //               .get('app-endorsement-statistics .mem-stats-row:nth-child(5) div:last-child')
  //               .should(div => {
  //                 expect(div.text().trim()).to.equal(stats.endorsementTypes[3].value.toString());
  //               })
  //               .get('app-endorsement-statistics .mem-stats-row:nth-child(6) div:last-child')
  //               .should(div => {
  //                 expect(div.text().trim()).to.equal(stats.endorsementTypes[4].value.toString());
  //               })
  //               .get('app-endorsement-statistics .mem-stats-row:nth-child(7) div:last-child')
  //               .should(div => {
  //                 expect(div.text().trim()).to.equal(stats.endorsementTypes[5].value.toString());
  //               });
  //           }
  //         }
  //       });
  //     });
  // }));
});
