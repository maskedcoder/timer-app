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




  /*------------------------------------*
      #WIDGETS
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
      #MAIN
  \*------------------------------------*/

  function main() {
    var $tabs = document.querySelector('.js-tabs');
    TabWidget.init($tabs);
  }

  main();
})();
