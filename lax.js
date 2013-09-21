/**
 * Depends on lax.css
 *
 * Assumes use with a document that scrolls ie. not with
 * individual elements that scroll within a document.
 *
 * MIT License
 * Copyright 2013 Neil Loknath <neil.loknath@gmail.com>
 */

;(function($) {

  function render(scrollOffset) {
    var wh = $(window).height();
    var dh = $(document).height();    
    $(".lax-layer").each(function() {
      // layer scroll speed
      var speed = parseFloat($(this).data("lax-y-speed")) || 0;
      var transform = "translate3d(0," +
        -scrollOffset * speed +
        "px," +
        "0)";

      // fade speed
      var opacitySpeed = parseFloat($(this).data("lax-opacity-speed")) || 0;
      // when to start fading
      var opacityDelay = parseFloat($(this).data("lax-opacity-offset")) || 0;

      $(this).css({
        opacity: (opacitySpeed < 0 ? 0 : 1) - (scrollOffset - opacityDelay) / Math.max(wh, (dh - wh)) * opacitySpeed,
        webkitTransform: transform,
        mozTransform: transform,
        msTransform: transform,
        transform: transform
      });

    });
  }

  var debug = 0;

  function log(s) {
    if (debug) {
      console.log(s);
    }
  }

  $(function() {
    var intervalId;

    // move the layers
    // handle touchmove for mobile devices
    // note -- iOS Safari doesn't execute javascript during scrolling
    $(document).on("scroll touchmove", function(e) {
      log("touchmove: " + e);
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = 0;
      }
      var offset = $(this).scrollTop();
      render(offset);
    });

    // handle touchend to keep the layers moving
    // the same way the do on the desktop with scroll events
    $(document).on("touchend", function(e) {
      log("touchend: ", e); 
      var self = this;
      intervalId = id = setInterval(function() {
        var offset = $(self).scrollTop();
        log("render loop: " + offset);
        if (id !== intervalId) {
          clearInterval(id);
          return;
        }
        render(offset);
      }, 1000 / 60);
    });
  });
})(jQuery);
