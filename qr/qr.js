const backHomeBTN = document.getElementById("backHomeBTN")
const productName = document.getElementById('productName')
const productDescription = document.getElementById('productDescription')
const productStatus = document.getElementById('productStatus')
const assignedTo = document.getElementById('assignedTo')
const assignSoldier = document.getElementById('assignsoldier')
const soldierId = document.getElementById('soldierId')
const qrBTNS = document.querySelector('.qrBTNS')
const tryAgainBTN = document.getElementById('tryAgainBTN')
const errorAssign = document.getElementById('errorAssign')
const setStatusBTN = document.getElementById('setStatusBTN')
const qrCamera = document.querySelector('.qr-camera')

const qrCodeScanner = new Html5Qrcode("qr-reader")

let isScanning = true
let currentProduct;

const token = localStorage.getItem("token");

if(!token){
    window.location.href = href="/login/login.html";
}

const qrCodeSuccessCallback = async (decodedText, decodedResult) => {
    try {
        stopScanning();

        const response = await fetch(`http://localhost:8080/api/stock/item?id=${encodeURIComponent(decodedText)}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('got item data successful:', data);

        currentProduct = data;

        productName.innerHTML = data.productName;
        productDescription.innerHTML = data.productType;
        productStatus.innerHTML = data.currentStatus;

        if (data.assignedTo !== undefined) {
            assignedTo.innerHTML = data?.assignedTo;
        }

        qrCamera.style.display = "none";
        qrBTNS.style.display = "flex";

        console.log(data.currentStatus);

        if (data.currentStatus === "Available") {
            assignSoldier.style.display = "block";
        }

        if (data.currentStatus === "UnderRepair") {
            setStatusBTN.innerHTML = `Set to Available`;
            setStatusBTN.setAttribute("key", "Available");
        }

        if (data.currentStatus === "Assigned" || data.currentStatus === "Available") {
            setStatusBTN.innerHTML = `Under Repair`;
            setStatusBTN.setAttribute("key", "UnderRepair");
        }

    } catch (error) {
        errorAssign.style.display = 'block';
        errorAssign.innerHTML = 'Error: ' + error.message;
        console.error('Error:', error);
    }
};


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
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function currentDate() {
    const now = new Date()

    const year = now.getFullYear()
    const month = now.getMonth() + 1 
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
    Swal.mixin({
        confirmButtonColor: 'rgb(155 197 143)', 
        cancelButtonColor: 'rgb(201 99 122)', 
    }).fire({
        title: 'Enter Personal Number',
        input: 'text', 
        inputAttributes: {
            maxlength: 10, 
            placeholder: 'Enter only digits'
        },
        confirmButtonText: 'Submit',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        preConfirm: (value) => {
            if (!/^\d+$/.test(value)) {
                Swal.showValidationMessage('Please enter digits only!');
                return false;
            }
            if (!value) {
                Swal.showValidationMessage('Please enter digits!');
                return false;
            }
            return value;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem('stockId', currentProduct.stockId)
            localStorage.setItem('soldierId', Number(result.value))
            localStorage.setItem('assignmentDate', currentDate())
        
            Swal.fire('Entered value:', result.value, 'success');
            
            window.location.href = "/2FA/twofa.html";
        }
    });
});

setStatusBTN.addEventListener("click", async function(event){
    const productStatus = event.target.getAttribute("key");
    console.log(productStatus);

    Swal.mixin({
        confirmButtonColor: 'rgb(155 197 143)', 
        cancelButtonColor: 'rgb(201 99 122)', 
    }).fire({
        title: 'Enter Personal Number',
        input: 'text', 
        inputAttributes: {
            placeholder: 'Enter only digits'
        },
        confirmButtonText: 'Submit',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        customClass: {
            confirmButton: 'custom-confirm-button',
            cancelButton: 'custom-cancel-button'
        },
        preConfirm: (value) => {
            if (!/^\d+$/.test(value)) {
                Swal.showValidationMessage('Please enter digits only!');
                return false;
            }
            return value;
        }
    }).then(async (result) => {
        let status;

        if(productStatus === "Avaiable"){
            status = 1;
        }else if(productStatus === "UnderRepair"){
            status = 3;
        }else{
            status = 2;
        }
        
        if(result.isConfirmed){
            try {
                const response = await fetch('http://localhost:8080/api/stock/status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        productStockId: Number(currentProduct.stockId),
                        newStatusId: status,
                        changedBy: Number(result.value),
                    })
                });
    
                const data = await response.json();
                console.log(data);
                if(data.success){
                    Swal.fire({
                        title: "Status Updated",
                        text: `${data.message}`,
                        icon: "success"
                    });
                }else{
                    Swal.fire({
                        title: "Something went worng",
                        text: `${data.message}`,
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Something went wrong', 'please try again later', 'error');
            }
        }

    });
});