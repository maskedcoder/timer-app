(function() {

  /*------------------------------------*
      #HELPERS
  \*------------------------------------*/

  var arrayFrom = function(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
  };

  var idFromHref = function(href) {
    return href.split('#')[1];
  };

  // I sure hope this is efficient...
  var formatTime = function(time) {
    var left;

    var ms = Math.round((time % 1000) / 10);
    left = Math.floor(time / 1000);

    if (ms == 100) {
      ms = 0;
      left += 1;
    }

    var seconds = left % 60;
    left = Math.floor(left / 60);

    var minutes = left % 60;
    var hours = Math.floor(left / 60);

    hours = (hours < 10) ? '0' + hours : '' + hours;
    minutes = (minutes < 10) ? '0' + minutes : '' + minutes;
    seconds = (seconds < 10) ? '0' + seconds : '' + seconds;
    ms = (ms < 10) ? '0' + ms : '' + ms;

    return hours + ':' + minutes + ':' + seconds + '.' + ms;
  }




  /*------------------------------------*
      #WIDGETS
  \*------------------------------------*/

  /*------------------------------------*
      #TAB-WIDGET
  \*------------------------------------*/

  var TabWidget = {
    $root: null,
    $tabs: null,
    $contents: null,

    init: function($element) {
      this.$root = $element;
      this.$tabs = arrayFrom($element.querySelectorAll('.js-tab'));

      this.$contents = this.$tabs.map(function($tab) {
        return document.getElementById(idFromHref($tab.href));
      });

      this.bindUIEvents();
    },

    bindUIEvents: function() {
      var that = this;

      this.$root.addEventListener('click', function(e) {
        // We are only interested in clicks on the tab list
        if (!e.target.classList.contains('js-tab')) {
          return;
        }

        that.switchTab(e.target);
      });
    },

    switchTab: function($tab) {
      var $currentPage = document.getElementById(idFromHref($tab.href));

      this.$tabs.forEach(function($tb) {
        $tb.classList.remove('c-tabs__link--current');
      });
      this.$contents.forEach(function($content) {
        $content.classList.remove('c-page--current');
      });

      $tab.classList.add('c-tabs__link--current');
      $currentPage.classList.add('c-page--current');
    }
  };


  /*------------------------------------*
      #TIMER-WIDGET
  \*------------------------------------*/

  var TimerWidget = {
    $display: null,
    $entry: null,
    $stop: null,
    $save: null,
    $toggle: null,

    active: false,
    total: 0,
    timer: null,

    init: function($element) {
      this.$display = $element.querySelector('.js-time-display');
      this.$entry = $element.querySelector('.js-name');
      this.$stop = $element.querySelector('.js-cancel');
      this.$save = $element.querySelector('.js-accept');
      this.$toggle = $element.querySelector('.js-toggle');

      this.bindUIEvents();
    },

    bindUIEvents: function() {
      var that = this;

      this.$stop.addEventListener('click', function(e) {
        that.stopTimer();
      });
      this.$save.addEventListener('click', function(e) {
        that.saveTimer();
      });
      this.$toggle.addEventListener('click', function(e) {
        that.toggleTimer();
      });
    },

    stopTimer: function() {
      this.active = false;
      this.total = 0;
      this.timer = false;

      this.$display.innerHTML = '00:00:00.00';
      this.$toggle.classList.remove('c-button--pause');
      this.$toggle.classList.add('c-button--go');
    },

    saveTimer: function() {
      if (this.active) {
        var now = Date.now()
        this.total = now - this.timer;
      }

      var title = this.$entry.value || 'Unnamed timer';

      // TODO: actually save it, perhaps?
      alert(title + ' - ' + formatTime(this.total));

      this.active = false;
      this.total = 0;
      this.timer = false;

      this.$display.innerHTML = '00:00:00.00';
      this.$toggle.classList.remove('c-button--pause');
      this.$toggle.classList.add('c-button--go');
    },

    toggleTimer: function() {
      if (this.active) {
        var now = Date.now();
        this.total = now - this.timer;

        this.timer = false;
        this.active = false;

        this.$toggle.classList.remove('c-button--pause');
        this.$toggle.classList.add('c-button--go');

        this.updateTimer();
        return;
      }

      this.active = true;
      this.timer = Date.now();

      this.$toggle.classList.remove('c-button--go');
      this.$toggle.classList.add('c-button--pause');

      this.updateTimer();
    },

    updateTimer: function() {
      if (!this.active) {
        this.$display.innerHTML = formatTime(this.total);
        return;
      }

      var now = Date.now();
      var time = this.total + (now - this.timer);
      var that = this;

      this.$display.innerHTML = formatTime(time);

      requestAnimationFrame(function() {
        that.updateTimer();
      });
    }
  };




  /*------------------------------------*
      #MAIN
  \*------------------------------------*/

  function main() {
    var $tabs = document.querySelector('.js-tabs');
    TabWidget.init($tabs);

    var $timer = document.querySelector('.js-timer');
    TimerWidget.init($timer);
  }

  main();
})();
