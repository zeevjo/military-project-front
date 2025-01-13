const rowsPerPage = 15
let currentPage = 1

const token = localStorage.getItem("token")

if (!token) {
    window.location.href = href = "/login/login.html"
}

function addRowClickEvent() {
    const rows = document.querySelectorAll("#inventoryTable tbody tr")
    rows.forEach(row => {
        row.addEventListener("click", () => {
            const productName = row.querySelector("td").textContent.trim()
            showProductDetails(productName)
        })
    })
}

async function showProductDetails(productName) {
    try {
        const token = localStorage.getItem("token")

        if (!token) {
            window.location.href = "/login/login.html"
            return
        }

        const res = await fetch(`http://localhost:8080/api/stock/item/table?productName=${encodeURIComponent(productName)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`)
        }

        const productDetails = await res.json()

        const tableHead = document.querySelector("#inventoryTable thead")
        tableHead.innerHTML = `
            <tr>
                <th>Product Name</th>
                <th>Current Status</th>
                <th>Last Modified</th>
                <th>Modified By Soldier</th>
            </tr>
        `

        const tableBody = document.querySelector("#inventoryTable tbody")
        tableBody.innerHTML = ""

        if (productDetails.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4">No data available</td></tr>`
            return
        }

        productDetails.forEach(item => {
            const row = document.createElement("tr")
            row.innerHTML = `
                <td>${item.productName}</td>
                <td>${item.currentStatus}</td>
                <td>${item.lastModified}</td>
                <td>${item.modifiedBySoldier}</td>
            `
            tableBody.appendChild(row)
        })

        const backButton = document.createElement("button")
        backButton.textContent = "Back"
        backButton.id = "backButton"
        backButton.classList.add("btn", "btn-primary")

        backButton.insertAdjacentHTML('afterbegin', '<i class="fa-solid fa-arrow-left"></i> ')

        document.querySelector("#inventoryTable").insertAdjacentElement("beforebegin", backButton)

        backButton.addEventListener("click", () => {
            document.querySelector("#inventoryTable thead").innerHTML = `
                <tr>
                    <th>Product Name</th>
                    <th>Total in Stock</th>
                    <th>Total Available</th>
                    <th>Total Under Maintenance</th>
                    <th>Total Assigned</th>
                </tr>
            `
            applySearchAndFilters()
            backButton.remove()
        })

    } catch (error) {
        console.error("Failed to fetch product details:", error)
        const tableBody = document.querySelector("#inventoryTable tbody")
        tableBody.innerHTML = `<tr><td colspan="4">Error fetching product details</td></tr>`
    }
}

async function applySearchAndFilters() {
    const token = localStorage.getItem("token")

    console.log('token', token)
    if (!token) {
        window.location.href = "/login/login.html"
        return
    }

    const searchInput = document.getElementById("searchInput").value.toLowerCase()
    const stockFilter = document.getElementById("stockFilter").value

    try {
        const res = await fetch('http://localhost:8080/api/stock', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`)
        }

        const jsonData = await res.json()

        let filteredData = jsonData.filter(item => {
            const isMatchingName = item.productName.toLowerCase().includes(searchInput)

            if (!stockFilter) {
                return isMatchingName
            }

            return isMatchingName && item[stockFilter] > 0
        })

        if (stockFilter && stockFilter !== "") {
            filteredData.sort((a, b) => b[stockFilter] - a[stockFilter])
        }

        const start = (currentPage - 1) * rowsPerPage
        const end = start + rowsPerPage
        populateTable(filteredData.slice(start, end))
        updatePagination(filteredData)
    } catch (error) {
        console.error("Failed to fetch or process data:", error)
        populateTable([])
        document.querySelector("#pagination").innerHTML = ""
    }
}

function resetFilters() {
    document.getElementById("searchInput").value = ''
    document.getElementById("stockFilter").value = ''
    currentPage = 1
    applySearchAndFilters()
}

function populateTable(data) {
    const tableBody = document.querySelector("#inventoryTable tbody")
    tableBody.innerHTML = ""

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">No data available</td></tr>`
        return
    }

    data.forEach(item => {
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${item.productName}</td>
            <td>${item.totalInStock}</td>
            <td>${item.totalAvailable}</td>
            <td>${item.totalUnderMaintenance}</td>
            <td>${item.totalAssigned}</td>
        `
        tableBody.appendChild(row)
    })

    addRowClickEvent()
}

function updatePagination(filteredData) {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage)
    const paginationContainer = document.querySelector("#pagination")

    paginationContainer.innerHTML = ""

    paginationContainer.insertAdjacentHTML(
        "beforeend",
        `<button id="prevButton" class="page-button ${currentPage === 1 ? "disabled" : ""}" onclick="changePage('prev')">Previous</button>`
    )

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.insertAdjacentHTML(
            "beforeend",
            `<button class="page-button ${i === currentPage ? "active" : ""}" onclick="goToPage(${i})">${i}</button>`
        )
    }

    paginationContainer.insertAdjacentHTML(
        "beforeend",
        `<button id="nextButton" class="page-button ${currentPage === totalPages ? "disabled" : ""}" onclick="changePage('next')">Next</button>`
    )
}

function changePage(direction) {
    if (direction === "next" && currentPage * rowsPerPage < jsonData.length) {
        currentPage++
    } else if (direction === "prev" && currentPage > 1) {
        currentPage--
    }

    applySearchAndFilters()
}

function goToPage(page) {
    currentPage = page
    applySearchAndFilters()
}

function exportTableToCSV() {
    const table = document.getElementById("inventoryTable")
    const rows = table.querySelectorAll("tr")

    let csvContent = "Product Name,Total in Stock,Total Available,Total Under Maintenance,Total Assigned\n"

    rows.forEach((row, index) => {
        const cols = row.querySelectorAll("td, th")
        const rowArray = []
        cols.forEach(col => {
            rowArray.push(col.textContent.trim())
        })

        if (rowArray.length > 0) {
            csvContent += rowArray.join(",") + "\n"
        }
    })

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "warehouse_stock.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token")

    if (!token) {
        window.location.href = href = "/login/login.html"
        return
    }

    console.log("Token validated successfully.")
    applySearchAndFilters()
});

