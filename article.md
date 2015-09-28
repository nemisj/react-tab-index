# Focus order and tabIndex greater then 0 in component based web applications

Today we will look into the default focus order in the browser and why is it not applicable to the web applications based on component based frameworks like ReactJS, Angular, Sencha and others.

This article will have the following structure. 

First I will describe how default implementation of the focus order works and how tabIndex attribute influence this behaviour. 

After that I will show what problem this implementation brings when we are using componized fraweworks. As last I will describe my solution and give demo example using ReactJS.

While my demo is written in the ReactJS, such algorithm can be implemented almost into any framework you use.

## How tabIndex works in plain old page

Default behaviour of focus order in all the browsers is the same. There are couple of differences, but they're very subtile and are not related to the current scope of this article.

The behaviour I describe applies to the left-to-write (LTR) locales. In that sense focus order and the reading flow are the same. Pressing 'Tab' key will move focus from left to right and from top to bottom.


(image with the inputs showing order)

In order to influence order of focus - tabIndex attribute can be used. 

(image with the tabIndex and order )


( If focus is on the first *input* - #one, pressing 'Tab' key would bring it to the next *input* - #two. 
Pressing 'Tab' again will bring it to the *input* - #three, this is because there are no more focusable nodes inside #parent-one-two and browser will search in next sibling inside #parent-three-four. )

## Internals

From our developers perspective, working of tab order is a bit different. There is no left to right in the code, because HTML nodes can be easily placed one beneath another, which means that focus order is only from top to bottom. Also, while HTML is hierarchical, there is no need for hyerarchy when dealing with focus and all the HTML is seen as flat list of items when defining which next item should be focused. While HTML structure can become very complicated, focus order states the same no matter how deep next node is going to be.

(introduce focusable elements, make js file to test): input, select, button, a

Let's look at the following illustration:

I will use HTML below as an example to clearify all the details:

```html
  <body>
    <div id="parent-one-two">
      <input type="text" id="one" />
      <input type="text" id="two" />
    </div>
    <div id="parent-three-four">
      <input type="text" id="three" />
      <input type="text" id="four"/>
    </div>
  </body
```

To define the order of the elements following steps should be done:


1. Flattened list of nodes is created from hierarchy. All the nested nodes should be placed under it's parent.

```html
  <body>
  </body
  <div id="parent-one-two"></div>
  <input type="text" id="one" />
  <input type="text" id="two" />
  <div id="parent-three-four"></div>
  <input type="text" id="three" />
  <input type="text" id="four"/>
```

2. All the nodes which are not focusable are removed from the list,

```html
  <input type="text" id="one" />
  <input type="text" id="two" />
  <input type="text" id="three" />
  <input type="text" id="four"/>
```

Now it's very easy to identify which element should be focused next.

## tabIndex greater then zero

Whenever tabIndex attribute is used inside elements, order will be defined based on this attribute in the flattened list. All the elements with the same tabIndex will be placed in the order they appear in the HTML document, from top to bottom.

There is one little but important aspect to the tabIndex attribute. First browser will walk through the tabIndex with value greater then 0 and only then jump to the 0 tabIndex.  Also focusable element which have no tabIndex will be assigned tabIndex=0.

(image)
```html
  <input type="text" tabIndex="1" value="tabIndex = 1" />
  <input type="text" tabIndex="0" value="tabIndex = 0"/>
  <input type="text" tabIndex="2" value="tabIndex = 2"/>
  <input type="text" tabIndex="3" value="tabIndex = 3"/>
```


In order to normalize nodes with specified tabIndex, ther are two more steps needed. Let's look at the HTML from above but with added tabIndex attribute and steps which needed to be preformed for normalizing focus order list.


```html
  <body>
    <div id="parent-one-two">
      <input type="text" id="one"/>
      <input type="text" id="two" tabIndex="2" />
    </div>
    <div id="parent-three-four">
      <input type="text" id="three" tabIndex="1" />
      <input type="text" id="four" tabIndex="2"/>
    </div>
  </body
```

1. Flattened list of nodes is created from hierarchy. All the nested nodes should be placed under it's parent.

```html
  <body></body>
  <div id="parent-one-two"></div>
  <input type="text" id="one" /> 
  <input type="text" id="two" tabIndex="2" />
  <div id="parent-three-four"></div>
  <input type="text" id="three" tabIndex="1" />
  <input type="text" id="four" tabIndex="2" />
```

2. All the nodes which are not focusable are removed from the list,

```html
  <input type="text" id="one" /> 
  <input type="text" id="two" tabIndex="2" />
  <input type="text" id="three" tabIndex="1" />
  <input type="text" id="four" tabIndex="2" />
```

3. Sorting inputs based on tabIndex, use tabIndex=0 for nodes which have no tabIndex

```html
  <input type="text" id="one" /> 
  <input type="text" id="three" tabIndex="1" />
  <input type="text" id="two" tabIndex="2" />
  <input type="text" id="four" tabIndex="2" />
```

4. Place all the nodes with tabIndex=0 bellow the latest tabIndex

```html
  <input type="text" id="three" tabIndex="1" />
  <input type="text" id="two" tabIndex="2" />
  <input type="text" id="four" tabIndex="2" />
  <input type="text" id="one" /> 
```


(expalain about tabIndex on non focusable elements)

## Why it won't work now

Before diving into the problem itself, let's see what does it mean component
based architecture for the browser.

Usually when application created using component based architecture UI of this applicatio is constructed of multiple smaller componests. Every component is an isolated unit containing all the required assets for it to run, such as view fragment, javascript, css and images. View fragment can be of any format, but most of the time it represents HTMLish tree of nodes, XML or any other Domai Specific Language (DSL) defined by the framework creator e.g., JSX is used in ReactJS and (Java example would also be nice) XML is used in BackBase.

Whenever framework assembles application, it takes all the components and generates HTML which then is displayed in the browser. Most of the time this happens at the runtime ( in the browser or on the server ) but can be also done as 'separate' compilation task in a build process.

Since application is represented in the browser, all the rules regarding focus
order and tabIndex playes the same role as by simple HTML page

Flattening nature of the focusable nodes is becoming an obstacle for correct working of the focus order. How? Let's see in an example below.

Assume we have a SignIn page of our application which is constructed of two components. One component represents Two input fields username and password and another component represents two buttons "Login" and "Forgot password". Let's call them, form and controls components.


To show both components on the screen we would also need a "Page" component,
which might look something like this: ( my own DSL :) )

