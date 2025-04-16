const puppeteer = require('puppeteer');
// require('dotenv').config();

puplocalstorage = async (email, password) => {
    try {
        const data = await loginAndGetLocalStorage(
            "https://admin.ltimindtree.iamneo.ai/login", // Replace with the actual login URL
            // process.env.LTI_USER_NAME,                 
            // process.env.LTI_PASSWORD     
            email, password              
        );
        return data; // Return the data here
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error to handle it outside
    }

        async function loginAndGetLocalStorage(url, USEREMAIL, PASSWORD) {
            //   // Launch a headless browser
            const browser = await puppeteer.launch({ 
                headless: false,
                cacheDir: '/opt/render/.cache/puppeteer',
                
                args: [
                    '--no-sandbox',
                      '--disable-setuid-sandbox',
                      '--disable-dev-shm-usage',
                      '--remote-debugging-port=9222',
                      '--start-maximized',
                      '--ignore-certificate-errors'
                  ],
             }); // Set to false for debugging
            const page = await browser.newPage();
            await page.setViewport({
            width: 1480, // Full width for most screens
            height: 800, // Full height
            });
            try {
                await page.goto(url, { waitUntil: "networkidle2" });
                await page.type("#emailAddress", USEREMAIL);
                await page.type("#password", PASSWORD);
                await page.click(".form__button.ladda-button");
                await page.waitForNavigation({ waitUntil: "networkidle2" });
            
                await page.waitForSelector("li[ptooltip='Courses']", { visible: true });

                try {
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 10 seconds
                await page.click("li[ptooltip='Courses']");
                await new Promise(resolve => setTimeout(resolve, 4000)); // Wait for 10 seconds

                await page.waitForSelector("input[placeholder='Enter course name to search']", { visible: true });

                // Type 'abcd' into the search input
                await page.type("input[placeholder='Enter course name to search']", "LTIM Orchard Dotnet Dec 24 Batch 01 Assessment Course");
                await new Promise(resolve => setTimeout(resolve, 10000)); 

                // Wait for and click the search button
                await page.waitForSelector("button.search-icon", { visible: true });

                await page.click("button.search-icon");
                await new Promise(resolve => setTimeout(resolve, 4000)); 
                const courseText = 'LTIM Orchard Dotnet Dec 24 Batch 01 Assessment Course';

                const clicked = await page.evaluate((text) => {
                const xpath = `//*[contains(text(), "${text}")]`;
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const node = result.singleNodeValue;
                if (node) {
                    node.click();
                    return true;
                }
                return false;
                }, courseText);

                if (!clicked) {
                console.log("❌ Course not found or click failed.");
                } else {
                console.log("✅ Course clicked successfully.");
                }
                await new Promise(resolve => setTimeout(resolve, 5000)); 


                const moduleText = 'Milestone 01';

                const clicked1 = await page.evaluate((text) => {
                const xpath = `//*[contains(text(), "${text}")]`;
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const node = result.singleNodeValue;
                if (node) {
                    node.click();
                    return true;
                }
                return false;
                }, moduleText);

                if (!clicked1) {
                console.log("❌ Module not found or click failed.");
                } else {
                console.log("✅ Module clicked successfully.");
                }



                console.log("Clicked normally");
                } catch (e) {
                console.log("Normal click failed, trying evaluate...", e);
                await page.evaluate(() => {
                    const elem = document.querySelector("li[ptooltip='Courses']");
                    if (elem) elem.click();
                });
                }

                await page.waitForNavigation({ waitUntil: "networkidle2" });




                // wait for 5 sec
            // Extract local storage data
            const localStorageData = await page.evaluate(() => {
                const data = {};
                for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                data[key] = localStorage.getItem(key);
                }
                return data;
            });
        
            // console.log('Local Storage Data:', localStorageData.token);
            const tokenRegex = /"token":"(.*?)"/;
        
            // Extract the token
            const match = localStorageData.token.match(tokenRegex);
            let token;
            // Check and log the token
            if (match && match[1]) {
                token = match[1];
                // console.log("Extracted Token:", token);
            } else {
                console.log("Token not found.");
            }
        
            // Return the extracted data
            return token;
            } catch (error) {
            console.error('Error during login or local storage extraction:', error);
            throw error;
            } finally {
            // Close the browser
            await browser.close();
            }
        }

}

puplocalstorage("divakar.s@iamneo.ai","divakar.s@308")