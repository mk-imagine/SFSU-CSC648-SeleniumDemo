/**
 * Another simple scipt that tests form fills and site navigation
 * 
 * @author Mark Kim
 * @date 04/26/2022
 * @purpose To demo login and site navigation via Selenium WebDriver API
 * @descripion This demo will open a Firefox browser window, navigate to
 *      https://www.phptravels.net/login.  Once there, this script will
 * 		login to the website, navigate to the hotels listing page, then
 * 		grab the list of all the Hotels available.  This script asserts
 * 		that the destination url matches the expected url for all navigation
 * 		and also asserts that the list of Hotels available matches
 * 		the expected Hotel list.
 */

const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert"); // part of node library
const { AssertionError } = require("assert");

/**
 * Login Credentials for Demo Site
 */
const credentials = {
	login: {
		customer: `user@phptravels.com`,
		agent: `agent@phptravels.com`,
		admin: `admin@phptravels.com`,
		supplier: `supplier@phptravels.com`,
		incorrect: `dummy@nowhere.com`,
	},
	password: {
		customer: `demouser`,
		agent: `demoagent`,
		admin: `demoadmin`,
		supplier: `demosupplier`,
		incorrect: `abcdefghijk`,
	},
};

/**
 * URLs for Demo Site
 */
const url = {
	login: `https://www.phptravels.net/login`,
	logout: `https://www.phptravels.net/account/logout`,
	target: {
		dashboard: `https://www.phptravels.net/account/dashboard`,
		failed: `https://www.phptravels.net/login/failed`,
		hotels: `https://www.phptravels.net/hotels`,
	},
};

/**
 * Test Example
 */
async function example() {
	// Launch the browser
	console.log("Launching browser and beginning tests");
	const driver = await new Builder().forBrowser("firefox").build();

	/**
	 * Navigate to the web application
	 * Other navigation functions:
	 *      .navigate()
	 *          .forward()
	 *          .back()
	 *          .refresh()
	 */
	await driver.get(url.login);

	/**
	 * Get title of page
	 * Other metadata attributes that can be retrieved:
	 *      .getCurrentUrl()
	 *      .getSession()
	 */
	const title = await driver.getTitle();
	console.log("Website Title: " + title);

	// Declare url variables to test against
	var expectedUrl;
	var actualUrl;

	// Test Login
	await testLogin(driver);
	console.log("Login Test Successful");

	// Test Hotel Search Page
	await testHotelPage(driver);
	console.log("Hotel Page Test Successful");

	// Test and View Hotel List
	await pullHotelList(driver);
	console.log("Hotel List Pull Successful");

	// await driver.quit();
}

/**
 * Test Login Page
 * @param {*} driver
 */
async function testLogin(driver) {
	// Url to test against
	expectedUrl = url.target.dashboard;

	try {
		// By.xpath() allows one to choose the tag name and attribute to search for
		driver
			.findElement(By.xpath(`//input[@name="email"]`))
			.sendKeys(credentials.login.customer);
		driver
			.findElement(By.xpath(`//input[@name="password"]`))
			.sendKeys(credentials.password.customer, Key.ENTER);

		// Wait for the load bar to go stale, prompting that the destination page
		// has loaded
		await driver.wait(
			until.stalenessOf(
				driver.findElement(By.xpath(`//span[@class="ladda-spinner"]`))
			)
		);
		actualUrl = await driver.getCurrentUrl();
		title = await driver.getTitle();

		// Check to see if the actual url == expected url
		assert.strictEqual(actualUrl, expectedUrl);
	} catch (err) {
		console.log(err);
	}
}

/**
 * Test Hotel List Landing Page
 * @param {*} driver
 */
async function testHotelPage(driver) {
	// Url to test against
	expectedUrl = url.target.hotels;

	try {
		await driver
			.findElement(By.xpath(`//a[@href="${url.target.hotels}"]`))
			.click();
		actualUrl = await driver.getCurrentUrl();
		assert.strictEqual(actualUrl, expectedUrl);
	} catch (err) {
		console.log(err);
	}
}

/**
 * Pull List of Hotels Available
 * @param {*} driver
 */
async function pullHotelList(driver) {
	try {
		// Find all hotel cards (including hidden ones)
		let hotels = await driver.findElements(
			By.xpath(`//h3[@class="card-title"]`)
		);

		// Retrieve the title of each hotel and enter into array
		let actualHotels = new Array();
		for (let i = 0; i < hotels.length; i++) {
			let hotel = await hotels[i].getAttribute("textContent");
			if (actualHotels.indexOf(hotel) == -1) actualHotels.push(hotel);
		}

		// Array of hotels to test against
		const expectedHotels = [
			'Alzer Hotel Istanbul',
			'Malmaison Manchester',
			'Oasis Beach Tower',
			'Jumeirah Beach Hotel',
			'Madinah Moevenpick Hotel',
			'Rendezvous Hotels',
			'Hyatt Regency Perth',
			'Islamabad Marriott Hotel',
			'Rose Rayhaan Rotana'];

		// Check to see if hotel lists match
		if (!equalsUnordered(actualHotels, expectedHotels)) {
			throw new AssertionError({
				message: "Expected Hotels list do not match expected values",
				actual: actualHotels.toString(),
				expected: expectedHotels.toString(),
				operator: 'equalsUnordered(a,b)'
			});
		}

		// List available hotels on console
		console.log(actualHotels);
	} catch (err) {
		console.log(err);
	}
}

/**
 * Check to see if two arrays contain the same elements
 * Code from: https://www.30secondsofcode.org/articles/s/javascript-array-comparison
 * @param {*} a 
 * @param {*} b 
 * @returns boolean
 */
const equalsUnordered = (a, b) => {
	// Check to see that both arrays are the same length
	if(a.length !== b.length) return false;

	// Enters only unique values in both arrays into a Set
	const uniqueValues = new Set([...a, ...b]);

	// Check to see if the two arrays contain the same elements
	for (const v of uniqueValues) {
		// Uses Array.prototype.filter() to count the number of
		// matches each value from uniqueValues has with each array
		const aCount = a.filter(e => e === v).length;
		const bCount = b.filter(e => e === v).length;
		// If there is a discrepancy in counts, return false
		if (aCount !== bCount) return false;
	}
	return true;
}

example();