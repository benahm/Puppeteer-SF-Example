const puppeteer = require("puppeteer");

/*
 * Puppeteer script to activate a user interface option
 */

// org credentials
const credentials = {
  username: "test-szxxauz1kct8@example.com",
  password: "XXXXXXX"
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./userDataDir"
  });
  const page = await browser.newPage();

  await page.waitFor(1000);

  const navigationPromise = page.waitForNavigation();

  await page.goto("https://test.salesforce.com/");

  await page.setViewport({ width: 1516, height: 699 });

  await navigationPromise;

  await page.waitForSelector("body > #left #main");
  await page.click("body > #left #main");

  // type username
  await page.type(
    "#login_form > #usernamegroup > #username_container #username",
    credentials.username
  );

  await page.waitForSelector("#wrapper > #content > #theloginform #password");
  await page.click("#wrapper > #content > #theloginform #password");

  // type password
  await page.type(
    "#wrapper > #content > #theloginform #password",
    credentials.password
  );

  await page.waitForSelector("#wrapper > #content > #theloginform #Login");
  // login
  await page.click("#wrapper > #content > #theloginform #Login");

  await page.waitForSelector(
    "#oneHeader > div.slds-global-header.slds-grid.slds-grid--align-spread > span > ul > li:nth-child(6) > div > div > div.uiPopupTrigger.forceHeaderMenuTrigger > div > div > a"
  );
  // click gear
  await page.click(
    "#oneHeader > div.slds-global-header.slds-grid.slds-grid--align-spread > span > ul > li:nth-child(6) > div > div > div.uiPopupTrigger.forceHeaderMenuTrigger > div > div > a"
  );

  await page.waitForSelector(
    ".scrollable > #all_setup_home > a > .slds-grid > .slds-col"
  );
  const newPagePromise = new Promise(x =>
    browser.once("targetcreated", target => x(target.page()))
  );
  // click setup
  await page.click(
    ".scrollable > #all_setup_home > a > .slds-grid > .slds-col"
  );

  // get instance of the new opened page
  const newPage = await newPagePromise;
  await newPage.setViewport({ width: 1516, height: 699 });

  await newPage.waitForSelector(
    "#split-left > div > div > div > div > div > input"
  );
  // type the search input
  await newPage.click("#split-left > div > div > div > div > div > input");
  // search User Interface
  await newPage.type(
    "#split-left > div > div > div > div > div > input",
    "User Interface"
  );

  await newPage.waitForSelector(
    "ul > .leaf > .slds-tree__item > .slds-tree__item-label > .highlight"
  );
  // click user interface item
  await newPage.click(
    "ul > .leaf > .slds-tree__item > .slds-tree__item-label > .highlight"
  );
  await newPage.waitFor(1000);

  // wait for the iframe to load
  await newPage.waitForSelector("iframe[title*='User Interface']");

  let frames = await newPage.frames();
  const userInterfaceFrame = frames.find(f => {
    return f.url().includes("/ui/setup/org/UserInterfaceUI");
  });
  await userInterfaceFrame.waitFor(1000);

  await userInterfaceFrame.waitForSelector("#auditFieldInactiveOwner");
  //   click the user interface option
  await userInterfaceFrame.click("#auditFieldInactiveOwner");
  await userInterfaceFrame.waitFor(2000);

  await userInterfaceFrame.waitForSelector("table #saveButton");
  // click the save button
  await userInterfaceFrame.click("table #saveButton");

  await newPage.waitFor(5000);

  await browser.close();
})();