```xml
<Body>
  <Form />
  <Controls />
</Body>
```

(picture of a page with lines showing two components)

I will show view fragments of components using HTML, assuming that it has been already 'generated' or compiled into it.

View of the 'Form' component:

```html
<div>
  <span>User name: </span><input type="text" name="userame" />
  <span>Password: </span><input type="text" name="password" />
</div>
```

View of the 'Controls' component:

```html
<div>
  <button value="Login" />
  <button value="Forgot password" />
</div>
```

After assembling this application it would look like this: ( with comments I have highlighted where components starts and end )

```html
<html>
  <!-- Page -->
  <body>

    <!-- Form -->
    <div>
      User name: <input type="text" name="userame" />
      Password: <input type="password" name="password" />
    </div>
    <!-- /Form -->

    <!-- Controls -->
    <div>
      <button value="Login" />
      <button value="Forgot password" />
    </div>
    <!-- /Controls -->

  </body>

  <!-- /Page -->

</html>
```

Running this won't give any problem with focus order since
focus will flow from top to bottom and will have correct order... Until
developer of this application, decided that he doesn't like "Controls" component
and want to replace it with the new one:


'Controls' component:

```html
<div>
  <button value="Login" tabIndex="1"/>
  <button value="Forgot password" tabIndex="0"/>
</div>
```

From the developers point of view there is nothing changed, he runs his
component stand alone and sees that everything still working the same. Because
after tabIndex > 0, focus goes to the tabIndex == 0, everything looks fine.


Order of the nodes in focus list:

```
  <button value="Login" tabIndex="1"/>
  <button value="Forgot password" tabIndex="0"/>
``

Somehow in production environment when application is assembeled together focus
order is screwed up.

## Exp.

Let's look at the assembled HTML of an application after Batman made a change into 'Controls' component.

```html
<html>
  <!-- Page -->
  <body>

    <!-- Form -->
    <div>
      User name: <input type="text" name="userame" />
      Password: <input type="password" name="password" />
    </div>
    <!-- /Form -->

    <!-- Controls -->
    <div>
      <button value="Login" tabIndex="1" />
      <button value="Forgot password" tabIndex="0" type="password" />
    </div>
    <!-- /Controls -->

  </body>

  <!-- /Page -->

</html>
```

Because view fragments of components of assembled application all come into one document, order of the focus list becomes different. Let's see how list would look like:

```html
  <button value="Login" tabIndex="1" />
  <input type="text" name="userame" />
  <input type="password" name="password" />
  <button value="Forgot password" tabIndex="0" type="password" />
```

Due to the flattening of nodes from different components, focus order is
incorrect.

## How make it work

In order to solve this, browser need to have a notion of a component and apply the same prinicple of flattening focus-list to every component separatly. Only then will the order be 'respected' in every component. Which actually makes this list not flat anymore but hyerarchical.

(image)


<<<<

Let's take our example and try to create focusable tree. To do so, first create
flat tree as we did before, but don't flatten nodes, if they're part of the
component.

Step 1: Flattening tree for document
```html
<html>
</html>
<body>
</body>
<div data-component-name="Form"></div>
<div data-component-name="Controls"></div>

```

This would be our flat tree of Document. Now Time to flatten both Components:

Step 1: Flattening tree for Form

```html
<div></div>
<span>User name: </span>
<input type="text" name="userame" />
<span>Password: </span>
<input type="password" name="password" />
```

Step 1: Flattening tree for Controls component

```html
<div></div>
<button value="Login" tabIndex="1" />
<button value="Forgot password" tabIndex="0" type="password" />
```



