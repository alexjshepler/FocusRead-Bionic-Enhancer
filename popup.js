document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("percentage-slider");
  const sliderValue = document.getElementById("percentage-value");
  const wordCount = document.getElementById("word-count");
  const toggleButton = document.getElementById("toggle-bionic");
  const boldWeightSlider = document.getElementById("bold-weight-slider");
  const boldWeightValue = document.getElementById("bold-weight-value");

  boldWeightSlider.oninput = function () {
    boldWeightValue.textContent = this.value;
  };

  slider.oninput = function () {
    sliderValue.textContent = this.value + "%";
  };

  toggleButton.onclick = function () {
    const isEnabled = toggleButton.textContent.includes("Enable");

    chrome.action.onClicked.addListener((tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contentScript.js"],
      });
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (isEnabled) {
        console.log("Enabling Bionic Reading Mode");
        // Send message to content script to enable Bionic Reading

        chrome.tabs.sendMessage(tabs[0].id, {
          command: "toggleBionic",
          action: "enable",
          argument: {
            percentOfWord: slider.value,
            everyXWord: wordCount.value,
                boldWeight: boldWeightSlider.value
          },
        });
        toggleButton.textContent = "Disable Bionic Reading";
      } else {
        console.log("Disabling Bionic Reading Mode");
        // Send message to content script to disable Bionic Reading
        chrome.tabs.sendMessage(tabs[0].id, {
          command: "toggleBionic",
          action: "disable",
        });
        toggleButton.textContent = "Enable Bionic Reading";
      }
    });
  };
});

function sendSettingsToContentScript() {
  const wordPercentage = document.getElementById('percentage-slider').value;
  const boldXWords = document.getElementById('word-count').value;
  const boldWeight = document.getElementById('bold-weight-slider').value;

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
          command: "updateSettings",
          settings: {
              percentOfWord: wordPercentage,
              everyXWord: boldXWords,
              boldWeight: boldWeight
          }
      });
  });
}


document.getElementById('percentage-slider').addEventListener('change', sendSettingsToContentScript);
document.getElementById('word-count').addEventListener('change', sendSettingsToContentScript);
document.getElementById('bold-weight-slider').addEventListener('change', sendSettingsToContentScript);