# Viewbind

Viewbind is a small JavaScript framework for making web pages. It aims to get some of the benefits out of modern frameworks like Angular and React, while putting a thinner abstraction layer between you and the base JS APIs - an enhancement to vanilla JS, not a replacement for it, but still more powerful than a mere convenience wrapper like JQuery. In particular, the Viewbind philosophy is that there are two main ideas worth taking from Angular and React: the increased synergizing of your HTML markup and your JavaScript, and having a mechanism for building reusable components.

## What It Does

Viewbind exports only three functions: `bind`, `component` and `create`, the last of which is a fairly trivial wrapper around `bind` for convenience. I will illustrate the intended use of the library with a series of increasingly elaborate examples.

### Example 1: Controllers and Binding

We have the following HTML:

```html
<div id="myDiv">
    <span bind="message"></span>
</div>
```

and the following JavaScript:

```javascript
class Controller
{
	initialize()
    {
        this.message.innerText = "Hello, world!";
    }
}

let div = document.getElementById("myDiv");
let controller = bind(div, Controller);
```

The call to `bind` will return an object of type `Controller` with a field `message` containing the `<span>` tag in the document. Before `bind` returns, Viewbind will automatically look for a method called `initialize()` on the object and call it. The returned object is known as the *controller*, and the second argument to `bind` is the *controller class*. As a convenience, the first argument of `bind` (here the `<div>` element) is stored in a field of the controller called `html`.

In Angular this type of example would be accomplished with Angular's `{{message}}` syntax and you would not need to use the DOM API's `innerText` property. In the Viewbind philosophy, this type of thing is considered too "magical", hence the more "primitive" approach of interacting directly with the DOM API. So far, the only benefit provided by Viewbind is a more convenient version of `getElementById()`, by allowing you instead of specify the name of a JavaScript variable directly in your HTML. In this example the benefit is basically non-existent since we need to call `getElementById()` once to get the div element anyway. It is more useful when there are several HTML tags to which we want to apply `bind` attriutes, but still pretty trivial so far.

### Example 2: Child Controllers

Now for a more practical example: rendering a user-submitted comment.

```html
<div id="theComment" class="userComment">
    <span bind="author"></span>
    <span bind="date" controller="DateController"></span>
    <p bind="content"></p>
</div>
```

And the JavaScript:

```javascript
let div = document.getElementById("theComment");
let commentController = bind(div, CommentController, [DateController]);
```

Where `CommentController` and `DateController` are classes which we will explore below. This call to `bind` will return an object of type `CommentController`, with fields called `author`, `date` and `content`. The `author` and `date` fields will be bound to HTML nodes as in the previous example, but due to the `controller` attribute in the HTML, the `date` field will be bound to an object of type `DateController`, which will be exactly as if it had been created with the call `bind(spanElement, DateController)`, where `spanElement` is the `<span>` tag with the `controller` attribute in the HTML. The `class` attribute on the surrounding `<div>` is superfluous here and included only for realism.

You can think of controllers as wrappers for some HTML. If a tag is marked with a `bind` attribute the tag itself will be stored in a field of the parent controller, but if it's also marked with the `controller` attribute, it will first be wrapped in the corresponding controller class. The third argument of `bind`, of course, is a list containing all the controller classes references in the HTML.

The controllers themselves might be defined like this:

```javascript
class CommentController
{
	setComment(comment)
    {
        this.author.innerText = comment.author;
        this.content.innerText = comment.content;
        this.date.setDate(comment.date);
    }
}

class DateController
{
	setComment(date)
    {
        this.html.innerText = date.toDateString();
    }
}
```

After `bind` is called and the `commentController` is initialized, we would execute `commentController.setComment(comment)`, passing in some object representing the comment with fields for the author, content and date. The `date` field would be a JavaScript `Date` object, and the `DateController` calls its `toDateString()` method to render it on-screen. Note how the parent controller tells its child controller what to do directly by calling its `setDate()` method. This is one of the pillars of the Viewbind design philosophy: inter-component communication should happen by directly calling methods, not through some higher-order mechanism such as Angular's *messages* or React's *props*.

