document.addEventListener('DOMContentLoaded', function () {
    var slider = document.getElementById('percentage-slider');
    var input = document.getElementById('percentage-input');
  
    // Update number input when the slider changes
    slider.oninput = function() {
      input.value = this.value;
      // Additional logic can be added here, if needed
    };
  
    // Update slider when the number input changes
    input.oninput = function() {
      var value = parseInt(this.value);
      if (value < 1) {
        value = 1;
      } else if (value > 100) {
        value = 100;
      }
      slider.value = value;
      this.value = value;
      // Additional logic can be added here, if needed
    };
  });
  