
function showContent() {
    sessionStorage.setItem('isAuthenticated', 'true');
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
}

function showPinEntry() {
    const pinContainer = document.getElementById('pin-container');
    const pinInput = document.getElementById('pin-input');
    const authContainer = document.getElementById('auth-container');

    pinContainer.style.display = 'flex';
    if (document.getElementById('try-pin-button')) {
        document.getElementById('try-pin-button').style.display = 'none';
    }
    authContainer.querySelector('p').textContent = 'Verify your Identity';

    // Use requestAnimationFrame to ensure the element is visible before focusing
    requestAnimationFrame(() => {
        pinInput.focus();
    });
}

function verifyPin() {
    const pinInput = document.getElementById('pin-input');
    if (pinInput.value === '0405') {
        showContent();
    } else {
        alert('Incorrect PIN');
        pinInput.value = '';
        pinInput.focus();
    }
}

function handleAuthentication() {
    if (sessionStorage.getItem('isAuthenticated')) {
        showContent();
        return;
    }
    showPinEntry();
}

document.addEventListener('DOMContentLoaded', handleAuthentication);

document.getElementById('pin-input').addEventListener('input', (event) => {
    if (event.target.value.length === 4) {
        verifyPin();
    }
});
