(function() {

  /*------------------------------------*
      #GLOBALS
  \*------------------------------------*/

  var SESSION_STORAGE_NAME = 'timer-data';




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

  var capitalize = function(string) {
    return string.replace(/\b([a-z])/g, function ($) {
      return $.toUpperCase();
    });
  }

  var findParent = function($base, selector) {
    var $parent = $base.parentElement;

    while ($parent) {
      if ($parent.matches(selector)) {
        return $parent;
      }

      $parent = $parent.parentElement;
    }

    return false;
  }




  /*------------------------------------*
      #COMPONENTS
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

      window.dispatchEvent(new Event('tabchange'));
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

    store: null,

    active: false,
    total: 0,
    timer: null,

    init: function($element, store) {
      this.$display = $element.querySelector('.js-time-display');
      this.$entry = $element.querySelector('.js-name');
      this.$stop = $element.querySelector('.js-cancel');
      this.$save = $element.querySelector('.js-accept');
      this.$toggle = $element.querySelector('.js-toggle');

      this.store = store;

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

      this.store.add(title, this.total);

      alert('Save successful');

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
      #STORE
  \*------------------------------------*/

  var Store = {
    data: [],

    init: function() {
      this.reload();
    },

    add: function(name, value) {
      this.data.push({
        name: name,
        value: value
      });

      this.save();
    },

    remove: function(index) {
      this.data = this.data.slice(0, index)
                            .concat(this.data.slice(index + 1));

      this.save();
    },

    update: function(index, field, newValue) {
      this.data[index][field] = newValue;

      this.save();
    },

    query: function(fields, where, sortBy) {
      var data = JSON.parse(JSON.stringify(this.data));

      if (where) {
        data = data.filter(where);
      }

      if (sortBy) {
        data = data.sort(sortBy);
      }

      if (fields === '*') {
        return data;

      } else if (Array.isArray(fields)) {
        return data.map(function(row) {
          var datum = {};

          fields.forEach(function(field) {
            datum[field] = row[field];
          });

          return datum;
        });

      } else {
        return data.map(function(row) {
          return row[fields];
        });
      }
    },

    reload: function() {
      var data = sessionStorage.getItem(SESSION_STORAGE_NAME);

      if (data) {
        this.data = JSON.parse(data);
      } else {
        this.data = [];
      }
    },

    save: function() {
      var data = JSON.stringify(this.data);
      sessionStorage.setItem(SESSION_STORAGE_NAME, data);
    }
  };


  /*------------------------------------*
      #DATAVIEW
  \*------------------------------------*/

  var Dataview = {
    store: null,

    init: function($display, store) {
      this.$display = $display;
      this.$table = $display.querySelector('.js-table');
      this.store = store;

      this.renderAll();
      this.bindUIEvents();
    },

    bindUIEvents: function() {
      var that = this;

      this.$table.addEventListener('click', function(e) {
        var $el = e.target;

        // Handle delete
        if ($el.classList.contains('js-delete')) {
          that.deleteItem($el);
          return;
        }

        // Handle edit
        if ($el.classList.contains('js-edit')) {
          that.editItem($el);
          return;
        }
      });
    },

    deleteItem: function($el) {
      var id = findParent($el, '.js-row').dataset['id'];
      this.store.remove(Number(id));
      this.renderAll();
    },

    editItem: function($el) {
      var that = this;
      var value = $el.innerHTML;
      var $input = document.createElement('input');

      $input.type = 'text';
      $input.value = value;
      $input.className = 'js-inline-form';

      $input.addEventListener('focusout', function() {
        var id = findParent($el, '.js-row').dataset['id'];
        var field = $el.dataset['field'];
        var value = $input.value;

        that.store.update(id, field, value);

        that.renderAll();
      });

      $el.innerHTML = ''
      $el.appendChild($input);
      $input.focus();
    },

    renderAll: function() {
      var html = '';

      var data = this.store.query('*');

      if (data.length) {
        html += '<tr>';
        html += '<th>Index</th>';
        for (var field in data[0]) {
          html += '<th>' + capitalize(field) + '</th>';
        }
        html += '<th></th>';
        html += '</tr>';

        data.forEach(function(item, index) {
          html += '<tr class="js-row" data-id="' + index + '">';
          html += '<td>' + (index + 1) + '</td>';
          html += '<td class="js-edit" data-field="name">' + item.name + '</td>';
          html += '<td data-field="value">' + formatTime(item.value) + '</td>';
          html += '<td><a class="js-delete" href="#delete">Delete</a></td>';
          html += '</tr>';
        });
      } else {
        html = '<p><em>I&rsquo;m so sorry! There is no data.</em></p>';
      }

      this.$table.innerHTML = html;
    }
  };




  /*------------------------------------*
      #MAIN
  \*------------------------------------*/

  function main() {
    Store.init();

    var $dataview = document.querySelector('.js-datalist');
    Dataview.init($dataview, Store);

    var $tabs = document.querySelector('.js-tabs');
    TabWidget.init($tabs);

    window.addEventListener('tabchange', function() {
      Dataview.renderAll();
    });

    var $timer = document.querySelector('.js-timer');
    TimerWidget.init($timer, Store);
  }

  main();
})();
