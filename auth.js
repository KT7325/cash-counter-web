
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function showContent() {
    sessionStorage.setItem('isAuthenticated', 'true');
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
}

function showPinEntry() {
    document.getElementById('pin-container').style.display = 'flex';
    document.getElementById('try-pin-button').style.display = 'none';
    document.getElementById('auth-container').querySelector('p').textContent = 'Verify your Identity';
    document.getElementById('pin-input').focus();
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

    if (isMobileDevice()) {
        // Mobile: Try biometrics first
        if (window.PublicKeyCredential) {
            navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32),
                    rp: { name: "Cash Counter Web App" },
                    user: {
                        id: new Uint8Array(16),
                        name: "user@example.com",
                        displayName: "User"
                    },
                    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                        userVerification: "required"
                    },
                    timeout: 60000,
                    attestation: "none"
                }
            }).then(credential => {
                if (credential) {
                    console.log("Authentication successful:", credential);
                    showContent();
                }
            }).catch(err => {
                console.error("Authentication failed:", err);
                document.getElementById('auth-container').querySelector('p').textContent = 'Biometric authentication failed. Try PIN.';
            });
        } else {
            // No WebAuthn support on mobile, go to PIN
            showPinEntry();
        }
    } else {
        // Desktop: Go straight to PIN
        showPinEntry();
    }
}

document.addEventListener('DOMContentLoaded', handleAuthentication);

document.getElementById('try-pin-button').addEventListener('click', showPinEntry);

document.getElementById('pin-input').addEventListener('input', (event) => {
    if (event.target.value.length === 4) {
        verifyPin();
    }
});
