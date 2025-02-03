describe('Cypress simulator', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('./src/index.html?skipCaptcha=true&chancesOfError=0', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cookieConsent', 'accepted')
      }
    })
  })

  it('shows an error when entering and running a valid Cypress command without parentheses (e.g., cy.visit)', () => {
    cy.run('cy.visit')

    cy.get('#outputArea', { timeout: 10000 })
      .should('contain', 'Error:')
      .and('contain', 'Missing parentheses on `cy.visit` command')
      .and('be.visible')
  })

  it('checks the run button disabled and enabled states', () => {
    cy.contains('button', 'Run')
      .as('runButton')
      .should('be.disabled')

    cy.get('textarea[placeholder="Write your Cypress code here..."]')
      .as('textArea')
      .type('cy.log(`Yo`)')

    cy.get('@runButton')
      .should('be.enabled')

    cy.get('@textArea')
      .clear()

  })

  it('clears the code input when logging off then logging in again', () => {
    cy.get('textarea[placeholder="Write your Cypress code here..."]')
      .as('textArea')
      .type('123')

    cy.get('#sandwich-menu').click()
    cy.contains('button', 'Logout').click()
    cy.contains('button', 'Login').click()

    cy.get('@textArea')
      .should('have.value', '')
  })

  it('disables the run button when logging off then logging in again', () => {
    cy.get('textarea[placeholder="Write your Cypress code here..."]')
      .as('textArea')
      .type('123')

    cy.get('#sandwich-menu').click()
    cy.contains('button', 'Logout').click()
    cy.contains('button', 'Login').click()

    cy.contains('button', 'Run')
      .should('be.disabled')
  })

  it('clears the code output when logging off then logging in again', () => {
    cy.run('cy.log(`Yo`)')

    cy.get('#outputArea', { timeout: 10000 })
      .as('outputArea')
      .should('contain', 'Success:')
      .and('contain', 'cy.log(`Yo`) // Logged message `Yo`')
      .and('be.visible')

    cy.get('#sandwich-menu').click()
    cy.contains('button', 'Logout').click()
    cy.contains('button', 'Login').click()

    cy.get('@outputArea')
      .should('not.contain', 'cy.log(`Yo`)')
  })

  it('does not show the cookie consent banner on the login page', () => {
    cy.clearAllLocalStorage()
    cy.reload()

    cy.contains('button', 'Login')
      .should('be.visible')
    cy.get('#cookieConsent')
      .should('not.be.visible')
  })
})

describe('Cypress simulator - Cookie consent', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('./src/index.html?skipCaptcha=true&chancesOfError=0')
  })

  it('declines on the cookies usage', () => {
    cy.get('#cookieConsent')
      .as('cookieConsentBanner')
      .find('button:contains("Decline")')
      .click()

    cy.get('@cookieConsentBanner')
      .should('not.be.visible')

    cy.window().its('localStorage.cookieConsent')
      .should('be.equal', 'declined')
  })
})

describe('Glitch in the matrix', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('./src/index.html?skipCaptcha=true&chancesOfError=1', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cookieConsent', 'accepted')
      }
    })
  })

  it('errors out with a glitch in the Matrix', () => {
    cy.run('cy.visit(htt.://example.com)')

    cy.get('#outputArea', { timeout: 6000 })
      .should('contain', "There's a glitch in the Matrix.")
      .and('be.visible')
  })
})