/**
 * Databind plugin
 *
 * Trigger hub messages on element events. Configuration using data-on attribute.
 * Works only events that bubble.
 *
 * Examples: 
 *  <a class="close" data-on="click:app.close"></a>
 *  <input type="text" name="email" data-on="click:validate(email)">
 * param @publish 
 */
(function (jQuery) {
  var messageRegExp = /([a-zA-Z,\.\-_\/]+)(?:\(([^)]+)\))?$/
  
  $.fn.databind = function (hub, events) {
    hub = hub || $(document)
    events = events || "click mousemove"
    
    this.on(events, function (currentEvent) {
      var $target = $(currentEvent.target)
        , currentType = currentEvent.type
        , onEvents = null
        , dropEvents = null
      
      while ($target.length) {
        if ((onEvents = $target.attr('data-on'))) {
          onEvents = onEvents.split(';')
          
          for (var i = 0, ev; (ev = onEvents[i]); i++) {
            ev = ev.split(':')
            var types = ev[0].split(',')
              , msg = ev[1]
              
            for (var j = 0, type; (type = types[j]); j++) {
              if (type == currentType) {
                messageRegExp.lastIndex = 0
                var res = messageRegExp.exec(msg) || false
                if (res) {
                  var name = res[1]
                    , data = res[2] || null
                
                  hub.trigger(name, { data: data, target: $target })
                }
              }
            }
          }
        }
        
        if ((dropEvents = $target.attr('data-drop'))) {
          dropEvents = dropEvents.split(',')
          for (var i = 0, type; (type = dropEvents[i]); i++) {
            if (type == currentType) {
              return false
            }
          }
        }
        $target = $target.parent()
      }
    })
  }
  
})(jQuery);
