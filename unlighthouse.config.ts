export default {
    site: 'https://smart-procurement-system.netlify.app/',
    scanner: {
      // run lighthouse for each URL 3 times
      samples: 3,
      // use desktop to scan
      device: 'desktop',
      // enable the throttling mode
      throttle: true,
    },
    debug: true,
    // hooks: {
    //   async authenticate(page) {
    //     // login to the page
    //     await page.goto('https://example.com/login')
    //     const emailInput = await page.$('input[type="email"]')
    //     await emailInput.type('admin@example.com')
    //     const passwordInput = await page.$('input[type="password"]')
    //     await passwordInput.type('password')
    //     await Promise.all([
    //       page.$eval('.login-form', form => form.submit()),
    //       page.waitForNavigation(),
    //     ])
    //   },
    // },
  }
  