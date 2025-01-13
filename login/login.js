const loginBTN = document.getElementById("loginBTN");
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

loginBTN.addEventListener("click", async function(event) {
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

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(userData.username)) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Please enter a valid email address.';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();  // מחכים לקבל את התגובה מהשרת
        console.log(data);
        if (data.success) {
            localStorage.setItem("username", userData.username);
            localStorage.setItem("token", data.token);

            successMessage.style.display = 'block';
            successMessage.innerHTML = data.message;

            setTimeout(() => {
                window.location.href = "/homepage/index.html";
            }, 2000);
        } else {
            errorMessage.style.display = 'block';
            errorMessage.innerHTML = data.error;
        }
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Error: ' + error.message;
        console.error('Error:', error);
    }
});
