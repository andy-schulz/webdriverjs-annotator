
import  {Annotator} from "../Annotator"
import {Builder, By, promise, WebDriver} from "selenium-webdriver";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;


describe("Using the Annotate object", () => {
    let driver: WebDriver;
    promise.USE_PROMISE_MANAGER = false;

    beforeAll(async () => {
        driver = await new Builder()
            .usingServer("http://127.0.0.1:4444/wd/hub")
            .forBrowser('chrome').build();
    });

    describe('to show a message ', function () {

        it('should create different UUIDs', async function () {
            const driver2 = await new Builder()
                .usingServer("http://127.0.0.1:4444/wd/hub")
                .forBrowser('chrome').build();

            const driver3 = await new Builder()
                .usingServer("http://127.0.0.1:4444/wd/hub")
                .forBrowser('chrome').build();

            const uuid1 = await Annotator.displayTestMessage(driver,"driver1");
            const uuid2 = await Annotator.displayTestMessage(driver,"driver1");
            const uuid3 = await Annotator.displayTestMessage(driver,"driver1");

            expect(uuid1).toEqual(uuid2);
            expect(uuid1).toEqual(uuid3);

            expect(uuid1).toMatch(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/);

            await driver2.quit();
            await driver3.quit();
        });

        it('should display the test message', async function () {

            await driver.get('http://localhost:3000');

            const uuid = await Annotator.displayTestMessage(driver, "trying to find element by Xpath: //*/button[contains(., '1')]");
            const element = await driver.findElement(By.css(`#${uuid}`));

            expect(await element.isDisplayed()).toBe(true);

            await Annotator.hideTestMessage(driver);

            expect(await element.isDisplayed()).toBe(false)


        }, 15000);



    });

    describe('to highlight an element', function () {

        it('should succeed if one element is highlighted two times', async function () {
            await driver.get('http://localhost:3000');

            const element1 = await driver.findElement(By.xpath("//*/button[contains(., '1')]"));
            await Annotator.highlight(driver, element1);
            expect(await element1.getAttribute('style')).toBe("color: red; border: 2px solid red;",
                "check element1 after it was highlighted");

            await Annotator.highlight(driver, element1);
            expect(await element1.getAttribute('style')).toBe("color: red; border: 2px solid red;",
                "check element1 after it was highlighted the second time");
        });

        it('should highlight the element again after page reload', async function () {
            await driver.get('http://localhost:3000');

            const element1 = await driver.findElement(By.xpath("//*/button[contains(., '1')]"));
            await Annotator.highlight(driver, element1);
            expect(await element1.getAttribute('style')).toBe("color: red; border: 2px solid red;",
                "check element1 after it was highlighted");

            await driver.get('http://localhost:3000');

            const element11 = await driver.findElement(By.xpath("//*/button[contains(., '1')]"));
            await Annotator.highlight(driver, element11);
            expect(await element11.getAttribute('style')).toBe("color: red; border: 2px solid red;",
                "check element1 after it was highlighted the second time after page reload");
        });

        it('should highlight the calculator button', async function () {

            await driver.get('http://localhost:3000');

            const element = await driver.findElement(By.xpath("//*/button[contains(., '1')]"));

            await Annotator.highlight(driver, element);

            expect(await element.getAttribute('style')).toBe("color: red; border: 2px solid red;");

            await element.click();

            expect(await element.getAttribute('style')).toBe("color: red; border: 2px solid red;");

        }, 10000);

        it('should unhighlight the first element when the second element is highlighted', async function () {

            await driver.get('http://localhost:3000');

            const element1 = await driver.findElement(By.xpath("//*/button[contains(., '1')]"));
            const element2 = await driver.findElement(By.xpath("//*/button[contains(., '2')]"));

            expect(await element1.getAttribute('style')).toBe("", "initial check on element1");
            expect(await element2.getAttribute('style')).toBe("", "initial check on element2");

            await Annotator.highlight(driver, element1);

            expect(await element1.getAttribute('style')).toBe("color: red; border: 2px solid red;",
                "check element1 after it was highlighted");

            expect(await element2.getAttribute('style')).toBe("",
                "check element2 after element1 was highlighted");

            await Annotator.highlight(driver, element2);

            expect(await element1.getAttribute('style')).toBe("",
                "check element1 after element 2 was highlighted");

            expect(await element2.getAttribute('style')).toBe("color: red; border: 2px solid red;",
                "check element2 after it was highlighted");

        });

    });

    describe('on the google seach side', function () {

        it('should show a message on the side', async function () {
            await driver.get("www.google.com");

            await Annotator.displayTestMessage(driver, "I am on the Google search side");

        });
    });
    afterAll(async () => {
        await driver.quit();
    })
});