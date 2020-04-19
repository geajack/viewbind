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
        function buildController(node)
        {
            let className = node.getAttribute("controller");
            return new controllerClasses[className]();
        }
    );
}

function solve(root, bind, initialize, buildController)
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
                    let controllerName = node.getAttribute("controller");
                    if (controllerName !== null)
                    {
                        let controller = buildController(node);
                        bind(bindingName, controller);
                        solve(
                            node,
                            (name, value) => controller[name] = value,
                            controller.initialize.bind(controller),
                            buildController
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