/**
 * Minim-emulation code by Daniel Hodgin
 */

function Minim() {
  this.loadFile = function(str) {
    return new AudioPlayer(str);
  }
  this.loadSample = function(str) {
    return new AudioSample(str);
  }
}

// Browser Audio API
function AudioSample(str) {

  var loaded = false;
  var looping = false;

  if (!!document.createElement('audio').canPlayType) {

    var audio = document.createElement('audio');
    audio.preload = 'auto';
    audio.autobuffer = true;

    audio.src = str;
    if (canPlayOgg()) { // firefox-only
      audio.src = str.split(".")[0] + ".ogg";
    } 
    loaded = true;
  }

  this.trigger = function () {
    if (!loaded) {
      var local = this;
      setTimeout(function() { 
        local.trigger();
      }
      , 50);
      return;
    }
        console.log('xtrigger');

    
    // rewind first
    if (audio.currentTime)
      audio.currentTime = 0;
    audio.play();
  }
}

// Browser Audio API
function AudioPlayer(str) {
  var loaded = false;
  var looping = false;

  if (!!document.createElement('audio').canPlayType) {
    var audio = document.createElement('audio');
    audio.addEventListener('ended', function () {
      if (looping) {
        this.currentTime = 0;
        this.play();
      }
    }
    , false);
    
    audio.preload = 'auto';
    audio.autobuffer = true;
    audio.src = str;
    
    if (canPlayOgg()) { // firefox-only
      audio.src = str.split(".")[0] + ".ogg";
    }
    
    loaded = true;
  }

  this.play = function () {
    if (!loaded) {
      var local = this;
      setTimeout(function() { 
        local.play();
      }
      , 50);
      return;
    }
    audio.play();
  };
  this.loop = function () {
    if (!loaded) {
      var local = this;
      setTimeout(function() { 
        local.loop();
      }
      , 50);
      return;
    }
    //audio.loop = 'loop';
    looping = true;
    audio.play();
  };
  this.pause = function () {
    if (!loaded) {
      return;
    }
    audio.pause();
  };
  this.rewind = function () {
    if (!loaded) {
      return;
    }
    // rewind the sound to start
    if (audio.currentTime) {
      audio.currentTime = 0;
    }
  };
  this.position = function() {
    if (!loaded) {
      return -1;
    }
    if (audio.currentTime) {
      return audio.currentTime * 1000;
    }
    return -1;
  };
  this.cue = function(position) {
    if (!loaded) {
      return;
    }
    if (audio.currentTime) {
      audio.currentTime = position / 1000;
    }
  };
  this.mute = function() {
    audio.volume = 0.0;
  };
  this.unmute = function() {
    audio.volume = 1.0;
  };
}

function canPlayOgg() {
  var a = document.createElement('audio');
  return !!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
}

function canPlayMp3() {
  var a = document.createElement('audio');
  return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}
