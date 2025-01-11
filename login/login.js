const loginBTN = document.getElementById("loginBTN");
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginBTN.addEventListener("click", function(event) {
    event.preventDefault();  
    
    errorMessage.style.display = 'none';
    errorMessage.innerHTML = '';
    
    const formData = new FormData(loginForm);
    const userData = {};
    
    formData.forEach((value, key) => {
        userData[key] = value;
    });

    if (!userData.username || !userData.password) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Both username and password are required.';
        return;  
    }

    // const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // if (!emailPattern.test(userData.username)) {
    //     errorMessage.style.display = 'block';
    //     errorMessage.innerHTML = 'Please enter a valid email address.';
    //     return;
    // }

    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)  
    })
    .then(response => response.json())
    .then(data => {
        console.log('Login successful:', data);
        window.location.href = "/homepage/index.html"
    })
    .catch(error => {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Error: ' + error.message;
        console.error('Error:', error);
    });
});
