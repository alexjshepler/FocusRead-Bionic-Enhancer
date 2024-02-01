document.addEventListener("DOMContentLoaded", function () {
  var slider = document.getElementById("percentage-slider");
  var input = document.getElementById("percentage-input");

  // Update number input when the slider changes
  slider.oninput = function () {
    input.value = this.value;
    // Additional logic can be added here, if needed
  };

  // Update slider when the number input changes
  input.oninput = function () {
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

document.getElementById('submitBtn').addEventListener('click', function() {
  console.log("Start of send")
  // You can modify this to pass the specific arguments you need
  let argumentToSend = {
    percentOfWord: document.getElementById("percentage-input").value,
    everyXWord: document.getElementById("every-x-word").value
  };

  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['contentScript.js']
    });
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log("sent");
      chrome.tabs.sendMessage(tabs[0].id, {command: "toggleBionic", argument: argumentToSend});
  });
});
