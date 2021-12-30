function bind(node, controllerClass, otherControllerClasses)
{
    let controller = new controllerClass();

    let dictOfClasses = {};
    for (let controllerClass of otherControllerClasses)
    {
        dictOfClasses[controllerClass.name] = controllerClass;
    }

    return bindChild(node, null, controller, dictOfClasses);
}

function bindChild(childNode, parentController, childController, otherControllerClasses)
{
    let nodeOrFragment = childNode;

    if (!childController)
    {
        let controllerClassName = childNode.getAttribute("controller");
        if (controllerClassName)
        {
            let controllerClass = otherControllerClasses[controllerClassName];
            childController = new controllerClass();
        }
    }

    let returnValue;
    let controller;
    if (childController)
    {
        returnValue = childController;
        controller = childController;
    }
    else
    {
        returnValue = nodeOrFragment;
        controller = parentController;
    }

    for (let node of nodeOrFragment.childNodes)
    {
        if (node.nodeType === Node.TEXT_NODE)
        {
            continue;
        }

        let value = bindChild(node, controller, null, otherControllerClasses);
        let bindName = node.getAttribute("bind");
        if (bindName)
        {
            controller[bindName] = value;
        }
    }

    if (childController)
    {
        childController.initialize(nodeOrFragment);
    }

    return returnValue;
}