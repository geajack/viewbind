export function instantiate(element, controllerClass, ...childClasses)
{
    let controller = new controllerClass();

    for (let target of element.querySelectorAll("[click]"))
    {
        let handler = target.getAttribute("click");
        target.addEventListener("click", controller[handler].bind(controller));
    }

    for (let target of element.querySelectorAll("[bind]"))
    {
        let name = target.getAttribute("bind");
        let childControllerClassName = target.getAttribute("controller");
        if (childControllerClassName)
        {
            let childControllerClass;
            for (let childClass of childClasses)
            {
                if (childClass.name === childControllerClassName)
                {
                    childControllerClass = childClass;
                    break;
                }
            }

            controller[name] = instantiate(target, childControllerClass);
        }
        else
        {
            controller[name] = target;
        }
    }

    controller.initialize(element);

    return controller;
}