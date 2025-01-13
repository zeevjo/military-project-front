const apiOutput = document.getElementById('api-output');
const copyBtn = document.getElementById('copyBtn');
const toggleView = document.getElementById('toggleView');

// Toggle visibility of the copy button based on input value
apiOutput.addEventListener('input', () => {
    if (apiOutput.value.trim() !== '') {
        copyBtn.style.display = 'block';
    } else {
        copyBtn.style.display = 'none';
    }
});

document.getElementById('copyBtn').addEventListener('click', function () {
    const copyText = document.getElementById('api-output');

    if (copyText.value.trim() !== "") {
        // Create a temporary textarea element
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = copyText.value;

        // Append the textarea to the body (invisible to the user)
        document.body.appendChild(tempTextArea);

        // Select and copy the text
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); // For mobile devices

        try {
            document.execCommand('copy');
            
            // Change icon to checkmark to indicate success
            const copyBtn = document.getElementById('copyBtn');
            copyBtn.classList.remove('fa-clipboard');
            copyBtn.classList.add('fa-check');
            copyBtn.classList.add('copied');
            alertify.success('Copied!');

            // Optionally, reset the icon back after a short delay
            setTimeout(function () {
                copyBtn.classList.remove('fa-check');
                copyBtn.classList.remove('copied');
                copyBtn.classList.add('fa-clipboard');
            }, 2000); // 2 seconds delay
        } catch (err) {
            alert('Failed to copy API key.');
        }

        // Remove the temporary textarea
        document.body.removeChild(tempTextArea);
    } else {
        alert('Nothing to copy!');
    }
});

// Toggle password visibility
toggleView.addEventListener('click', () => {
    const isPassword = apiOutput.type === 'password';
    apiOutput.type = isPassword ? 'text' : 'password';
    toggleView.classList.toggle('fa-eye-slash', isPassword);
    toggleView.classList.toggle('fa-eye', !isPassword);
});
