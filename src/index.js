export function instantiate(element, controllerClass, ...childClasses)
{
    let controllerClasses = {};
    controllerClasses[controllerClass.name] = controllerClass;
    for (let childClass of childClasses)
    {
        controllerClasses[childClass.name] = childClass;
    }

    let rootController = new controllerClass();
    let controllerRoots = [new ControllerNode(element, rootController)];
    while (controllerRoots.length > 0)
    {
        let newControllerRoots = [];
        for (let controllerRoot of controllerRoots)
        {
            let controller = controllerRoot.controller;
            
            let walker = document.createTreeWalker(
                controllerRoot.node,
                NodeFilter.SHOW_ELEMENT,
                function(node)
                {
                    let bindName = node.getAttribute("bind");
                    if (bindName !== null)
                    {
                        let controllerClassName = node.getAttribute("controller");
                        if (controllerClassName !== null)
                        {
                            let childController = new controllerClasses[controllerClassName]();
                            controller[bindName] = childController;
                            newControllerRoots.push(new ControllerNode(node, childController));
                            return NodeFilter.FILTER_REJECT;
                        }
                        else
                        {
                            controller[bindName] = node;
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    }
                }
            );
            while (walker.nextNode()) {}
        }
        controllerRoots = newControllerRoots;
    }

    return rootController;
}

class ControllerNode
{
    constructor(node, controller)
    {
        this.node = node;
        this.controller = controller;
    }
}