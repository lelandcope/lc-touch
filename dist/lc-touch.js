/*! 
 lc-touch v0.6.10 
 Author: Leland Cope @lelandcope 
 2015-11-29 
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
        return function(elem) {
            var distanceThreshold, dragged, tapped, timeThreshold;
            distanceThreshold = 25;
            timeThreshold = 500;
            tapped = false;
            dragged = false;
            elem.on("touchstart", function(startEvent) {
                var moveHandler, removeTapHandler, startX, startY, tapHandler, target, touchStart;
                target = startEvent.target;
                touchStart = startEvent.originalEvent.touches[0] || startEvent.originalEvent.changedTouches[0] || startEvent.touches[0];
                startX = touchStart.pageX;
                startY = touchStart.pageY;
                tapped = false;
                removeTapHandler = function() {
                    $timeout.cancel();
                    elem.off("touchmove", moveHandler);
                    return elem.off("touchend", tapHandler);
                };
                tapHandler = function(endEvent) {
                    endEvent.preventDefault();
                    removeTapHandler();
                    if (target === endEvent.target) {
                        tapped = true;
                        return angular.element(elem).trigger("tap", endEvent);
                    }
                };
                moveHandler = function(moveEvent) {
                    var moveX, moveY, touchMove;
                    touchMove = moveEvent.originalEvent.touches[0] || moveEvent.originalEvent.changedTouches[0] || moveEvent.touches[0];
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
            elem.on("click", function(event) {
                if (!(tapped || dragged)) {
                    return angular.element(elem).trigger("tap", $(event.currentTarget));
                }
            });
            return angular.element(elem);
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
    lcTouch.directive("ngTap", [ "$ngTap", function($ngTap) {
        return function(scope, elem, attrs) {
            return $ngTap(elem).on("tap", function() {
                return scope.$apply(attrs["ngTap"]);
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
    lcTouch.directive("ngDbltap", [ "$timeout", function($timeout) {
        return function(scope, elem, attrs) {
            var distanceThreshold, tapcount, tapped, timeThreshold;
            distanceThreshold = 25;
            timeThreshold = 500;
            tapped = false;
            tapcount = 0;
            elem.on("touchstart", function(startEvent) {
                var moveHandler, removeTapHandler, startX, startY, tapHandler, target, touchStart;
                target = startEvent.target;
                touchStart = startEvent.originalEvent.touches[0] || startEvent.originalEvent.changedTouches[0] || startEvent.touches[0];
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
                            return scope.$apply(attrs["ngDbltap"]);
                        }
                    }
                };
                moveHandler = function(moveEvent) {
                    var moveX, moveY, touchMove;
                    touchMove = moveEvent.originalEvent.touches[0] || moveEvent.originalEvent.changedTouches[0] || moveEvent.touches[0];
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
            return elem.bind("dblclick", function() {
                if (!tapped) {
                    return scope.$apply(attrs["ngDbltap"]);
                }
            });
        };
    } ]);
    /*
      ngTapOutside
  
      Description: A directive that listens when a user clicks or taps
      outside the area.
  
      Usage:
      <button type="button" ng-tap-outside="closeDropdown()">Show Dropdown</button>
  */
    lcTouch.directive("ngTapOutside", [ "$timeout", function($timeout) {
        return function(scope, elem, attrs) {
            var onElementTouchStart, onTouchEnd, stopEvent;
            stopEvent = false;
            if (angular.isDefined(attrs.when)) {
                scope.$watch(attrs.when, function(newValue, oldValue) {
                    if (newValue === true) {
                        return $timeout(function() {
                            elem.bind("touchstart mousedown", onElementTouchStart);
                            return $("html").bind("touchend mouseup", onTouchEnd);
                        });
                    } else {
                        elem.unbind("touchstart mousedown", onElementTouchStart);
                        return $("html").unbind("touchend mouseup", onTouchEnd);
                    }
                });
            } else {
                elem.bind("touchstart mousedown", onElementTouchStart);
                $("html").bind("touchend mouseup", onTouchEnd);
            }
            onTouchEnd = function(event) {
                if (!stopEvent) {
                    return $timeout(function() {
                        return scope.$eval(attrs.ngTapOutside);
                    }, 10);
                } else {
                    return stopEvent = false;
                }
            };
            onElementTouchStart = function(event) {
                event.stopPropagation();
                return stopEvent = true;
            };
            return scope.$on("event:stopTapOutside", function() {
                return stopEvent = true;
            });
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
                    touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] || e.touches[0];
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
                    touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] || e.touches[0];
                    endX = touch.pageX;
                    endY = touch.pageY;
                    if (events.move) {
                        return events.move(elem, [ endX, endY ], e);
                    }
                };
                ontouchend = function(e) {
                    elem.off("touchmove", ontouchmove);
                    elem.off("touchend", ontouchend);
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
    lcTouch.directive("ngSwipeDown", [ "$swipe", function($swipe) {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                var onend, threshold;
                threshold = Number(attrs.ngSwipeDownThreshold) || 70;
                onend = function(elem, amounts) {
                    var amount;
                    amount = amounts[1];
                    if (amount < 0 && Math.abs(amount) >= threshold) {
                        return scope.$apply(attrs["ngSwipeDown"]);
                    }
                };
                return $swipe.bind(elem, {
                    end: onend
                });
            }
        };
    } ]);
    lcTouch.directive("ngSwipeUp", [ "$swipe", function($swipe) {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                var onend, threshold;
                threshold = Number(attrs.ngSwipeUpThreshold) || 70;
                onend = function(elem, amounts) {
                    var amount;
                    amount = amounts[1];
                    if (amount > 0 && Math.abs(amount) >= threshold) {
                        return scope.$apply(attrs["ngSwipeUp"]);
                    }
                };
                return $swipe.bind(elem, {
                    end: onend
                });
            }
        };
    } ]);
    lcTouch.directive("ngSwipeRight", [ "$swipe", function($swipe) {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                var onend, threshold;
                threshold = Number(attrs.ngSwipeRightThreshold) || 70;
                onend = function(elem, amounts) {
                    var amount;
                    amount = amounts[0];
                    if (amount < 0 && Math.abs(amount) >= threshold) {
                        return scope.$apply(attrs["ngSwipeRight"]);
                    }
                };
                return $swipe.bind(elem, {
                    end: onend
                });
            }
        };
    } ]);
    lcTouch.directive("ngSwipeLeft", [ "$swipe", function($swipe) {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                var onend, threshold;
                threshold = Number(attrs.ngSwipeLeftThreshold) || 70;
                onend = function(elem, amounts) {
                    var amount;
                    amount = amounts[0];
                    if (amount > 0 && Math.abs(amount) >= threshold) {
                        return scope.$apply(attrs["ngSwipeLeft"]);
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
            return this.name = definition();
        }
    })("lcTouch", function() {
        return lcTouch;
    });
}).call(this);