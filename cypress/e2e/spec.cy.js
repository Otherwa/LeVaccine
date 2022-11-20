describe('gets the homepage', () => {
  it('passes', () => {
    cy.visit('https://levaccine.herokuapp.com/').then((contentWindow) => {
      // contentWindow is the remote page's window object
      console.log(contentWindow)
    })
  })
})
