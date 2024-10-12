document.addEventListener('DOMContentLoaded', () => {
  const notesList = document.getElementById('notesList');
  const copyBtn = document.getElementById('copy');
  const deleteBtn = document.getElementById('delete');
  const editBtn = document.getElementById('edit');
  const refreshBtn = document.getElementById('refresh');
  const selectAllCheckbox = document.getElementById('selectAll');

  function displayNotes() {
    chrome.storage.local.get({notes: []}, (result) => {
      const notes = result.notes;
      notesList.innerHTML = ''; // Clear existing notes
      notes.forEach((note, index) => {
        const li = document.createElement('li');
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `note-${index}`;
        li.appendChild(checkbox);
        
        // Split the note into its components
        const [selectedText, dateTimeAndUrl] = note.split('\n');
        
        // Create and append the selected text
        const textSpan = document.createElement('span');
        textSpan.textContent = selectedText;
        textSpan.className = 'note-text';
        li.appendChild(textSpan);
        
        // Create and append the date/time and URL
        const infoDiv = document.createElement('div');
        infoDiv.className = 'note-info';
        infoDiv.textContent = dateTimeAndUrl;
        li.appendChild(infoDiv);
        
        notesList.appendChild(li);
      });
    });
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }

  function getSelectedNotes() {
    const checkboxes = notesList.querySelectorAll('input[type="checkbox"]:checked');
    const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.id.split('-')[1]));
    return selectedIndices;
  }

  copyBtn.addEventListener('click', () => {
    chrome.storage.local.get({notes: []}, (result) => {
      const selectedIndices = getSelectedNotes();
      const selectedNotes = selectedIndices.map(index => result.notes[index]);
      const textToCopy = selectedNotes.join('\n\n');
      copyToClipboard(textToCopy);
    });
  });

  deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete the selected notes?')) {
      chrome.storage.local.get({notes: []}, (result) => {
        const selectedIndices = getSelectedNotes();
        const updatedNotes = result.notes.filter((_, index) => !selectedIndices.includes(index));
        chrome.storage.local.set({notes: updatedNotes}, () => {
          displayNotes();
          selectAllCheckbox.checked = false;
        });
      });
    }
  });

  editBtn.addEventListener('click', () => {
    const selectedIndices = getSelectedNotes();
    if (selectedIndices.length !== 1) {
      alert('Please select exactly one note to edit.');
      return;
    }

    chrome.storage.local.get({notes: []}, (result) => {
      const noteIndex = selectedIndices[0];
      const note = result.notes[noteIndex];
      const [selectedText, dateTimeAndUrl] = note.split('\n');

      const li = notesList.children[noteIndex];
      li.innerHTML = '';
      li.className = 'edit-mode';

      const textarea = document.createElement('textarea');
      textarea.value = selectedText;
      li.appendChild(textarea);

      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save';
      saveBtn.addEventListener('click', () => {
        const updatedNote = `${textarea.value}\n${dateTimeAndUrl}`;
        result.notes[noteIndex] = updatedNote;
        chrome.storage.local.set({notes: result.notes}, () => {
          displayNotes();
        });
      });

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', displayNotes);

      li.appendChild(saveBtn);
      li.appendChild(cancelBtn);
    });
  });

  refreshBtn.addEventListener('click', () => {
    displayNotes();
    selectAllCheckbox.checked = false;
  });

  selectAllCheckbox.addEventListener('change', (e) => {
    const checkboxes = notesList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = e.target.checked);
  });

  // Display notes when popup is opened
  displayNotes();

  // Clear the notification badge
  chrome.action.setBadgeText({text: ""});
});
