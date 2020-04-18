import { instantiate } from "../src/index.js";

class Application
{
    initialize()
    {
        if (this.childMessage)
        {
            throw new Error();
        }
        this.parentMessage.textContent = "Test passed";
    }
}

class ChildController
{

}

instantiate(document.body, Application, ChildController);