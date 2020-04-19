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
        (name, value) => controller[name] = value,
        controller.initialize.bind(controller),
        controllerClasses
    );
}

function solve(root, bind, initialize, controllerClasses)
{
    let cNodes = [];
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
                        bind(bindingName, controller);
                        solve(
                            node,
                            (name, value) => controller[name] = value,
                            controller.initialize.bind(controller),
                            controllerClasses
                        );
                        return NodeFilter.FILTER_REJECT;
                    }
                    else
                    {
                        bind(bindingName, node);
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            }
        }
    );
    while (walker.nextNode()) {}

    initialize();
}