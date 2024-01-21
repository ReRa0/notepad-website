const memoTextarea = document.getElementById('memo');
const cursorInfo = document.getElementById('cursor-info');
const fileInput = document.createElement('input');
fileInput.type = 'file';

// Function to load text file content into textarea
function loadFileContent(file) {
    const reader = new FileReader();
    
    reader.onload = function (e) {
        memoTextarea.value = e.target.result;
        updateCursorPosition();
    };

    reader.readAsText(file);
}

// Function to save textarea content as a text file
function saveToFile() {
    const content = memoTextarea.value;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'memo.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Event listener for file input change
fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        loadFileContent(file);
    }
});

// Event listener for file button click
document.getElementById('file').addEventListener('click', function () {
    fileInput.click();
});

// Event listener for save button click
document.getElementById('save').addEventListener('click', function () {
    saveToFile();
});

document.getElementById('paste').addEventListener('click', function () {
    navigator.clipboard.readText().then((text) => {
        memoTextarea.focus();
        document.execCommand('insertText', false, text);
        updateCursorPosition();
    });
});

// Event listener for undo button click
document.getElementById('undo').addEventListener('click', function () {
    document.execCommand('undo');
    updateCursorPosition();
});

// Event listener for redo button click
document.getElementById('redo').addEventListener('click', function () {
    document.execCommand('redo');
    updateCursorPosition();
});

// Update cursor position on input
memoTextarea.addEventListener('input', function () {
    updateCursorPosition();
});

function updateCursorPosition() {
    const cursorPosition = getCaretPosition(memoTextarea);
    const lineColumn = getLineColumn(memoTextarea, cursorPosition);
    const characters = memoTextarea.value.length;
    const words = memoTextarea.value.split(/\s+/).filter(word => word !== '').length;

    cursorInfo.textContent = `Line ${lineColumn.line}, Column ${lineColumn.column}, Chars ${characters}, Words ${words}`;
}

function getCaretPosition(element) {
    return {
        start: element.selectionStart,
        end: element.selectionEnd
    };
}

function getLineColumn(element, cursorPosition) {
    const value = element.value;
    const upToCursorPosition = value.substring(0, cursorPosition.start);
    const lines = upToCursorPosition.split('\n');

    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    return { line, column };
}



const eyesContainer = document.getElementById('eyes');
const leftEye = document.getElementById('left-pupil');
const rightEye = document.getElementById('right-pupil');

document.addEventListener('mousemove', (event) => {
    const { clientX: mouseX, clientY: mouseY } = event;
    moveEyes(mouseX, mouseY);
});

memoTextarea.addEventListener('input', () => {
    const cursorPosition = getCaretPosition(memoTextarea);
    const lineColumn = getLineColumn(memoTextarea, cursorPosition.start);
    const mouseX = window.innerWidth * (lineColumn.column / -1 /* / memoTextarea.scrollWidth*/);
    const mouseY = window.innerHeight * (lineColumn.line / 10 /* / memoTextarea.scrollHeight*/);
    moveEyes(mouseX, mouseY);
});

function moveEyes(mouseX, mouseY) {
    const eyesX = eyesContainer.getBoundingClientRect().left + eyesContainer.offsetWidth / 2;
    const eyesY = eyesContainer.getBoundingClientRect().top + eyesContainer.offsetHeight / 2;

    const deltaX = mouseX - eyesX;
    const deltaY = mouseY - eyesY;

    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(eyesContainer.offsetWidth / 4, eyesContainer.offsetHeight / 4);

    const eyeX = Math.cos(angle) * distance;
    const eyeY = Math.sin(angle) * distance;

    leftEye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
    rightEye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
}

