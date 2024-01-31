function collectNonEmptyTextNodes(element) {
  let textElements = [];

  function recurseThroughNodes(node) {
    // Define the parent tags where text should not be modified
    const excludedTags = ['A', 'BUTTON', 'SCRIPT', 'STYLE'];

    // If the node is a text node and its not empty and its parent is not excluded
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "" &&
        !excludedTags.includes(node.parentNode.tagName)) {
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

  words.forEach((word, i) => {
    if (i % boldXWords === 0) {
      const boldLength = Math.ceil(word.length * (wordPercentage / 100));
      const boldPart = word.substring(0, boldLength);
      const restPart = word.substring(boldLength);
      updatedText += `<strong>${boldPart}</strong>${restPart}`;
    } else {
      updatedText += word;
    }
    updatedText += ' ';
  });

  // Replace the original text node with new content
  const newContent = document.createRange().createContextualFragment(updatedText);
  if (textNode.parentNode) {
    textNode.parentNode.replaceChild(newContent, textNode);
  }
}

function enableBionicReading(wordPercentage, boldXWords) {
  // Get all non-empty text nodes in the document
  let elements = collectNonEmptyTextNodes(document.body);

  // Apply the bold transformation to each text node
  elements.forEach(el => {
    boldEveryXWord(el, wordPercentage, boldXWords);
  });
}

// Call this function to apply Bionic Reading to all text in the document
enableBionicReading(30, 2);
