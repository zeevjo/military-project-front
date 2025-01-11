
(function () {
  emailjs.init("t73-CEmjPINBtcZxm")
})()


function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

document.querySelector(".getcode-btn").addEventListener("click", function () {
  const recipientEmail = "smdg_972@outlook.com"
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignData)
      })
        .then(response => response.json())
        .then(data => {
          console.log('Assign successful:', data)
          window.location.href = "../qr/qr.html"

        })
        .catch(error => {
          console.error('Error:', error)
        })

      // document.getElementById("otp-input").value()
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


