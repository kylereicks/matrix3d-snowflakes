;(function(window, document, undefined){
  'use strict';
  var snowflake = function(settings){
    var flake = document.createElement('div'),
    page = document.getElementsByTagName('html')[0],
    pageHeight = +window.getComputedStyle(page).height.substr(0, window.getComputedStyle(page).height.length - 2),
    pageWidth = +window.getComputedStyle(page).width.substr(0, window.getComputedStyle(page).width.length - 2),
    pageHeightOffset = -pageHeight,
    movements = {
      tY: utilities.randomRange(5, 20) * 0.1,
      tXdirection: Math.random() < 0.5 ? -1 : 1,
      tXfreq: utilities.randomRange(5, 40) * 0.1,
      tXamp: utilities.randomRange(5, 10) * 0.1,
      tZdirection: Math.random() < 0.5 ? -1 : 1,
      tZfreq: utilities.randomRange(20, 40) * 0.1,
      tZamp: utilities.randomRange(1, 5) * 0.1,
      rXdirection: Math.random() < 0.5 ? -1 : 1,
      rXfreq: utilities.randomRange(2, 40) * 0.1,
      rYdirection: Math.random() < 0.5 ? -1 : 1,
      rYfreq: utilities.randomRange(2, 40) * 0.1,
      rZdirection: Math.random() < 0.5 ? -1 : 1,
      rZfreq: utilities.randomRange(2, 40) * 0.1
    },
    initialMatrix = '',
    xOrigin = utilities.randomRange(0, pageWidth);
    settings.color = settings.color || {};
    settings.color.rRange = settings.color.rRange || [225, 255];
    settings.color.gRange = settings.color.gRange || [225, 255];
    settings.color.bRange = settings.color.bRange || [255, 255];
    settings.color.aRange = settings.color.aRange || [0, 1];
    flake.className = 'snowflake snowflake--' + utilities.randomRange(1, settings.symbolArray.length) + ' snowflake--size-' + utilities.randomRange(settings.sizeRange[0], settings.sizeRange[1]);
    flake.style.color = 'rgba(' + utilities.randomRange(settings.color.rRange[0], settings.color.rRange[1]) + ', ' + utilities.randomRange(settings.color.gRange[0], settings.color.gRange[1]) + ', ' + utilities.randomRange(settings.color.bRange[0], settings.color.bRange[1]) + ', ' + (utilities.randomRange(settings.color.aRange[0] * 100, settings.color.aRange[1] * 100) / 100) + ')';
    initialMatrix = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + xOrigin + ', ' + pageHeightOffset + ', 0, 1)';
    flake.style['-webkit-transform'] = initialMatrix;
    flake.style['-moz-transform'] = initialMatrix;
    flake.style['-o-transform'] = initialMatrix;
    flake.style['-ms-transform'] = initialMatrix;
    flake.style.transform = initialMatrix;
    document.body.insertBefore(flake, null);
    matrix3d.translateOrigin(flake, xOrigin, pageHeightOffset);
    fall(flake, pageHeightOffset, movements);
  },
  fall = function(element, offset, move){
    var el = element,
    deg = Math.PI / 180,
    initialMatrix = matrix3d.getComputedMatrix(el),
    tX = matrix3d.baseMatrix.slice(0),
    tY = matrix3d.baseMatrix.slice(0),
    tZ = matrix3d.baseMatrix.slice(0),
    rX = matrix3d.baseMatrix.slice(0),
    rY = matrix3d.baseMatrix.slice(0),
    rZ = matrix3d.baseMatrix.slice(0),
    translateX = 0,
    translateY = 0,
    frame = 0,
    animate = function(){
      var frameMatrix = '';
      translateY = move.tY;
      translateX = Math.sin(frame * (deg / move.tXfreq)) * (move.tXdirection * move.tXamp);
      frame = frame + 1;
      tY[13] = tY[13] + translateY;
      tX[12] = tX[12] + translateX;
      tZ[15] = Math.sin(frame * (deg / move.tZfreq)) * (move.tZdirection * move.tZamp) + 1;
      matrix3d.translateOrigin(el, translateX, translateY);
      rX[5] = Math.cos(move.rXdirection * frame * (deg / move.rXfreq));
      rX[6] = -Math.sin(move.rXdirection * frame * (deg / move.rXfreq));
      rX[9] = Math.sin(move.rXdirection * frame * (deg / move.rXfreq));
      rX[10] = Math.cos(move.rXdirection * frame * (deg / move.rXfreq));
      rY[0] = Math.cos(move.rYdirection * frame * (deg / move.rYfreq));
      rY[2] = Math.sin(move.rYdirection * frame * (deg / move.rYfreq));
      rY[8] = -Math.sin(move.rYdirection * frame * (deg / move.rYfreq));
      rY[10] = Math.cos(move.rYdirection * frame * (deg / move.rYfreq));
      rZ[0] = Math.cos(move.rZdirection * frame * (deg / move.rZfreq));
      rZ[1] = -Math.sin(move.rZdirection * frame * (deg / move.rZfreq));
      rZ[4] = Math.sin(move.rZdirection * frame * (deg / move.rZfreq));
      rZ[5] = Math.cos(move.rZdirection * frame * (deg / move.rZfreq));
      frameMatrix = 'matrix3d(' + matrix3d.x(matrix3d.x(matrix3d.x(matrix3d.x(matrix3d.x(matrix3d.x(initialMatrix, tY), tX), tZ), rX), rY), rZ) + ')';
      el.style['-webkit-transform'] = frameMatrix;
      el.style['-moz-transform'] = frameMatrix;
      el.style['-o-transform'] = frameMatrix;
      el.style['-ms-transform'] = frameMatrix;
      el.style.transform = frameMatrix;
    if(el.getBoundingClientRect().top < window.innerHeight){
        animateID = window.requestAnimationFrame(animate);
      }else{
        window.cancelAnimationFrame(animateID);
        el.parentNode.removeChild(el);
      }
    };
    var animateID = window.requestAnimationFrame(animate);
  },
  matrix3d = {
    baseMatrix: [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ],
    getComputedMatrix: function(element){
      var m = window.getComputedStyle(element).transform || window.getComputedStyle(element).webkitTransform,
      ml = m.length;
      if('matrix3d' === m.substr(0, 8)){
        m = m.substr(8).replace(/[\(\)]/g, '').split(',');
        for(var i = 0; i < ml; i++){
          m[i] = +m[i];
        }
      }else if('matrix(' === m.substr(0, 7)){
        m = m.substr(6).replace(/[\(\)]/g, '').split(',');
        for(var j = 0; j < ml; j++){
          m[j] = +m[j];
        }
        m = [
          m[0], m[1], 0, 0,
          m[2], m[3], 0, 0,
          0, 0, 1, 0,
          m[4], m[5], 0, 1
        ];
      }else{
        m = matrix3d.baseMatrix.slice(0);
      }
      return m;
    },
    translateOrigin: function(element, x, y){
      var el = element,
      initialOrigin = {},
      newOrigin = '',
      computedStyle = window.getComputedStyle(el);
      initialOrigin.string = computedStyle['transform-origin'] || computedStyle.transformOrigin || computedStyle['-webkit-transform-origin'] || computedStyle.msTransformOrigin;
      initialOrigin.array = initialOrigin.string.split(' ');
      initialOrigin.x = +initialOrigin.array[0].substr(0, initialOrigin.array[0].length - 2);
      initialOrigin.y = +initialOrigin.array[1].substr(0, initialOrigin.array[1].length - 2);
      newOrigin = (initialOrigin.x + x) + 'px ' + (initialOrigin.y + y) + 'px';
      el.style['-webkit-transform-origin'] = newOrigin;
      el.style['-moz-transform-origin'] = newOrigin;
      el.style['-o-transform-origin'] = newOrigin;
      el.style['-ms-transform-origin'] = newOrigin;
      el.style['transform-origin'] = newOrigin;
      el.style.transformOrigin = newOrigin;
    },
    x: function(a, b){
      return [
        a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
        a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
        a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
        a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
        a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
        a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
        a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
        a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
        a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
        a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
        a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
        a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],
        a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
        a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
        a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
        a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
      ];
    }
  },
  utilities = {
    randomRange: function(start, end, random){
      var rand = random || Math.random();
      return Math.floor(rand * (end - start + 1) + start);
    },
    delay: function(settings){
      window.requestAnimationFrame(function(){snowflakes(settings);});
    }
  },
  snowflakes = function(settings){
    snowflake(settings);
    window.setTimeout(function(){utilities.delay(settings);}, 1000);
  },
  init = function(){
    this.run = true;
    var snowflakeSettings = window.snowflakeSettings || {},
    style = document.createElement('style'),
    css = '';
    snowflakeSettings.symbolArray = snowflakeSettings.symbolArray || ['❄', '❅', '❆', '❉', '⚹', '✶', '✲', '✱', '⊛', '⏣', '☸', '✻', '✼', '✽', '✾', '❃', '❇', '❈', '✵'];
    snowflakeSettings.sizeRange = snowflakeSettings.sizeRange || [1, 20];
    snowflakeSettings.shadow = snowflakeSettings.shadow || '0 0 5px rgba(255, 255, 255, .5)';
    snowflakeSettings.color = snowflakeSettings.color || {};
    css += '.snowflake{position:fixed;-webkit-transform-style:preserve-3d;-moz-transform-style:preserve-3d;-o-transform-style:preserve-3d;-ms-transform-style:preserve-3d;transform-style:preserve-3d;text-shadow:' + snowflakeSettings.shadow + ';}';
    for(var i = 0, symbolArrayLength = snowflakeSettings.symbolArray.length; i < symbolArrayLength; i++){
      css += '.snowflake--' + (i + 1) + ':before{content:"' + snowflakeSettings.symbolArray[i] + '";}';
    }
    for(var j = 0; j + snowflakeSettings.sizeRange[0] <  snowflakeSettings.sizeRange[0] + snowflakeSettings.sizeRange[1]; j++){
      css += '.snowflake--size-' + (j + snowflakeSettings.sizeRange[0]) + '{font-size:' + (j + snowflakeSettings.sizeRange[0]) + 'px;}';
    }
    style.insertBefore(document.createTextNode(css), null);
    document.head.insertBefore(style, null);
    snowflakes(snowflakeSettings);
  };
  if(window.addEventListener){
    window.addEventListener('load', init, false);
  }else if(window.attachEvent){
    window.attachEvent('onload', init);
  }
  if('complete' === document.readyState && !init.run){
    init();
  }
}(this, document));
