lcTouch
===============

An Angular.js touch library

### Build Instructions

```shell
$ grunt build
```

This will build a normal version and a minified version of the module and place it in the dist folder.

---------------

### Directives List

[ngTap](#ngtap) - Adds tap support with a fallback to clicks for desktop browsers

[ngSwipeDown](#ngswipedown) - Adds Swipe Down support to an element

[ngSwipeUp](#ngswipeup) - Adds Swipe Up support to an element

[ngSwipeLeft](#ngswipeleft) - Adds Swipe Left support to an element

[ngSwipeRight](#ngswiperight) - Adds Swipe Right support to an element

---------------

## ngTap

Adds tap support with a fallback to clicks for desktop browsers

Restricted to: Attribute

### Usage:

```html
<button type="button" ng-tap="doSomething()">Click Me</button>
```

### Parameters:

- ngTap - {string} - An expression representing what you would like to do when the element is tapped or clicked

===============

## ngSwipeDown

Adds Swipe Down support to an element

Restricted to: Attribute

### Usage:

```html
<div ng-swipe-down="function()" ng-swipe-down-threshold="300">
	...
</div>
```

### Parameters:

- ngSwipeDown - {string} - An expression representing what you would like to do when the element is swiped
- ngSwipeDownThreshold - optional - {integer} - The minimum amount in pixels you must swipe. Defaults to 70

===

## ngSwipeUp

Adds Swipe Up support to an element

Restricted to: Attribute

### Usage:

```html
<div ng-swipe-up="function()" ng-swipe-up-threshold="300">
	...
</div>
```

### Parameters:

- ngSwipeUp - {string} - An expression representing what you would like to do when the element is swiped
- ngSwipeUpThreshold - optional - {integer} - The minimum amount in pixels you must swipe. Defaults to 70

===

## ngSwipeLeft

Adds Swipe Left support to an element

Restricted to: Attribute

### Usage:

```html
<div ng-swipe-left="function()" ng-swipe-left-threshold="300">
	...
</div>
```

### Parameters:

- ngSwipeLeft - {string} - An expression representing what you would like to do when the element is swiped
- ngSwipeLeftThreshold - optional - {integer} - The minimum amount in pixels you must swipe. Defaults to 70

===

## ngSwipeRight

Adds Swipe Right support to an element

Restricted to: Attribute

### Usage:

```html
<div ng-swipe-right="function()" ng-swipe-right-threshold="300">
	...
</div>
```

### Parameters:

- ngSwipeRight - {string} - An expression representing what you would like to do when the element is swiped
- ngSwipeRightThreshold - optional - {integer} - The minimum amount in pixels you must swipe. Defaults to 70
