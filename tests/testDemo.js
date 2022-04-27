/**
 * Simple form fill test using Selenium
 * 
 * @author Mark Kim
 * Based off of tutorial code from https://youtu.be/BQ-9e13kJ58
 * 
 * @date 04/26/2022
 * @purpose To demo a simple form fill via Selenium WebDriver API
 * @descripion This demo will open a Firefox browser window, navigate to
 *      http://lambdatest.github.io/sample-todo-app/ and add two items
 *      to the todo list.  Once complete, it will do a data assertion
 *      to ensure that the expected text matches the action test.  Finally,
 *      this script will close the browser.  Notice that all driver functions
 *      are asynchronous.
 * 
 */

const {Builder, By, Key} = require('selenium-webdriver');
const assert = require('assert');  // part of node library

/**
 * Example function containing all logic for this form fill test
 */
async function example() {
    // Launch the browser
    const driver = await new Builder().forBrowser("firefox").build();

    // Navigate to the web application
    await driver.get('http://lambdatest.github.io/sample-todo-app/');

    // Add a todo
    const expectedText = 'Learn Selenium';
    const badText = 'This is wrong';

    // Filling form data by using the enter/return key
    await driver.findElement(By.id('sampletodotext')).sendKeys(expectedText, Key.RETURN);

    // fill form by mouse click
    await driver.findElement(By.id('sampletodotext')).sendKeys(badText);
    await driver.findElement(By.id('addbutton')).click();

    // Pull the text from the last item added to the todo list
    const actualText = await driver.findElement(By.xpath("//li[last()]")).getText();
    
    try {
        // Assert that the actual text entered matches the expected text
        assert.strictEqual(actualText, expectedText);
    } catch (err) {
        console.log(err);
    } finally {
        // Close Browser
        await driver.quit();
    }
}

// Run example function
example();