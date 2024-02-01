function collectNonEmptyTextNodes(element) {
  let textElements = [];

  function recurseThroughNodes(node) {
    // Define the parent tags where text should not be modified
    const excludedTags = ["SCRIPT", "STYLE"];

    // If the node is a text node and its not empty and its parent is not excluded
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.textContent.trim() !== "" &&
      !excludedTags.includes(node.parentNode.tagName)
    ) {
      textElements.push(node);
    }
    // If the node is an element node, check all of its children nodes for text
    else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(recurseThroughNodes);
    }
  }

  // Recursively go through every element
  recurseThroughNodes(element);

  // Return the array of non-empty text nodes
  return textElements;
}

function boldEveryXWord(textNode, wordPercentage, boldXWords, boldWeight) {
  const fullText = textNode.textContent;
  const words = fullText.split(/\s+/);
  let updatedParts = [];
  let actualWordCount = 0;

  words.forEach((word, index) => {
      if (word.trim() !== '') {
          if (actualWordCount % boldXWords === 0) {
              const boldLength = Math.ceil(word.length * (wordPercentage / 100));
              const boldPart = word.substring(0, boldLength);
              const restPart = word.substring(boldLength);
              updatedParts.push(`<strong class="bionic-enhanced" style="font-weight:${boldWeight};">${boldPart}</strong>${restPart}`);
          } else {
              updatedParts.push(word);
          }
          actualWordCount++;
      }

      // Add space if it's not the last word
      if (index < words.length - 1) {
          updatedParts.push(' ');
      }
  });

  const updatedText = updatedParts.join('');
  const newContent = document.createRange().createContextualFragment(updatedText);
  if (textNode.parentNode) {
      textNode.parentNode.replaceChild(newContent, textNode);
  }
}

function enableBionicReading(wordPercentage, boldXWords, boldWeight) {
  console.log("started to enable bionic");
  // Get all non-empty text nodes in the document
  let elements = collectNonEmptyTextNodes(document.body);

  // Apply the bold transformation to each text node
  elements.forEach((el) => {
    console.log("Bolding an element");
    boldEveryXWord(el, wordPercentage, boldXWords, boldWeight);
  });
}

function removeBionicEnhancements() {
  const enhancedElements = document.querySelectorAll('.bionic-enhanced');

  enhancedElements.forEach(enhancedElement => {
      // Remove the <strong> tag but preserve the text
      const parent = enhancedElement.parentNode;
      while (enhancedElement.firstChild) {
          parent.insertBefore(enhancedElement.firstChild, enhancedElement);
      }
      parent.removeChild(enhancedElement);
  });

  document.body.normalize();
}

let isEnabled = false;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Check the command and action to toggle Bionic Reading
  if (request.command === "toggleBionic") {
      if (request.action === "enable") {
        isEnabled = true;
          // Enable Bionic Reading with the specified settings
          enableBionicReading(request.argument.percentOfWord, request.argument.everyXWord, request.argument.boldWeight);
      } else if (request.action === "disable") {
        isEnabled = false;
          // Disable Bionic Reading
          removeBionicEnhancements();
      }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.command === "updateSettings" && isEnabled) {
      // First, remove any existing Bionic enhancements
      removeBionicEnhancements();

      // Then, apply the new settings
      enableBionicReading(request.settings.percentOfWord, request.settings.everyXWord, request.settings.boldWeight);
  }
});
