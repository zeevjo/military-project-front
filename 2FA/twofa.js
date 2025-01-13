
(function () {
  emailjs.init("t73-CEmjPINBtcZxm")
})()


const token = localStorage.getItem("token")

if (!token) {
  window.location.href = href = "/login/login.html"
}

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

document.querySelector(".getcode-btn").addEventListener("click", function () {
  const recipientEmail = localStorage.getItem('username')
  if (!recipientEmail) {
    alert("No email found. Please log in first.")
    window.location.href = "../login/login.html"
    return
  }
  let generatedOTP = generateOTP()
  console.log(`Generated OTP: ${generatedOTP}`)


  function sendOTPEmail(email, otp) {
    const templateParams = {
      to_email: email,
      otp_code: otp,
    }



    emailjs
      .send("service_fy4nys9", "template_zmkuiff", templateParams)
      .then(
        function (response) {
          console.log("Email sent:", response)

        },
        function (error) {
          console.error("Error:", error)
        }
      )
  }


  sendOTPEmail(recipientEmail, generatedOTP)


  document.getElementById("otp-form").addEventListener("submit", function (event) {
    event.preventDefault()
    const enteredOTP = document.getElementById("otp-input").value

    if (enteredOTP === generatedOTP) {

      const assignData = {
        stockId: Number(localStorage.getItem("stockId")),
        soldierId: Number(localStorage.getItem("soldierId")),
        assignmentDate: localStorage.getItem("assignmentDate"),
      }

      fetch("http://localhost:8080/api/assign", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(assignData)
      })
        .then(response => response.json())
        .then(data => {
          console.log('Assignment successful:', data)
          window.location.href = "../qr/qr.html"

        })
        .catch(error => {
          console.error('Error:', error)
        })
    } else {
      alert("Incorrect code. Please try again.")
    }
  })

  document.getElementById("resend-code").addEventListener("click", function () {
    generatedOTP = generateOTP()
    console.log(`New Generated OTP: ${generatedOTP}`)
    sendOTPEmail(recipientEmail, generatedOTP)
  })
})


