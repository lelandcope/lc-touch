lcTouch = angular.module 'lc.touch', []

###
    $ngTap Service

    Description: A service for ngTap. This allows you to add tap events to your own directives.

    Parameters:
    - elem - {html element} - The html element you want to listen for a touch event on.

###

lcTouch.factory '$ngTap', ['$timeout', ($timeout)->
    return (elem, handler)->
        distanceThreshold    = 25
        timeThreshold        = 500
        tapped               = false
        dragged              = false

        elem.on 'touchstart', (startEvent)->
            target      = startEvent.target
            if target.disabled then return
            touchStart  = startEvent.touches[0] or startEvent.changedTouches[0] or
                            startEvent.touches[0]
            startX      = touchStart.pageX
            startY      = touchStart.pageY
            tapped      = false

            removeTapHandler = ()->
                $timeout.cancel()
                elem.off 'touchmove', moveHandler
                elem.off 'touchend', tapHandler

            tapHandler = (endEvent)->
                endEvent.preventDefault()
                removeTapHandler()

                if target is endEvent.target
                    tapped = true
                    handler(endEvent)

            moveHandler = (moveEvent)->
                touchMove  = moveEvent.touches[0] or moveEvent.changedTouches[0] or
                            moveEvent.touches[0]
                moveX      = touchMove.pageX
                moveY      = touchMove.pageY

                if Math.abs(moveX - startX) > distanceThreshold or Math.abs(moveY - startY) > distanceThreshold
                    tapped = true
                    removeTapHandler()

            $timeout removeTapHandler, timeThreshold

            elem.on 'touchmove', moveHandler
            elem.on 'touchend', tapHandler

        elem.on 'mousedown', ->
            dragged = false

            handleMousemove = ->
                dragged = true

            handleMouseup = ->
                elem.off 'mousemove'
                elem.off 'mouseup'

            elem.on 'mousemove', handleMousemove
            elem.on 'mouseup', handleMouseup

        elem.on 'click', (event)->
            unless tapped or dragged
                handler(event)


        return angular.element(elem)
]

###
    ngTap Directive

    Description: A replacement for ngClick. This directive will take into account taps and clicks so it
    will work for both mobile and desktop browsers.

    Parameters:
    - ngTap - {string} - An expression representing what you would like to do when the element is tapped or clicked

    Usage:
    <button type="button" ng-tap="doSomething()">Click Me</button>
###

lcTouch.directive 'ngTap', ['$ngTap', '$parse', ($ngTap, $parse)->
    (scope, elem, attrs)->
        tapHandler = $parse(attrs.ngTap)

        $ngTap elem, (event)->
            angular.element(elem).triggerHandler 'tap', event
            scope.$apply ->
                tapHandler(scope, { $event: event })
]


###
    ngDbltap

    Description: A replacement for ngDblclick. This directive will take into account taps and clicks so it
    will work for both mobile and desktop browsers.

    Usage:
    <button type="button" ng-dbltap="doSomething()">Click Me</button>
###

lcTouch.directive 'ngDbltap', ['$timeout', '$parse', ($timeout, $parse)->
    return {
        restrict: 'A'
        link: (scope, elem, attrs)->
            distanceThreshold    = 25
            timeThreshold        = 500
            tapped               = false
            tapcount             = 0

            elem.on 'touchstart', (startEvent)->
                target        = startEvent.target
                touchStart    = startEvent.touches[0] or startEvent.changedTouches[0] or
                                  startEvent.touches[0]
                startX        = touchStart.pageX
                startY        = touchStart.pageY
                dbltapHandler = $parse(attrs.ngDbltap)

                removeTapHandler = ()->
                    $timeout.cancel()
                    elem.off 'touchmove', moveHandler
                    elem.off 'touchend', tapHandler
                    tapcount = 0

                tapHandler = (endEvent)->
                    endEvent.preventDefault()
                    tapcount++

                    if tapcount >= 2
                        removeTapHandler()
                        if target is endEvent.target
                            tapped = true
                            angular.element(elem).triggerHandler 'dbltap', endEvent
                            scope.$apply ->
                                dbltapHandler(scope, { $event: endEvent })

                moveHandler = (moveEvent)->
                    touchMove  = moveEvent.touches[0] or moveEvent.changedTouches[0] or
                                moveEvent.touches[0]
                    moveX      = touchMove.pageX
                    moveY      = touchMove.pageY

                    if Math.abs(moveX - startX) > distanceThreshold or Math.abs(moveY - startY) > distanceThreshold
                        tapped = true
                        removeTapHandler()

                $timeout removeTapHandler, timeThreshold

                elem.on 'touchmove', moveHandler
                elem.on 'touchend', tapHandler


            elem.bind 'dblclick', (event)->
                unless tapped
                    angular.element(elem).triggerHandler 'dbltap', event
                    scope.$apply ->
                        dbltapHandler(scope, { $event: event })
    }
]


