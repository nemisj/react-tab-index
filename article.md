# Focus order and tabIndex in component based web applications

Today we will look into the default focus order in the browser and why is it not applicable to the web applications based on component based frameworks like ReactJS, Angular, Sencha and others.

This article will have the following structure. 

First I will describe how default implementation of the focus order works and how tabIndex attribute influence this behaviour. 

After that I will show what problem this implementation brings when we are using componized fraweworks. As last I will describe my solution and give demo example using ReactJS.

While my demo is written in the ReactJS, such algorithm can be implemented almost into any framework you use.

## How tabIndex works in plain old page

Default behaviour of focus order in all the browsers is the same. There are couple of differences, but they're very subtile and are not related to the current scope of this article.

The behaviour I describe applies to the left-to-write (LTR) locales. In that sense focus order and the reading flow are the same. Pressing 'Tab' key will move focus from left to right and from top to bottom.

( From developers perspective, there is no left to right, it's always from top to bottom ) 

From the our developers perspective, working of tab order is a bit different. There is no left to right, it's always from top to bottom traversing every html node and finding appropriate one.

Let's look at the following HTML snippet:

```html
  <body>
    <div id="parent-one-two">
      <input type="text" id="one" /> <input type="text" id="two" />
    </div>
    <div id="parent-three-four">
      <input type="text" id="three" /> <input type="text" id="four"/>
    </div>
  </body
```

If focus is on the first *input* - #one, pressing 'Tab' key would bring it to the next *input* - #two.
Pressing 'Tab' again will bring it to the *input* - #three, this is because there are no more focusable nodes inside #parent-one-two and browser will search in next sibling inside #parent-three-four.


Actually this whole process can be simplified. Before placing focus to the next element, flattened list of nodes is be created, which translate hierarchical tree of nodes into the flatten one. After that all the nodes which are not focusable are removed from the list, keepping the list only with the focusable elements. 

Now it's very easy to identify which element to focus next. See it for yourself:

```html
  <body>
    <div id="parent-one-two">
      <input type="text" id="one" /> <input type="text" id="two" />
    </div>
    <div id="parent-three-four">
      <input type="text" id="three" /> <input type="text" id="four"/>
    </div>
  </body
```

=>

```html
  <body>
    <div id="parent-one-two"></div>
    <input type="text" id="one" />
    <input type="text" id="two" />
    <div id="parent-three-four"></div>
    <input type="text" id="three" />
    <input type="text" id="four"/>
  </body
```

While HTML structure can become very complicated, focus order states the same no matter how deep node is.

In order to influence this behaviour tabIndex attribute can be used.





## Differences
