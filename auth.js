
// Check if the browser supports WebAuthn
if (window.PublicKeyCredential) {
    // Function to trigger biometric authentication
    function authenticate() {
        navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array(32), // A random challenge from the server
                rp: {
                    name: "Cash Counter Web App"
                },
                user: {
                    id: new Uint8Array(16),
                    name: "user@example.com",
                    displayName: "User"
                },
                pubKeyCredParams: [{
                    type: "public-key",
                    alg: -7 // ES256
                }],
                authenticatorSelection: {
                    authenticatorAttachment: "platform", // Use platform authenticator (e.g., Face ID, Windows Hello)
                    userVerification: "required"
                },
                timeout: 60000,
                attestation: "none"
            }
        }).then(credential => {
            if (credential) {
                // Authentication successful
                console.log("Authentication successful:", credential);
                showContent();
            }
        }).catch(err => {
            console.error("Authentication failed:", err);
            const authContainer = document.getElementById('auth-container');
            authContainer.querySelector('p').textContent = 'Biometric authentication failed. Try PIN.';
        });
    }

    // Automatically trigger authentication on page load
    document.addEventListener('DOMContentLoaded', authenticate);

} else {
    alert("This browser does not support WebAuthn for biometric authentication.");
    // Fallback for browsers that don't support WebAuthn
    showPinEntry();
}

function showContent() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
}

function showPinEntry() {
    document.getElementById('pin-container').style.display = 'flex';
    document.getElementById('try-pin-button').style.display = 'none';
    document.getElementById('auth-container').querySelector('p').textContent = 'Enter PIN to continue';
}

document.getElementById('try-pin-button').addEventListener('click', showPinEntry);

document.getElementById('pin-submit-button').addEventListener('click', () => {
    const pinInput = document.getElementById('pin-input');
    if (pinInput.value === '0405') {
        showContent();
    } else {
        alert('Incorrect PIN');
        pinInput.value = '';
    }
});
