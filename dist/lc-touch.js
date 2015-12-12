/*! 
 lc-touch v0.6.10 
 Author: Leland Cope @lelandcope 
 2015-12-12 
 */
(function() {
    var lcTouch;
    lcTouch = angular.module("lc.touch", []);
    /*
      $ngTap Service
  
      Description: A service for ngTap. This allows you to add tap events to your own directives.
  
      Parameters:
      - elem - {html element} - The html element you want to listen for a touch event on.
   */
    lcTouch.factory("$ngTap", [ "$timeout", function($timeout) {
        var ACTIVE_CLASS_NAME;
        ACTIVE_CLASS_NAME = "ng-tap-active";
        return function(elem, handler) {
            var distanceThreshold, dragged, tapped, timeThreshold;
            distanceThreshold = 25;
            timeThreshold = 500;
            tapped = false;
            dragged = false;
            elem.on("touchstart", function(startEvent) {
                var moveHandler, removeTapHandler, startX, startY, tapHandler, target, touchStart;
                target = startEvent.target;
                if (target.disabled) {
                    return;
                }
                touchStart = startEvent.touches[0] || startEvent.changedTouches[0] || startEvent.touches[0];
                startX = touchStart.pageX;
                startY = touchStart.pageY;
                tapped = false;
                elem.addClass(ACTIVE_CLASS_NAME);
                removeTapHandler = function() {
                    $timeout.cancel();
                    elem.removeClass(ACTIVE_CLASS_NAME);
                    elem.off("touchmove", moveHandler);
                    return elem.off("touchend", tapHandler);
                };
                tapHandler = function(endEvent) {
                    endEvent.preventDefault();
                    removeTapHandler();
                    if (target === endEvent.target) {
                        tapped = true;
                        return handler(endEvent);
                    }
                };
                moveHandler = function(moveEvent) {
                    var moveX, moveY, touchMove;
                    touchMove = moveEvent.touches[0] || moveEvent.changedTouches[0] || moveEvent.touches[0];
                    moveX = touchMove.pageX;
                    moveY = touchMove.pageY;
                    if (Math.abs(moveX - startX) > distanceThreshold || Math.abs(moveY - startY) > distanceThreshold) {
                        tapped = true;
                        return removeTapHandler();
                    }
                };
                $timeout(removeTapHandler, timeThreshold);
                elem.on("touchmove", moveHandler);
                return elem.on("touchend", tapHandler);
            });
            elem.on("mousedown", function() {
                var handleMousemove, handleMouseup;
                dragged = false;
                handleMousemove = function() {
                    return dragged = true;
                };
                handleMouseup = function() {
                    elem.off("mousemove");
                    return elem.off("mouseup");
                };
                elem.on("mousemove", handleMousemove);
                return elem.on("mouseup", handleMouseup);
            });
            return elem.on("click", function(event) {
                if (!(tapped || dragged)) {
                    return handler(event);
                }
            });
        };
    } ]);
    /*
      ngTap Directive
  
      Description: A replacement for ngClick. This directive will take into account taps and clicks so it
      will work for both mobile and desktop browsers.
  
      Parameters:
      - ngTap - {string} - An expression representing what you would like to do when the element is tapped or clicked
  
      Usage:
      <button type="button" ng-tap="doSomething()">Click Me</button>
   */
    lcTouch.directive("ngTap", [ "$ngTap", "$parse", function($ngTap, $parse) {
        return function(scope, elem, attrs) {
            var tapHandler;
            tapHandler = $parse(attrs.ngTap);
            return $ngTap(elem, function(event) {
                angular.element(elem).triggerHandler("tap", event);
                return scope.$apply(function() {
                    return tapHandler(scope, {
                        $event: event
                    });
                });
            });
        };
    } ]);
    /*
      ngDbltap
  
      Description: A replacement for ngDblclick. This directive will take into account taps and clicks so it
      will work for both mobile and desktop browsers.
  
      Usage:
      <button type="button" ng-dbltap="doSomething()">Click Me</button>
   */
    lcTouch.directive("ngDbltap", [ "$timeout", "$parse", function($timeout, $parse) {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                var dbltapHandler, distanceThreshold, tapcount, tapped, timeThreshold;
                distanceThreshold = 25;
                timeThreshold = 500;
                tapped = false;
                tapcount = 0;
                dbltapHandler = $parse(attrs.ngDbltap);
                elem.on("touchstart", function(startEvent) {
                    var moveHandler, removeTapHandler, startX, startY, tapHandler, target, touchStart;
                    target = startEvent.target;
                    touchStart = startEvent.touches[0] || startEvent.changedTouches[0] || startEvent.touches[0];
                    startX = touchStart.pageX;
                    startY = touchStart.pageY;
                    removeTapHandler = function() {
                        $timeout.cancel();
                        elem.off("touchmove", moveHandler);
                        elem.off("touchend", tapHandler);
                        return tapcount = 0;
                    };
                    tapHandler = function(endEvent) {
                        endEvent.preventDefault();
                        tapcount++;
                        if (tapcount >= 2) {
                            removeTapHandler();
                            if (target === endEvent.target) {
                                tapped = true;
                                angular.element(elem).triggerHandler("dbltap", endEvent);
                                return scope.$apply(function() {
                                    return dbltapHandler(scope, {
                                        $event: endEvent
                                    });
                                });
                            }
                        }
                    };
                    moveHandler = function(moveEvent) {
                        var moveX, moveY, touchMove;
                        touchMove = moveEvent.touches[0] || moveEvent.changedTouches[0] || moveEvent.touches[0];
                        moveX = touchMove.pageX;
                        moveY = touchMove.pageY;
                        if (Math.abs(moveX - startX) > distanceThreshold || Math.abs(moveY - startY) > distanceThreshold) {
                            tapped = true;
                            return removeTapHandler();
                        }
                    };
                    $timeout(removeTapHandler, timeThreshold);
                    elem.on("touchmove", moveHandler);
                    return elem.on("touchend", tapHandler);
                });
                return elem.bind("dblclick", function(event) {
                    if (!tapped) {
                        angular.element(elem).triggerHandler("dbltap", event);
                        return scope.$apply(function() {
                            return dbltapHandler(scope, {
                                $event: event
                            });
                        });
                    }
                });
            }
        };
    } ]);
    /*
      ngSwipeDown, ngSwipeUp, ngSwipeLeft, ngSwipeRight
  
      Description: Adds swipe directives
  
      Usage:
      <div ng-swipe-down="onswipedown()">
          ...... HTML ......
      </div>
   */
    lcTouch.factory("$swipe", [ function() {
        return {
            bind: function(elem, events) {
                var endX, endY, ontouchend, ontouchmove, ontouchstart, startX, startY;
                startX = 0;
                startY = 0;
                endX = 0;
                endY = 0;
                ontouchstart = function(e) {
                    var touch;
                    e.preventDefault();
                    touch = e.touches[0] || e.changedTouches[0] || e.touches[0];
                    startX = touch.pageX;
                    startY = touch.pageY;
                    elem.on("touchmove", ontouchmove);
                    elem.on("touchend", ontouchend);
                    if (events.start) {
                        return events.start(elem, [ startX, startY ], e);
                    }
                };
                ontouchmove = function(e) {
                    var touch;
                    touch = e.touches[0] || e.changedTouches[0] || e.touches[0];
                    endX = touch.pageX;
                    endY = touch.pageY;
                    if (events.move) {
                        return events.move(elem, [ endX, endY ], e);
                    }
                };
                ontouchend = function(e) {
                    var touch;
                    elem.off("touchmove", ontouchmove);
                    elem.off("touchend", ontouchend);
                    touch = e.touches[0] || e.changedTouches[0] || e.touches[0];
                    endX = touch.pageX;
                    endY = touch.pageY;
                    if (events.end) {
                        events.end(elem, [ startX - endX, startY - endY ], e);
                    }
                    startX = 0;
                    startY = 0;
                    endX = 0;
                    return endY = 0;
                };
                return elem.on("touchstart", ontouchstart);
            }
        };
    } ]);
    lcTouch.directive("ngSwipeDown", [ "$swipe", "$parse", function($swipe, $parse) {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                var onend, swipeHandler, threshold;
                threshold = Number(attrs.ngSwipeDownThreshold) || 70;
                swipeHandler = $parse(attrs.ngSwipeDown);
                onend = function(elem, amounts, event) {
                    var amount;
                    amount = amounts[1];
                    if (amount < 0 && Math.abs(amount) >= threshold) {
                        angular.element(elem).triggerHandler("swipeDown", event);
                        return scope.$apply(function() {
                            return swipeHandler(scope, {
                                $event: event
                            });
                        });
                    }
                };
                return $swipe.bind(elem, {
                    end: onend
                });
            }
        };
    } ]);
    lcTouch.directive("ngSwipeUp", [ "$swipe", "$parse", function($swipe, $parse) {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                var onend, swipeHandler, threshold;
                threshold = Number(attrs.ngSwipeUpThreshold) || 70;
                swipeHandler = $parse(attrs.ngSwipeUp);
                onend = function(elem, amounts, event) {
                    var amount;
                    amount = amounts[1];
                    if (amount > 0 && Math.abs(amount) >= threshold) {
                        angular.element(elem).triggerHandler("swipeUp", event);
                        return scope.$apply(function() {
                            return swipeHandler(scope, {
                                $event: event
                            });
                        });
                    }
                };
                return $swipe.bind(elem, {
                    end: onend
                });
            }
        };
    } ]);
    lcTouch.directive("ngSwipeRight", [ "$swipe", "$parse", function($swipe, $parse) {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                var onend, swipeHandler, threshold;
                threshold = Number(attrs.ngSwipeRightThreshold) || 70;
                swipeHandler = $parse(attrs.ngSwipeRight);
                onend = function(elem, amounts, event) {
                    var amount;
                    amount = amounts[0];
                    if (amount < 0 && Math.abs(amount) >= threshold) {
                        angular.element(elem).triggerHandler("swipeRight", event);
                        return scope.$apply(function() {
                            return swipeHandler(scope, {
                                $event: event
                            });
                        });
                    }
                };
                return $swipe.bind(elem, {
                    end: onend
                });
            }
        };
    } ]);
    lcTouch.directive("ngSwipeLeft", [ "$swipe", "$parse", function($swipe, $parse) {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                var onend, swipeHandler, threshold;
                threshold = Number(attrs.ngSwipeLeftThreshold) || 70;
                swipeHandler = $parse(attrs.ngSwipeLeft);
                onend = function(elem, amounts, event) {
                    var amount;
                    amount = amounts[0];
                    if (amount > 0 && Math.abs(amount) >= threshold) {
                        angular.element(elem).triggerHandler("swipeLeft", event);
                        return scope.$apply(function() {
                            return swipeHandler(scope, {
                                $event: event
                            });
                        });
                    }
                };
                return $swipe.bind(elem, {
                    end: onend
                });
            }
        };
    } ]);
    (function(name, definition) {
        if (typeof module !== "undefined") {
            return module.exports = definition();
        } else if (typeof define === "function" && typeof define.amd === "object") {
            return define(definition);
        } else {
            return this[name] = definition();
        }
    })("lcTouch", function() {
        return lcTouch;
    });
}).call(this);