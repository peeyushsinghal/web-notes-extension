chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "takeNote",
    title: "Include selected text in Web Notes",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "takeNote") {
    const selectedText = info.selectionText;
    // Limit the text to a maximum of 150 characters
    const truncatedText = selectedText.length > 150 ? selectedText.substring(0, 150) : selectedText;
    const currentDate = new Date().toLocaleString();
    const noteText = `${truncatedText}\n${currentDate} | ${tab.url}`;
    
    chrome.storage.local.get({notes: []}, (result) => {
      let notes = result.notes;
      notes.unshift(noteText); // Add new note to the beginning
      if (notes.length > 50) {
        notes.pop(); // Remove the oldest note if we exceed 50
      }
      chrome.storage.local.set({notes: notes}, () => {
        console.log("Note saved");
        chrome.action.setBadgeText({text: "New"});
        chrome.action.setBadgeBackgroundColor({color: "#4688F1"});
      });
    });
  }
});
