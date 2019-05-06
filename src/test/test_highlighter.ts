
import {Annotator} from "../Annotator"
import {Builder, By, WebDriver} from "selenium-webdriver";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe("Using the Annotate object", () => {
    let driver: WebDriver;

    beforeAll(async () => {
        driver = await new Builder()
            .usingServer("http://127.0.0.1:4444/wd/hub")
            .forBrowser('chrome').build();
    });

    describe('', function () {

        fit('should create different UUIDs', async function () {
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

            console.log(uuid1);
            expect(uuid1).toMatch(/([a-z](0-9)){9}/)
            // a665c2e49-7cb6-4998-b2ba-d6de0fe2114c

            await driver2.quit();
            await driver3.quit();
        });



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
        expect(await element1.getAttribute('style')).toBe("");
        expect(await element2.getAttribute('style')).toBe("");

        await Annotator.highlight(driver, element1);
        expect(await element1.getAttribute('style')).toBe("color: red; border: 2px solid red;");
        expect(await element2.getAttribute('style')).toBe("");

        await Annotator.highlight(driver, element2);
        expect(await element1.getAttribute('style')).toBe("");
        expect(await element2.getAttribute('style')).toBe("color: red; border: 2px solid red;");

    });

    it('should display the test message', async function () {

        await driver.get('http://localhost:3000');

        const uuid = await Annotator.displayTestMessage(driver, "trying to find element by Xpath: //*/button[contains(., '1')]");
        const element = await driver.findElement(By.xpath("//*/button[contains(., '1')]"));
        await Annotator.hideTestMessage(driver);


    }, 10000);

    afterAll(async () => {
        await driver.quit();
    })
});