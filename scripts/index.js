const typingTexts = ['Legally.', 'Responsibly.', 'Ethically.'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
    const element = document.getElementById('typing-text');
    if (!element) return;

    const current = typingTexts[textIndex];
    element.textContent = isDeleting ? current.substring(0, charIndex - 1) : current.substring(0, charIndex + 1);
    charIndex += isDeleting ? -1 : 1;

    if (!isDeleting && charIndex === current.length) {
        setTimeout(() => { isDeleting = true; }, 1600);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
    }

    setTimeout(typeText, isDeleting ? 45 : 90);
}

document.addEventListener('DOMContentLoaded', typeText);