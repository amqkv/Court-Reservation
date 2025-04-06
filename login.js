const puppeteer = require("puppeteer");
require("dotenv").config();

const DATE = "2025-04-07";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./user_data",
  });
  const page = await browser.newPage();
  const reservationUrl = `https://loisirs.montreal.ca/IC3/#/U6510/search/?searchParam=%7B%22filter%22:%7B%22isCollapsed%22:false,%22value%22:%7B%22dates%22:%5B%22${DATE}T00:00:00.000-04:00%22%5D%7D%7D,%22search%22:%22badminton%22,%22sortable%22:%7B%22isOrderAsc%22:true,%22column%22:%22facility.name%22%7D%7D`;

  await page.goto(reservationUrl);

  //////////////////////////////////////////////////////////////////////////////////////////
  //                    COMMENT THIS SECTION IF ALREADY SIGNED IN                         //
  //////////////////////////////////////////////////////////////////////////////////////////

  const signInBtn = await page.waitForSelector("#u2000_btnSignIn");
  if (signInBtn != undefined) {
    await page.$$eval("#u2000_btnSignIn", (elm) => elm[0].click());
    const username = await page.waitForSelector("#signInName");
    const password = await page.waitForSelector("#password");
    await username.type(process.env.USERNAME);
    await password.type(process.env.PASSWORD);
    page.click("#next");

    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.waitForSelector("div.busy-indicator.ng-hide");
    await page.waitForSelector("#u2000_btnAcceptCookieUse");
    await page.click("#u2000_btnAcceptCookieUse");
  }
  //////////////////////////////////////////////////////////////////////////////////////////

  //   // SELECTING COURTS
  //   await page.waitForSelector("div.busy-indicator.ng-hide");

  //   await page.waitForSelector(
  //     "#searchResult > div.hidden-xs > div > table > tbody > tr"
  //   );
  //   const rows = await page.$$("tr");
  //   for (const row of rows) {
  //     const text = await row.evaluate((el) => el.innerText.trim());
  //     if (text.includes(NOM_DU_PLATEAU + COURT_NUMBER) && text.includes(TIME)) {
  //       const lastTd = await row.$("td:last-child");
  //       const button = await lastTd.$("button");

  //       if (button) {
  //         await button.click();
  //         const selectPersonBtn = await page.waitForSelector("#u3600_btnSelect0");
  //         await selectPersonBtn.click("#u3600_btnSelect0");

  //         const addToCardBtn = await page.waitForSelector("#u3600_btnCheckout0");
  //         addToCardBtn.click("#u3600_btnSelect0");
  //         console.log("done");
  //       } else {
  //         console.log("No button found in last <td>!");
  //       }
  //       break;
  //     }
  //   }

  //   console.log("Court reserved!");

  await browser.close();
})();
