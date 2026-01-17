
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

async function verifyFaceId() {
    // WebAuthn requires a secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
        alert("Face ID requires a secure context (HTTPS or localhost). It will not work on file://.");
        return;
    }

    if (!window.PublicKeyCredential) {
        alert("Face ID / Biometrics not supported on this device/browser.");
        return;
    }

    try {
        // Check availability
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (!available) {
            alert("Face ID / Touch ID is not set up or available on this device.");
            return;
        }

        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const publicKeyCredentialCreationOptions = {
            challenge: challenge,
            rp: {
                name: "Cash Counter App",
                // id: window.location.hostname // Optional, defaults to current domain
            },
            user: {
                id: new Uint8Array(16),
                name: "user@cashcounter.local",
                displayName: "App User",
            },
            pubKeyCredParams: [
                { alg: -7, type: "public-key" }, // ES256
                { alg: -257, type: "public-key" } // RS256
            ],
            authenticatorSelection: {
                authenticatorAttachment: "platform", // Forces FaceID/TouchID
                userVerification: "required",
                residentKey: "discouraged", // Try to avoid saving a passkey if possible
                requireResidentKey: false
            },
            timeout: 60000,
            attestation: "none"
        };

        // This triggers the biometric prompt
        await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });
        
        // If successful
        showContent();

    } catch (err) {
        console.error("Face ID verification failed:", err);
        // Alert the user so they know why it failed
        alert("Authentication failed: " + err.message);
    }
}

function handleAuthentication() {
    if (sessionStorage.getItem('isAuthenticated')) {
        showContent();
        return;
    }
    showPinEntry();
}

document.addEventListener('DOMContentLoaded', () => {
    handleAuthentication();
    
    const faceIdBtn = document.getElementById('face-id-btn');
    if (faceIdBtn) {
        faceIdBtn.addEventListener('click', verifyFaceId);
    }
});

document.getElementById('pin-input').addEventListener('input', (event) => {
    if (event.target.value.length === 4) {
        verifyPin();
    }
});
