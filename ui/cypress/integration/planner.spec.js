/// <reference types="cypress" />

function find_previous_month_year(month, year) {
  let previous_month = ""
  let previous_year = year

  switch(month){
    case "Jan":
      previous_month = "Dec"
      previous_year = year - 1
      break;
    case "Feb":
      previous_month = "Jan"
      break;
    case "Mar":
      previous_month = "Feb"
      break;
    case "Apr":
      previous_month = "Mar"
      break;
    case "May":
      previous_month = "Apr"
      break;
    case "Jun":
      previous_month = "May"
      break;
    case "Jul":
      previous_month = "Jun"
      break;
    case "Aug":
      previous_month = "Jul"
      break;
    case "Sep":
      previous_month = "Aug"
      break;
    case "Oct":
      previous_month = "Sep"
      break;
    case "Nov":
      previous_month = "Oct"
      break;
    case "Dec":
      previous_month = "Nov"
      break;
  }
  console.log(previous_month);
  return [previous_month, previous_year];
}

function find_next_month_year(month, year) {
  let next_month = ""
  let next_year = year

  switch(month){
    case "Jan":
      next_month = "Feb"
      break;
    case "Feb":
      next_month = "Mar"
      break;
    case "Mar":
      next_month = "Apr"
      break;
    case "Apr":
      next_month = "May"
      break;
    case "May":
      next_month = "Jun"
      break;
    case "Jun":
      next_month = "Jul"
      break;
    case "Jul":
      next_month = "Aug"
      break;
    case "Aug":
      next_month = "Sep"
      break;
    case "Sep":
      next_month = "Oct"
      break;
    case "Oct":
      next_month = "Nov"
      break;
    case "Nov":
      next_month = "Dec"
      break;
    case "Dec":
      next_month = "Jan"
     
      next_year = Number(next_year) + 1
      
      break;
  }
  console.log(next_month);
  return [next_month, next_year];
}

describe('example to-do app', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit('http://localhost:4200/planner')
    })
  
    it('Can initialize correctly with month view', () => { 
        // Ensure that view is set to month
        cy.get('mwl-demo-utils-calendar-header').should('have.attr', 'ng-reflect-view', 'month')
        cy.get('mwl-demo-utils-calendar-header').should('have.attr', 'ng-reflect-view-date')
        cy.get('.views').should('have.attr', 'ng-reflect-ng-switch', 'month')
        
        // Make sure that each day is in month view
        cy.get('.cal-cell-row').children().filter('mwl-calendar-month-cell').should("have.length", "35")
    })

    it('Can switch correctly to week view', () => {
      // We'll click on the "Week" button in order to
      // display week view
      cy.get(".btn").contains('Week').click()

      cy.get('mwl-demo-utils-calendar-header').should('have.attr', 'ng-reflect-view', 'week')
      cy.get('.views').should('have.attr', 'ng-reflect-ng-switch', 'week')

      // Make sure that each day is in month view
      cy.get('.cal-day-column').should("have.length", "7")
      cy.get('.cal-hour').should("have.length", "192")
    })

    it('Can switch correctly to day view', () => {
      // We'll click on the "Day" button in order to
      // display week view
      cy.get(".btn").contains('Day').click()

      cy.get('mwl-demo-utils-calendar-header').should('have.attr', 'ng-reflect-view', 'day')
      cy.get('.views').should('have.attr', 'ng-reflect-ng-switch', 'day')

      // Make sure that each day is in month view
      cy.get('.cal-hour').should("have.length", "24")
    })

    it('Can switch to previous month correctly', () => {
     
      let weekday = "";
      let month = "";
      let date = "";
      let year = 0;

      let words = []
      cy.get('mwl-demo-utils-calendar-header').then(elem => {
        const date_string = String(elem.attr("ng-reflect-view-date"));
        console.log(date_string);
        words = date_string.split(' ')
        weekday = words[0];
        month = words[1];
        date = words[2];
        year = words[3];

        let previous_month = month;
        let previous_year = year;
    
        let data = [];

        for(let i = 0; i < 24; i++){
          data = find_previous_month_year(previous_month, previous_year);
          previous_month = data[0];
          previous_year = data[1];

          cy.get(".btn").contains('Previous').click();

          expect(cy.get("mwl-demo-utils-calendar-header").contains(previous_month));
          expect(cy.get("mwl-demo-utils-calendar-header").contains(previous_year));

          expect(cy.get("h3").contains(previous_month));
          expect(cy.get("h3").contains(previous_year));
        }
      })
    })

    it('Can switch to next month correctly', () => {
     
      let weekday = "";
      let month = "";
      let date = "";
      let year = 0;

      let words = []
      cy.get('mwl-demo-utils-calendar-header').then(elem => {
        const date_string = String(elem.attr("ng-reflect-view-date"));
        console.log(date_string);
        words = date_string.split(' ')
        weekday = words[0];
        month = words[1];
        date = words[2];
        year = words[3];

        let next_month = month;
        let next_year = year;
    
        let data = [];

        for(let i = 0; i < 24; i++){
          data = find_next_month_year(next_month, next_year);
          next_month = data[0];
          next_year = data[1];
          console.log(next_year);
          cy.get(".btn").contains('Next').click();

          expect(cy.get("mwl-demo-utils-calendar-header").contains(next_month));
          expect(cy.get("mwl-demo-utils-calendar-header").contains(next_year));

          expect(cy.get("h3").contains(next_month));
          expect(cy.get("h3").contains(next_year));
        }
      })
    })

    it('Can switch to previous week correctly', () => {
     
      let weekday = "";
      let month = "";
      let date = "";
      let year = 0;

      let words = []

      cy.get('h3').then(elem => {
        

      })
      cy.get('mwl-demo-utils-calendar-header').then(elem => {
        const date_string = String(elem.attr("ng-reflect-view-date"));
        console.log(date_string);
        words = date_string.split(' ')
        weekday = words[0];
        month = words[1];
        date = words[2];
        year = words[3];

        let next_week_start = 0;
        let next_year_end = 0;
    
        let data = [];

        cy.get(".btn").contains('Week').click()

        for(let i = 0; i < 24; i++){
          data = find_next_month_year(next_month, next_year);
          next_month = data[0];
          next_year = data[1];
          console.log(next_year);
          cy.get(".btn").contains('Previous');
          expect(cy.get("mwl-demo-utils-calendar-header").contains(next_month));
          expect(cy.get("mwl-demo-utils-calendar-header").contains(next_year));

          expect(cy.get("h3").contains(next_month));
          expect(cy.get("h3").contains(next_year));
        }
      })
    })
  })
  