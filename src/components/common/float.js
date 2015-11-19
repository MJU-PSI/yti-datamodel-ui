module.exports = function directive($window, $timeout) {
  'ngInject';
  return {
    restrict: 'A',
    link($scope, element, attributes) {
      const placeholderClass = attributes.float;
      const topOffset = attributes.topOffset || 0;
      let placeholder =
        jQuery(document.createElement('div'))
          .hide()
          .addClass(placeholderClass)
          .insertBefore(element);
      let elementLocation = null;
      let floating = false;

      element.attr('will-change', 'scroll-position');

      // after DOM is fully rendered, initialize element location
      (function init() {
        refreshElementLocation();
        if (!isInitialized()) {
          $timeout(init, 100);
        }
      })();

      angular.element($window).on('scroll', () => {
        if (isInitialized()) {
          if (!floating) {
            // re-refresh has to be done since location can change due to accordion etc
            refreshElementLocation();
            if (window.pageYOffset >= elementLocation.top) {
              setFloating();
            }
          } else if (window.pageYOffset < elementLocation.top) {
            setStatic();
          }
        }
      });

      function isInitialized() {
        return elementLocation && elementLocation.top !== 0;
      }

      function refreshElementLocation() {
        const offset = element.offset();
        elementLocation = {top: offset.top - topOffset, left: offset.left};
      }

      function setFloating() {
        floating = true;
        placeholder.css('width', element.outerWidth() + 'px');
        placeholder.css('height', element.outerHeight() + 'px');
        element.css('left', elementLocation.left + 'px');
        element.css('top', topOffset + 'px');
        element.css('width', element.outerWidth() + 'px');
        element.css('position', 'fixed');
        placeholder.show();
      }

      function setStatic() {
        floating = false;
        element.css('left', '');
        element.css('top', '');
        element.css('position', '');
        element.css('width', '');
        placeholder.hide();
      }
    }
  };
};
