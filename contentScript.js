document.getElementById("toggle").addEventListener("click", () => {
  const wordPercentage = document.getElementById("wordPercentage").value;
  const boldXWords = document.getElementById("boldXWords").value;

  enableBionicReading(wordPercentage, boldXWords);
});

// Returns an array of all of the non-empty text nodes
function collectNonEmptyTextNodes(element) {
  let textElements = [];

  function recurseThroughNodes(node) {
    // If the node is a text node and its not empty push it onto the textElements array
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
      textElements.push(node);
    }
    // If the node is an element node, check all of its children nodes for text
    else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(recurseThroughNodes);
    }
  }

  // Recursively go through every element
  recurseThroughNodes(element);

  // Return the array of non empty elements
  return textElements;
}

function boldEveryXWord(textNode, wordPercentage, boldXWords) {
  const fullText = textNode.textContent;
  const words = fullText.split(/\s+/);

  if (words.length > 0) {
    for (let i = 0; i < words.length; i++) {
      if (i % boldXWords === 0) {
        const word = words[i];
        const boldLength = Math.ceil(word.length * (wordPercentage / 100));
        const boldPart = word.substring(0, boldLength);
        const restPart = word.substring(boldLength);

        // Reconstruct the word with the bold part
        words[i] = `<strong>${boldPart}</strong>${restPart}`;
      }
    }

    // Create a new HTML element and replace the text node
    const newHtml = document.createElement("span");
    newHtml.innerHTML = words.join(" ");

    if (textNode.parentNode) {
      textNode.parentNode.replaceChild(newHtml, textNode);
    }
  }
}

function enableBionicReading(wordPercentage, boldXWords) {
  let elements = collectNonEmptyTextNodes(document.body);

  elements.forEach((el) => {
    boldEveryXWord(el, wordPercentage, boldXWords);
  });
}
