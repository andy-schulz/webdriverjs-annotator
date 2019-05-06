import {WebDriver, WebElement} from "selenium-webdriver"
import * as uuid from "uuid"


export interface HighlightOptions {
    width: number
    color: "red"
}

const COLOR: {readonly [key: string]: string} = {
    red: "rgba(255,0,0,1)"
};


export class Annotator {
    private elementBefore: any = undefined;
    private styleBefore: string = undefined;

    private promise: Promise<WebElement | void | any> = Promise.resolve();

    // id must start with a letter, so i put an "a" in front of it, just in case the uuid starts with a number
    private readonly uuid = "a" + uuid.v4().toString();

    private static driverMap: Map<WebDriver, Annotator> = new Map();

    /**
     *  hide the test message element
     *
     *  @param elementId id of test message element
     *
     *  @returns void
     */
    private readonly hideMessage = function () {
        var alert = document.querySelector('#' + arguments[0]);

        if(alert) {
            // @ts-ignore
            alert.style.display = 'none';
        }
    };

    /**
     * add test message to current page
     *
     * @param elementId id of test message element
     * @param displayedText text to display on the test message
     * @param testMessageOptions options describing the style of the test message
     *
     * @returns void
     */
    private readonly displayMessage = function (): void {
        // document.body.textContent = "";

        var alert = document.querySelector('#' + arguments[0]);

        if(alert) {
            alert.textContent = arguments[1];

            // @ts-ignore
            alert.style.display = 'block';
        } else {
            alert = document.createElement('div');
            alert.textContent = arguments[1];
            alert.setAttribute('id',arguments[0]);
            alert.setAttribute('class',"alert");
            alert.setAttribute('style',"" +
                "padding: 5px;" +
                "background-color: #f96b6b; /* Red */" +
                "color: white;" +
                "position: absolute;" +
                "font-size: 15px;" +
                "top: 0;" +
                "left: 0;" +
                "right: 0;" +
                "margin: auto;" +
                "text-align: center;" +
                "");
            document.body.appendChild(alert);
        }
    };

    private readonly unHighlightElement= function () {
        try {
            console.error(arguments[0]);
            if(arguments[0] && arguments[1] !== undefined) {
                arguments[0].removeAttribute("style");
                arguments[0].setAttribute('style',arguments[1])
            }
        } catch(e) {
            console.error("caught error")
        }
    };

    private readonly highlightElement = function (){
        console.log(`Highlighting an element`);
        var oldStyle = arguments[0].getAttribute('style');

        arguments[0].setAttribute('style', "color: Red; border: 2px solid red;");

        return oldStyle
    };

    /**
     * returns an Annotator instance for the given driver, if it does not already exist, it will be created.
     *
     * @param driver the driver instance which has to be annotated
     * @returns the Annotator instance for the driver
     */
    private static hl(driver: WebDriver) {
        if(Annotator.driverMap.has(driver))
            return Annotator.driverMap.get(driver);
        else {
            const hl = new Annotator();
            Annotator.driverMap.set(driver, hl);
            return hl;
        }

    }

    /**
     * add a div in the browsers dom and displays the given test message
     *
     * @param driver the driver instance which has to be annotated
     * @param testMessage the message to display
     */
    private displayTM(driver: WebDriver, testMessage: string): Promise<string> {
        return this.promise = this.promise
            .then(() => driver.executeScript(this.displayMessage, this.uuid, testMessage))
            .then(() => this.uuid)
    }

    /**
     *
     * @param driver
     */
    private hideTM(driver: WebDriver): Promise<{}> {
        return this.promise = this.promise
            .then(() => {
                return driver.executeScript(this.hideMessage,this.uuid);
            })
    }

    /**
     *
     * @param driver
     * @param element
     */
    private hlight(driver: WebDriver, element: WebElement): Promise<void> {
        return this.promise = this.promise
            .then(() => driver.executeScript(this.unHighlightElement,this.elementBefore,this.styleBefore))
            .then(() => driver.executeScript(this.highlightElement,element))
            .then((style: any) => {
                this.elementBefore = element;
                this.styleBefore = style;
            }, () => {
                this.elementBefore = undefined;
            })
    }


    /**
     * add a div in the browsers dom and display the given test message
     *
     * @param driver the driver to be annotated
     * @param testMessage the message to display
     *
     * @returns a Promise with an empty object in case the browser function succeeds
     */
    public static displayTestMessage(driver: WebDriver, testMessage: string): Promise<{}> {
        const hl: Annotator = Annotator.hl(driver);
        return hl.displayTM(driver, testMessage);
    }

    /**
     * hide the test message. Set display: none
     *
     * @param driver the driver to be annotated
     *
     * @returns a Promise with an empty object in case the browser function succeeds
     *
     */
    public static hideTestMessage(driver: WebDriver): Promise<{}> {
        const hl: Annotator = Annotator.hl(driver);
        return hl.hideTM(driver);
    }

    /**
     * highlight the browsers element (red border and red text)
     *
     * @param driver
     * @param element
     */
    public static highlight(driver: WebDriver, element: WebElement): Promise<void> {
        const hl: Annotator = Annotator.hl(driver);
        return hl.hlight(driver, element)
    }

};