class Application
{
    initialize()
    {
        if (this.childMessage)
        {
            throw new Error();
        }
        this.parentMessage.textContent = "Test passed";

        this.testComponent.setMessage("Test passed");
    }
}

class ChildController
{
    initialize()
    {
        this.childMessage.textContent = "Test passed";
    }
}

class TestComponentController
{
    initialize(fragment)
    {
        this.fragment = fragment;
    }

    setMessage(message)
    {
        this.message.textContent = message;
    }
}

let template = document.getElementById("testTemplate").content;
let testComponent = component("test", template, TestComponentController);

let application = bind(document.body, Application, [ChildController], [testComponent]);

let myComponent = create(testComponent, [], []);
myComponent.setMessage("Test passed");
application.div.appendChild(myComponent.fragment);