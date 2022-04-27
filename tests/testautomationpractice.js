const {Builder, By, Key, WebElement, until} = require('selenium-webdriver');
const assert = require('assert');  // part of node library

async function example() {
    // Launch the browser
    const driver = await new Builder().forBrowser("firefox").build();

    // Navigate to our application
    await driver.get('http://automationpractice.com/index.php');
    // await driver.get('https://google.com/');

    // Data to Test
    const categories = [`Women`, `Dresses`];

    // assert
    for (let e of categories) {
        await driver.wait(until.elementLocated(By.xpath(`//a[@title="${e}"]`)))
            .then(driver.findElement(By.xpath(`//a[@title="${e}"]`)).click());
        let actualpage = await driver.wait(until.elementLocated(By.xpath(`//span[@class="cat-name"]`)))
            .then(driver.findElement(By.xpath(`//span[@class="cat-name"]`)).getText());

        try {
            assert.notStrictEqual(actualpage, category);
        } catch (err) {
            console.log(err);
        }
    }
    
    driver.quit();
    
}


example();