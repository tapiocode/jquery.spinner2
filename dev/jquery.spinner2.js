/* ==============================================================================
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
;(function ($) {
  
  var defaults = { value: 0, min: 0 };
  var keyCodes = { up: 38, down: 40 };

  $.fn.spinner = function (opts) {
    return this.each(function () {
      var options = $.extend(defaults, opts);
      var container = $('<div>')
        .addClass('spinner')
        .data('lastValidValue', options.value);
      var textField = $(this)
        .addClass('value')
        .attr('maxlength', '2')
        .val(options.value)
        .bind('keyup paste change', function (e) {
          var field = $(this);
          if (e.keyCode === keyCodes.up) {
            changeValue(1);
          } else if (e.keyCode === keyCodes.down) {
            changeValue(-1);
          } else if (getValue(field) !== container.data('lastValidValue')) {
            validateAndTrigger(field);
          }
        });

      function changeValue(direction) {
        var stepSize = textField.data('step') || 1;
        textField.val(getValue() + stepSize * direction);
        validateAndTrigger(textField);
      }

      function validateAndTrigger(field) {
        clearTimeout(container.data('timeout'));
        var value = validate(field);
        if (value !== null) {
          textField.trigger('update', [field, value]);
        }
      }

      function validate(field) {
        var value = getValue();
        var isInvalidValue = isInvalid(value);
        field
            .toggleClass('invalid', isInvalidValue)
            .toggleClass('passive', value === 0)
            .siblings('.decrease')
            .attr('disabled', (value <= options.min ? 'disabled' : null));

        if (isInvalidValue) {
          var timeout = setTimeout(function () {
            textField.val(container.data('lastValidValue'));
            validate(field);
          }, 500);
          container.data('timeout', timeout);
          return null;
        }

        container.data('lastValidValue', value);
        return value;
      }

      function isInvalid(value) {
        return isNaN(+value) || value < options.min;
      }

      function getValue(field) {
        field = field || textField;
        return parseInt(field.val() || 0, 10);
      }

      function getButton(direction) {
        var positive = direction > 0;
        var classNames = [ 'stepper', (positive ? 'increase' : 'decrease') ];
        var button = $('<button>')
          .addClass(classNames.join(' '))
          .html(positive ? '+' : '-')
          .click(function() {
            changeValue(positive ? 1 : -1);
          });
        return button;
      }

      textField
        .wrap(container)
        .before(getButton(-1))
        .after(getButton(1));

      textField.val(textField.data('initvalue') || 0);
      validate(textField);

    });
  };
})(jQuery);
