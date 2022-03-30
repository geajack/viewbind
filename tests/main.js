class Application
{
    initialize()
    {
        if (this.childMessage)
        {
            throw new Error();
        }
        this.parentMessage.textContent = "Test passed";
        this.parentMessage.style.color = "green";

        this.testComponent.setMessage("Test passed");
        this.testComponent.message.style.color = "green";

        for (let listElement of this.list)
        {
            listElement.textContent = "Test passed";
            listElement.style.color = "green";
        }

        for (let listElement of this.componentList)
        {
            listElement.setMessage("Test passed");
            listElement.message.parentNode.style.color = "green";
        }
    }
}

class ChildController
{
    initialize()
    {
       this.childMessage.textContent = "Test passed";
       this.html.style.color = "green";
    }
}

class ArgumentController
{
    initialize(html, options)
    {
        if (options.value === "7")
        {
            this.html.textContent = "Test passed";
            this.html.style.color = "green";
        }
    }
}

class ArgumentComponentController
{
    initialize(html, options)
    {
        if (options.value === "7")
        {
            this.message.textContent = "Test passed";
            this.message.style.color = "green";
        }
    }
}

class TestComponentController
{
    setMessage(message)
    {
        this.message.textContent = message;
    }
}

let template = document.getElementById("testTemplate").content;
let testComponent = component("test", template, TestComponentController);
let argComponent = component("arg-component", template, ArgumentComponentController);

let application = bind(document.body, Application, [ChildController, ArgumentController], [testComponent, argComponent]);

let myComponent = create(testComponent, [], []);
myComponent.setMessage("Test passed");
myComponent.message.style.color = "green";
application.div.appendChild(myComponent.html);