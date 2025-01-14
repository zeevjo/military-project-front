let historyData
let currentPage = 1
const rowsPerPage = 15
let token

function verifyToken() {
    token = localStorage.getItem("token")

    if (!token) {
        window.location.href = "/login/login.html"
    }
}

document.addEventListener('DOMContentLoaded', function () {
    verifyToken()
})

document.addEventListener('click', function () {
    verifyToken()
})

async function getHistory() {
    try {
        const res = await fetch('http://localhost:8080/api/history', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`)
        }

        historyData = await res.json()
        console.log(historyData)
        populateTable(historyData)
    } catch (error) {
        console.error("Failed to fetch or process data:", error)
        populateTable([])
        document.querySelector("#pagination").innerHTML = ""
    }
}

function populateTable(data) {
    console.log(data)
    const tableBody = document.querySelector("#inventoryTable tbody")
    tableBody.innerHTML = ""

    const startIndex = (currentPage - 1) * rowsPerPage
    const paginatedData = data.slice(startIndex, startIndex + rowsPerPage)

    paginatedData.forEach(item => {
        const row = document.createElement("tr")

        let statusColor = ''
        const status = item.currentStatus.toLowerCase()

        if (status === "available") {
            statusColor = '#609966'
        } else if (status === "assigned") {
            statusColor = '#F4CE14'
        } else if (status === "underrepair") {
            statusColor = '#E84545'
        }

        row.innerHTML = `
            <td>${item.productName}</td>
            <td style="color:${statusColor};">${item.currentStatus}</td>

            <td>${item.soldierId === undefined ? "" : item.soldierId}</td>
            <td>${item.soldierName === undefined ? "" : item.soldierName}</td>

            <td>${item.modificationDate}</td>
        `
        tableBody.appendChild(row)
    })

    updatePaginationButtons(data.length)
}

function applySearchAndFilters() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const historyFilterValue = document.getElementById("historyFilter").value.toLowerCase();

    const filteredData = historyData.filter(item => {
        const matchesSearch = item.productName.toLowerCase().includes(searchValue);
        
        // Debugging logs
        console.log(matchesSearch);
        console.log(historyFilterValue);
        
        let matchesStatus = true;

        // Ensure you're comparing with the correct property
        if (historyFilterValue === "available") {
            matchesStatus = item.currentStatus.toLowerCase() === "available";
        } else if (historyFilterValue === "undermaintenance") {
            matchesStatus = item.currentStatus.toLowerCase() === "underrepair";
        } else if (historyFilterValue === "assigned") {
            matchesStatus = item.currentStatus.toLowerCase() === "assigned";
        }

        return matchesSearch && matchesStatus;
    });

    console.log(filteredData)
    currentPage = 1;
    populateTable(filteredData);
}


function applySort() {
    const sortValue = document.getElementById("sortSelect").value

    let sortedData = [...historyData]

    switch (sortValue) {
        case "productType":
            sortedData.sort((a, b) => a.productName.localeCompare(b.productName))
            break
        case "status":
            sortedData.sort((a, b) => a.currentStatus.localeCompare(b.currentStatus))
            break
        case "soldierId":
            sortedData.sort((a, b) => a.soldierId - b.soldierId)
            break
        case "soldierFullName":
            sortedData.sort((a, b) => a.soldierName.localeCompare(b.soldierName))
            break
        case "date":
            sortedData.sort((a, b) => new Date(b.modificationDate) - new Date(a.modificationDate))
            break
        default:
            break
    }

    currentPage = 1
    populateTable(sortedData)
}

function changePage(direction) {
    const filteredData = historyData.filter(item => {
        const searchValue = document.getElementById("searchInput").value.toLowerCase()
        const historyFilterValue = document.getElementById("historyFilter").value.toLowerCase()

        const matchesSearch = item.productName.toLowerCase().includes(searchValue)

        let matchesStatus = true
        if (historyFilterValue === "instock") {
            matchesStatus = item.status.toLowerCase() === "in stock"
        } else if (historyFilterValue === "available") {
            matchesStatus = item.status.toLowerCase() === "available"
        } else if (historyFilterValue === "undermaintenance") {
            matchesStatus = item.status.toLowerCase() === "under maintenance"
        } else if (historyFilterValue === "assigned") {
            matchesStatus = item.status.toLowerCase() === "assigned"
        }

        return matchesSearch && matchesStatus
    })

    if (direction === 'next') {
        currentPage++
    } else if (direction === 'prev') {
        currentPage--
    }

    if (currentPage < 1) currentPage = 1
    if (currentPage > Math.ceil(filteredData.length / rowsPerPage)) currentPage = Math.ceil(filteredData.length / rowsPerPage)

    populateTable(filteredData)
}

function updatePaginationButtons(totalRows) {
    const totalPages = Math.ceil(totalRows / rowsPerPage)

    document.getElementById("prevPage").disabled = currentPage === 1
    document.getElementById("nextPage").disabled = currentPage === totalPages
}

function resetFilters() {
    document.getElementById("searchInput").value = ""
    document.getElementById("historyFilter").value = ""

    currentPage = 1
    populateTable(historyData)
}

function exportTableToCSV() {
    const table = document.getElementById("inventoryTable")
    const rows = table.querySelectorAll("tr")

    let csvContent = "Product Type,Status,Soldier ID,Soldier Full Name,Date\n"

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
    link.setAttribute("download", "history_report.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

document.addEventListener("DOMContentLoaded", () => {
    getHistory()
})
