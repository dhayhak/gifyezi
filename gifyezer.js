(function () {

// Configure Raven or Other library for Error Logging
//  Raven.config('RAVEN_URL_HERE').install();

  try {

    //Keep track of loaded img
    document.body.addEventListener(
      'load',
      function (event) {
        var elm = event.target;

        if (elm.nodeName.toLowerCase() == 'img') {
          freezeElement(elm);
        }
      }, true);

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js";
      fjs.parentNode.insertBefore(js, fjs);
    } (document, 'script', 'gifyezi-jquery'));


    var css = '.gifyezi-container:hover .gifyezi-action{opacity:1;} .gifyezi-action{ opacity:0.2;}'
    var cssContainer = '<style type="text/css">{gigyezicss}</style>';
    cssContainer = cssContainer.replace('{gigyezicss}', css);

    var head = document.head || document.querySelector('head'),
      style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    function createElement(type, callback) {
      var element = document.createElement(type);
      callback(element);
      return element;
    }


    function freezeGif(img) {
      var width = img.width,
        height = img.height,
        canvas = createElement('canvas', function (clone) {
          clone.width = width;
          clone.height = height;
        });

      image = new Image();
      image.onload = function () {
        canvas.getContext('2d').drawImage(image, 0, 0);
      }

      image.src = img.src;
      // canvas.style.position = 'absolute';
      canvas.style.display = "none";
      var container = document.createElement('div');
      var icon = document.createElement('img');
      icon.src = chrome.extension.getURL("icon.png"); //'icon.png';
      icon.style.position = 'absolute';
      icon.style.color = '#e8e8e7';
      icon.style.zIndex = 1;
      icon.className = 'gifyezi-action';
      icon.style.height = "25px";
      icon.style.width = "25px";
      icon.style.left = "-4px";
      icon.style.cursor = 'pointer';
      container.appendChild(icon);
      container.appendChild(canvas);
      img.parentNode.className = 'gifyezi-container';
      img.parentNode.insertBefore(container, img, width, height);

      $(icon).click(function (event) {
        toggle.call(this);
        event.stopPropagation();
        return false;
      });
    }

    function toggle() {
      var canvas = $(this).parent().find('canvas');
      var img = $(this).parent().next('img');
      if (canvas.is(':visible')) {
        img.show();
        canvas.hide();
      } else {
        img.hide();
        canvas.show();
      }
    }

    var interval = setInterval(function () {
      if (jQuery) {
        bindJqueryEvents();
        clearInterval(interval)
      }
    }, 250);

    function checkVisibility(elm) {
      return $(elm).is(':visible') && $(elm).css('visibility') != "hidden" && $(elm).css('opacity') != "0"
    }

    function bindJqueryEvents() {
      var index = 0;
      $('img').each(function (i) {
        index += i;
        freezeElement(this);
      })
      console.log(index);
    }

    function freezeElement(element) {
      if (checkVisibility(element)) {
        var that = element;
        var src = $(element).attr('src');
        var isGif = false;

        var urlParts = src.match(/\.([^\./\?]+)($|\?)/);

        if (urlParts && urlParts.length > 0) {
          if (urlParts[1].toLowerCase() == 'gif') {
            freezeGif(that);
          }
        } else {
          // Check if animated
          isAnimatedGif(src, function (animated) {
            if (animated) {
              freezeGif(that);
            }
          })
        }
      }
    }

    function isAnimatedGif(src, cb) {
      var request = new XMLHttpRequest();
      request.open('GET', src, true);
      request.responseType = 'arraybuffer';
      request.addEventListener('load', function () {
        var arr = new Uint8Array(request.response),
          i, len, length = arr.length,
          frames = 0;

        // make sure it's a gif (GIF8)
        if (arr[0] !== 0x47 || arr[1] !== 0x49 ||
          arr[2] !== 0x46 || arr[3] !== 0x38) {
          cb(false);
          return;
        }

        //ported from php http://www.php.net/manual/en/function.imagecreatefromgif.php#104473
        //an animated gif contains multiple "frames", with each frame having a
        //header made up of:
        // * a static 4-byte sequence (\x00\x21\xF9\x04)
        // * 4 variable bytes
        // * a static 2-byte sequence (\x00\x2C) (some variants may use \x00\x21 ?)
        // We read through the file til we reach the end of the file, or we've found
        // at least 2 frame headers
        for (i = 0, len = length - 9; i < len, frames < 2; ++i) {
          if (arr[i] === 0x00 && arr[i + 1] === 0x21 &&
            arr[i + 2] === 0xF9 && arr[i + 3] === 0x04 &&
            arr[i + 8] === 0x00 &&
            (arr[i + 9] === 0x2C || arr[i + 9] === 0x21)) {
            frames++;
          }
        }

        // if frame count > 1, it's animated
        return cb(frames > 1);
      });
      request.send();
    }

  } catch (e) {
    //Raven.captureException(e)
  }
})()