### Example 3: Components

Now we want to make the code for our user comment reusable. We would like to be able to write something like this:

```html
<div id="commentContainer">
	<user-comment bind="comment1"></user-comment>
    <user-comment bind="comment2"></user-comment>
    <user-comment bind="comment3"></user-comment>
</div>
```

and when we run `bind` on the root `<div>` element, automatically have `comment1`, `comment2`, and `comment3` fields populated by `CommentController` objects attached to those three nodes, as well as having the `<user-comment>` nodes expanded into the HTML we wrote earlier. The first thing we need to do is write out the HTML for our user comment component and make Viewbind aware of it. We put the following markup in our document somewhere:

```html
<template id="userCommentTemplate">
    <div class="userComment">
        <span bind="author"></span>
        <span bind="date" controller="DateController"></span>
        <p bind="content"></p>
    </div>
</template>
```

and in our JavaScript, we register our custom component with Viewbind:

```
let html = document.getElementById("userCommentTemplate").content;
const UserCommentComponent = component("user-comment", html, CommentController);
```

The first argument to `component` is the tag name (which must contain a hyphen as per HTML5 rules), the second is an `HTMLElement` or `DocumentFragment` representing the markup which will be cloned by Viewbind whenever it sees our custom tag, and the last argument is the controller class which will function just as if we had constructed it by passing the second argument of `component` to the `bind` function. The return value of `component` is simply a small data structure linking the three arguments together.

Note that there is nothing special about our use of the HTML5 `<template>` tag. The second argument of `component` can by obtained in any way we want, but getting the content of a `<template>` tag is the intended use case. The `<template>` tag is semantic and instructs the browser not to render the markup.

Finally, we run `bind` in order to actually instruct Viewbind to process the document:

```javascript
let div = document.getElementById("commentContainer");
let rootController = bind(div, RootController, [DateController], [UserCommentComponent]);
```

We have to pass the list of necessary components as the fourth argument, and he list of necessary controllers as the third. `CommentController` does not have to passed in in the third argument since that information is provided in the `UserCommentComponent` object. Passing the dependencies in explicitly keeps Viewbind stateless. Most likely in your app these dependencies will be stored in global variables called something like `APPLICATION_CONTROLLERS` and `APPLICATION_COMPONENTS`.

### Example 4: Creating Components Programmatically

It's all well and good to be able to declaratively create components in HTML, but usually you have an arbitrary number of user comments from the server, and need to be able to display as many as I need  *imperatively* in JavaScript. This could be done directly with `bind`:

```javascript
let templateContent = document.getElementById("userCommentTemplate").content;
let clonedMarkup = templateContent.cloneNode(true); // true -> deep clone
let controller = bind(clonedMarkup, CommentController, [DateController]);
```

However, this is in some sense code duplication since the fact that that template goes with the controller `CommentController` is already written into the program when we call `component` to register the component. We could avoid this by pulling the template markup and the controller back out of our component: they're accessible as `UserCommentComponent.fragment` and `UserCommentComponent.controller`. Still, this is a lot of typing. If we don't have to get our hands dirty calling `cloneNode()` manually when we instantiate a component in HTML, why should we have to do it when instantiating it in JavaScript?

As a convenience, therefore, basically the above three lines of code can be executed by calling the `create` function:

```javascript
let controller = create(UserCommentComponent, [DateController], []);
```

The second and third arguments are again the dependencies: the second is a list of controllers and the third a list of components which might be referenced in the component's template: here there are none. To insert the component into the document, recall that the markup to which the controller is attached (in our case the cloned content of the template) is stored in the `html` field of the controller, and so can be attached with something like `container.appendChild(controller.html)`. Again, the need for good old fashioned manual DOM manipulation is an intentional part of Viewbind's design.

## Design Philosophy/Rationale

...