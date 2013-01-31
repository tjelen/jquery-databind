/**
 * Databind plugin
 *
 * Trigger hub messages on element events. Configuration using data-on attribute.
 * Works only on events that bubble.
 *
 * Examples: 
 *  <a class="close" data-on="click:app.close" data-drop="click"></a>
 *  <input type="text" name="email" data-on="click,keyup,change:validate(email) focus,blur:input.highlightToggle">
 *
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) { define(['jquery'], factory) } else { factory(jQuery) }
}(function ($) {
  var messageRegExp = /([a-zA-Z0-9,\.\-_\/]+)(?:\(([^)]+)\))?$/
  
  $.fn.databind = function (hub, events, selector, options) {
    hub = hub || $(document)
    events = events || "tap"
    options = $.extend({}, $.fn.databind.defaults, options)
    
    var handler = function (currentEvent) {
      var $target = $(currentEvent.target)
        , origTarget = $target
        , currentType = currentEvent.type
        , onEvents = null
        , dropEvents = null
        , args = Array.prototype.slice.apply(arguments) || []
      
      while ($target.length) {
        if ((onEvents = $target.attr(options.onAttribute))) {
          onEvents = onEvents.split(/\s+/)
          
          for (var i = 0, ev; (ev = onEvents[i]); i++) {
            ev = ev.split(':')
            var types = ev[0].split(',')
              , msg = ev[1]
            
            for (var j = 0, type; (type = types[j]); j++) {
              if (
                type === currentType
                || (options.map[type] && options.map[type][currentType]) // mapped/aliased event
              ) {
                messageRegExp.lastIndex = 0
                var res = messageRegExp.exec(msg) || false
                if (res) {
                  var name = res[1]
                    , data = res[2] || null
                    , args = args.slice()
                  
                  args.unshift({
                    data: data,
                    target: $target,
                    originalTarget: origTarget                 
                  })
                  args.unshift(name)
                  
                  hub.trigger.apply(hub, args)
                }
              }
            }
          }
        }
        
        if ((dropEvents = $target.attr(options.dropAttribute))) {
          dropEvents = dropEvents.split(/\s+/)
          for (var i = 0, type; (type = dropEvents[i]); i++) {
            if (
              type === currentType
              || (options.map[type] && options.map[type][currentType]) // mapped/aliased event
            ) {
              return false
            }
          }
        }
        $target = $target.parent()
      }
    }
    
    // replace event aliases
    events = events.replace(/\w+/g, function (ev) {
      var map = options.map[ev]
      if (map) {
        var out = []
        for (var k in map) {
          out.push(k)
        }
        ev = out.join(' ')
      }
      return ev
    })
    
    if (selector) {
      this.on(events, selector, handler)
    } else {
      this.on(events, handler)
    }
  }
  
  $.fn.databind.defaults = {
    onAttribute: 'data-on',
    dropAttribute: 'data-drop',
    map: {
      'tap': {
        'click': true,
        'touchstart': true
      }
    }
  }
  
}));
