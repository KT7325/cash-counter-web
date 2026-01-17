
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
    try {
        if (!window.PublicKeyCredential) {
            alert("Face ID / Biometrics not supported on this device.");
            return;
        }
        
        // Check if platform authenticator is available
        if (window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
             const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
             if (!available) {
                 alert("Face ID / Biometrics not available on this device.");
                 return;
             }
        }

        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const publicKeyCredentialCreationOptions = {
            challenge: challenge,
            rp: {
                name: "Cash Counter Web App",
            },
            user: {
                id: new Uint8Array(16), // Random ID to force prompt
                name: "user@example.com",
                displayName: "User",
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
            authenticatorSelection: {
                authenticatorAttachment: "platform",
                userVerification: "required",
                residentKey: "discouraged", // Hint to not save the key if possible
                requireResidentKey: false
            },
            timeout: 60000,
            attestation: "none"
        };

        await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });
        showContent();

    } catch (err) {
        console.error("Face ID verification failed:", err);
        // Don't alert on cancellation to avoid annoyance
        if (err.name !== 'NotAllowedError') {
             alert("Face ID verification failed.");
        }
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
