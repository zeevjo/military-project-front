const backHomeBTN = document.getElementById("backHomeBTN")
const readerResults = document.getElementById('qr-reader-results')
const productName = document.getElementById('productName')
const productDescription = document.getElementById('productDescription')
const productStatus = document.getElementById('productStatus')
const assignedTo = document.getElementById('assignedTo')
const assignSoldier = document.getElementById('assignsoldier')
const soldierId = document.getElementById('soldierId')
const assigningDiv = document.getElementById('assigningDiv')
const qrBTNS = document.querySelector('.qrBTNS')
const tryAgainBTN = document.getElementById('tryAgainBTN')
const errorAssign = document.getElementById('errorAssign')
const setStatusBTN = document.getElementById('setStatusBTN')
const qrCamera = document.querySelector('.qr-camera')

const qrCodeScanner = new Html5Qrcode("qr-reader")

let isScanning = true
let isAssgined = true
let currentProduct;

const token = localStorage.getItem("token");

if(!token){
    // window.location.href = href="/login/login.html";
}

const qrCodeSuccessCallback = (decodedText, decodedResult) => {

    readerResults.innerText = `הקוד שסרקת: ${decodedText}`
    stopScanning()

    fetch(`http://localhost:8080/api/stock/item?id=${encodeURIComponent(decodedText)}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        Authorization: `Bearer ${token}`
    })
        .then(response => response.json())
        .then(data => {
            console.log('got item data successful:', data)
            currentProduct = data;
            productName.innerHTML = data.productName
            productDescription.innerHTML = data.productType
            productStatus.innerHTML = data.currentStatus
            if (data.assignedTo != undefined) {
                assignedTo.innerHTML = data?.assignedTo
            }
            qrCamera.style.display = "none"
            qrBTNS.style.display = "flex"
            console.log(data.currentStatus);
            
            if (data.currentStatus === "Available") {
                isAssgined = false
                if (isAssgined === false) {
                    assigningDiv.style.display = "flex"

                }
            }

            if (data.currentStatus === "UnderRepair") {
                setStatusBTN.innerHTML = `Set to Available`;
                setStatusBTN.setAttribute("key", "Available");
            }
            
            if (data.currentStatus === "Assigned" || data.currentStatus === "Available") {
                setStatusBTN.innerHTML = `Mark as Under Repair`
                setStatusBTN.setAttribute("key", "UnderRepair");
            }
            

        })
        .catch(error => {
            errorAssign.style.display = 'block'
            errorAssign.innerHTML = 'Error: ' + error.message
            console.error('Error:', error)
        })
}

qrCodeScanner.start(
    { facingMode: "environment" },
    {
        fps: 10,
        qrbox: 150
    },
    qrCodeSuccessCallback,
    (errorAssign) => {

    }
).catch(err => {
    console.log("הייתה בעיה בהפעלת הסורק: " + err)
})

function stopScanning() {
    if (isScanning) {
        qrCodeScanner.stop()
        isScanning = false
    }

}

function currentDate() {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0') // Ensure two digits
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function currentDate() {
    const now = new Date()

    const year = now.getFullYear()
    const month = now.getMonth() + 1 // Months are zero-indexed
    const day = now.getDate()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()

    const formattedDate = [
        year,
        month < 10 ? '0' + month : month,
        day < 10 ? '0' + day : day
    ].join('-') + ' ' + [
        hours < 10 ? '0' + hours : hours,
        minutes < 10 ? '0' + minutes : minutes,
        seconds < 10 ? '0' + seconds : seconds
    ].join(':')

    return formattedDate
}

tryAgainBTN.addEventListener('click', function () {
    if (isScanning) {
        console.log("Scanner is already running. Cannot start again.")
        return
    }

    readerResults.innerText = ''
    productName.innerText = ''
    productDescription.innerText = ''
    productStatus.innerText = ''
    assignedTo.innerText = ''
    errorAssign.innerHTML = ''
    qrCamera.style.display = "block"
    qrBTNS.style.display = "none"

    isScanning = true

    qrCodeScanner
        .start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: 150
            },
            qrCodeSuccessCallback,
            (errorAssign) => {
            }
        )
        .catch(err => {
            console.error("Error restarting scanner: " + err)
        })
})

function stopScanning() {
    if (isScanning) {
        qrCodeScanner.stop()
            .then(() => {
                console.log("Scanner stopped successfully.")
                isScanning = false
            })
            .catch(err => {
                console.error("Error stopping scanner: " + err)
            })
    }
}

assignSoldier.addEventListener('click', function () {
    const regex = /^\d+$/
    errorAssign.innerHTML = ""
    if (!regex.test(soldierId.value)) {
        errorAssign.innerHTML = "Only digits please"
        return
    }

    // const assigneData = {
    //     stockId: stockId,
    //     soldierId: Number(soldierId.value),
    //     assignmentDate: currentDate()
    // }

    localStorage.setItem('stockId', currentProduct.stockId)
    localStorage.setItem('soldierId', Number(soldierId.value))
    localStorage.setItem('assignmentDate', currentDate())

    window.location.href = "/2FA/twofa.html"

});

setStatusBTN.addEventListener("click", async function(event){
    const productStatus = event.target.getAttribute("key");

    try {
        const response = await fetch('http://localhost:8080/api/TEST', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            Authorization: `Bearer ${token}`,
            body: JSON.stringify({
                stockId: currentProduct.stockId,
                status: productStatus,
                currentDate: currentDate()
            })
        });
        const data = await response.json();

    } catch (error) {
        console.error('Error:', error);
    }
});