###
    ngSwipeDown, ngSwipeUp, ngSwipeLeft, ngSwipeRight

    Description: Adds swipe directives

    Usage:
    <div ng-swipe-down="onswipedown()">
        ...... HTML ......
    </div>
###

lcTouch.factory '$swipe', [()->
    return {
        bind: (elem, events)->
            startX       = 0
            startY       = 0
            endX         = 0
            endY         = 0

            ontouchstart = (e)->
                e.preventDefault()
                touch   = e.touches[0] or e.changedTouches[0] or e.touches[0]
                startX  = touch.pageX
                startY  = touch.pageY

                elem.on 'touchmove', ontouchmove
                elem.on 'touchend', ontouchend

                if events.start then events.start elem, [startX, startY], e

            ontouchmove = (e)->
                touch   = e.touches[0] or e.changedTouches[0] or e.touches[0]
                endX    = touch.pageX
                endY    = touch.pageY

                if events.move then events.move elem, [endX, endY], e

            ontouchend = (e)->
                elem.off 'touchmove', ontouchmove
                elem.off 'touchend', ontouchend

                if events.end then events.end elem, [startX - endX, startY - endY], e

                startX       = 0
                startY       = 0
                endX         = 0
                endY         = 0

            elem.on 'touchstart', ontouchstart
    }
]

lcTouch.directive 'ngSwipeDown', ['$swipe', '$parse', ($swipe, $parse)->
    return {
        restrict: 'A'
        link: (scope, elem, attrs)->
            threshold = Number(attrs.ngSwipeDownThreshold) or 70
            swipeHandler = $parse(attrs.ngSwipeDown)

            onend = (elem, amounts, event)->
                amount = amounts[1]

                if amount < 0 and Math.abs(amount) >= threshold
                    angular.element(elem).triggerHandler 'swipeDown', event
                    scope.$apply ->
                        swipeHandler(scope, { $event: event })

            $swipe.bind elem, { end: onend }
    }
]

lcTouch.directive 'ngSwipeUp', ['$swipe', '$parse', ($swipe, $parse)->
    return {
        restrict: 'A'
        link: (scope, elem, attrs)->
            threshold = Number(attrs.ngSwipeUpThreshold) or 70
            swipeHandler = $parse(attrs.ngSwipeUp)

            onend = (elem, amounts, event)->
                amount = amounts[1]

                if amount > 0 and Math.abs(amount) >= threshold
                    angular.element(elem).triggerHandler 'swipeUp', event
                    scope.$apply ->
                        swipeHandler(scope, { $event: event })

            $swipe.bind elem, { end: onend }
    }
]

lcTouch.directive 'ngSwipeRight', ['$swipe', '$parse', ($swipe, $parse)->
    return {
        restrict: 'A'
        link: (scope, elem, attrs)->
            threshold = Number(attrs.ngSwipeRightThreshold) or 70
            swipeHandler = $parse(attrs.ngSwipeRight)

            onend = (elem, amounts, event)->
                amount = amounts[0]

                if amount < 0 and Math.abs(amount) >= threshold
                    angular.element(elem).triggerHandler 'swipeRight', event
                    scope.$apply ->
                        swipeHandler(scope, { $event: event })

            $swipe.bind elem, { end: onend }
    }
]

lcTouch.directive 'ngSwipeLeft', ['$swipe', '$parse', ($swipe, $parse)->
    return {
        restrict: 'A'
        link: (scope, elem, attrs)->
            threshold = Number(attrs.ngSwipeLeftThreshold) or 70
            swipeHandler = $parse(attrs.ngSwipeLeft)

            onend = (elem, amounts, event)->
                amount = amounts[0]

                if amount > 0 and Math.abs(amount) >= threshold
                    angular.element(elem).triggerHandler 'swipeLeft', event
                    scope.$apply ->
                        swipeHandler(scope, { $event: event })

            $swipe.bind elem, { end: onend }
    }
]



((name, definition)->
    unless typeof module is 'undefined'
        module.exports = definition()
    else if typeof define is 'function' and typeof define.amd is 'object'
        define definition
    else
        @[name] = definition()
)('lcTouch', ->
    return lcTouch
)
