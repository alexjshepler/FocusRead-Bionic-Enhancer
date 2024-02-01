let isEnabled = false;

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

function boldEveryXWord(textNode, wordPercentage, boldXWords) {
  const fullText = textNode.textContent;
  const words = fullText.split(/\s+/);
  let updatedText = '';
  let actualWordCount = 0; // Counter for words excluding spaces

  words.forEach((word, index) => {
      // Check if the current word should be partially bold
      if ((actualWordCount + 1) % boldXWords === 0) {
          const boldLength = Math.ceil(word.length * (wordPercentage / 100));
          const boldPart = word.substring(0, boldLength);
          const restPart = word.substring(boldLength);
          // Include a unique class name for the bionic-enhanced part
          updatedText += `<strong class="bionic-enhanced">${boldPart}</strong>${restPart} `;
      } else {
          updatedText += word;
      }
      
      // Only add a space if it's not the last word
      // and ensure spaces are maintained as in original text
      if (index < words.length - 1) {
          const nextSpace = fullText.indexOf(' ', updatedText.length - fullText.length);
          if (nextSpace >= 0) {
              updatedText += ' ';
          }
      }

      // Increment the actual word count if the word is not an empty string
      if (word.trim() !== '') actualWordCount++;
  });

  // Replace the original text node with new content
  const newContent = document.createRange().createContextualFragment(updatedText.trim());
  if (textNode.parentNode) {
      textNode.parentNode.replaceChild(newContent, textNode);
  }
}

function enableBionicReading(wordPercentage, boldXWords) {
  console.log("started to enable bionic");
  // Get all non-empty text nodes in the document
  let elements = collectNonEmptyTextNodes(document.body);

  // Apply the bold transformation to each text node
  elements.forEach((el) => {
    console.log("Bolding an element");
    boldEveryXWord(el, wordPercentage, boldXWords);
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command == "toggleBionic") {
    if (!isEnabled) {
      isEnabled = true;
      console.log(
        "Received with elements " +
          request.argument.percentOfWord +
          " and " +
          request.argument.everyXWord
      );
      enableBionicReading(
        request.argument.percentOfWord,
        request.argument.everyXWord
      );
    } else {
      removeBionicEnhancements();
      isEnabled = false;
    }
  }
});
