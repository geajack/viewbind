# Viewbind
Viewbind (working title) is an experiment in producing a very light-weight Javascript UI library for the web. The design philosophy is based on a few principles:

- More interoperable with vanilla Javascript (library, not a framework).
- UI components map to ordinary JS classes
- Reduce DOM-traversing and manipulating boilerplate without fundamentally changing the programming paradigm.

## Usage

Viewbind only exposes one function, `instantiate`, with signature

```
instantiate(element, controllerClass, ...childClasses)
```

where `element` is a DOM node, `controllerClass` is a class and `childClasses` is an array of classes.

## Examples
### Example 1: Binding
The most basic feature of viewbind is binding DOM nodes to Javascript variables to obviate the need for `document.getElementById()`-type boilerplate:

#### index.html
```
...
<body>
    <span bind="message"></span>
</body>
```
#### main.js
```
import { instantiate } from "viewbind";

class Application
{
    initialize(root)
    {
        this.message.textContent = "Hello, world!";
    }
}

const application = instantiate(document.body, Application);
```

When `instantiate(node, controllerClass)` is called, it returns an instance of `controllerClass` and calls that instance's `initialize()` function. HTML elements (of the tree rooted at `node`) marked with a `bind` attribute are bound to fields of that instance, the name of the field being specified by the `bind` attribute. Notice that viewbind also passes `node` when it calls `initialize()`, although we don't make use of it here.