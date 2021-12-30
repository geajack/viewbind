function instantiate(element, controllerClass, ...childClasses)
{
    let controllerClasses = {};
    for (let classEntity of [controllerClass, ...childClasses])
    {
        controllerClasses[classEntity.name] = classEntity;
    }

    let controller = new controllerClass();

    bind(
        element,
        controller,
        controllerClasses
    );

    return controller;
}

function bind(root, rootController, controllerClasses)
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
                        bind(
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