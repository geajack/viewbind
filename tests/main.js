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
    initialize()
    {
        this.childMessage.textContent = "Test passed";
    }
}

bind(document.body, Application, [ChildController]);