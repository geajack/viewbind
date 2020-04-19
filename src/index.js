export function instantiate(element, controllerClass, ...childClasses)
{
    let controllerClasses = {};
    controllerClasses[controllerClass.name] = controllerClass;
    for (let childClass of childClasses)
    {
        controllerClasses[childClass.name] = childClass;
    }

    let controller = new controllerClass();

    solve(
        element,
        controller,
        controllerClasses
    );
}

function solve(root, rootController, controllerClasses)
{
    let walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT,
        function(node)
        {
            if (node === root)
            {
                return NodeFilter.FILTER_ACCEPT;
            }
            else
            {
                let bindingName = node.getAttribute("bind");
                if (bindingName !== null)
                {
                    let controllerClassName = node.getAttribute("controller");
                    if (controllerClassName !== null)
                    {
                        let controller = new controllerClasses[controllerClassName]();
                        rootController[bindingName] = controller;
                        solve(
                            node,
                            controller,
                            controllerClasses
                        );
                        return NodeFilter.FILTER_REJECT;
                    }
                    else
                    {
                        rootController[bindingName] = node;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            }
        }
    );
    while (walker.nextNode()) {}

    rootController.initialize();
}