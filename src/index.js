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

    return controller;
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
                let filterResult = NodeFilter.FILTER_ACCEPT;
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
                        filterResult = NodeFilter.FILTER_REJECT;
                    }
                    else
                    {
                        rootController[bindingName] = node;
                    }
                }

                let clickHandlerName = node.getAttribute("click");
                let handler = rootController[clickHandlerName];
                if (handler)
                {
                    node.addEventListener("click", handler.bind(rootController));
                }

                return filterResult;
            }
        }
    );
    while (walker.nextNode()) {}

    if (rootController.initialize)
    {
        rootController.initialize(root);
    }
}