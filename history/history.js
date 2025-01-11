const jsonData = [
    {
        "productName": "M4 Rifle",
        "status": "Assigned",
        "soldierId": "54321",
        "soldierFullName": "Sarah Johnson",
        "date": "2023-02-10"
    },
    {
        "productName": "M16 Rifle",
        "status": "In Stock",
        "soldierId": "23456",
        "soldierFullName": "Mike Wilson",
        "date": "2023-03-22"
    },
    {
        "productName": "M4 Carbine",
        "status": "Under Maintenance",
        "soldierId": "34567",
        "soldierFullName": "Emily Davis",
        "date": "2023-04-12"
    },
    {
        "productName": "M4A1 Carbine",
        "status": "Available",
        "soldierId": "45678",
        "soldierFullName": "Jason Miller",
        "date": "2023-05-17"
    },
    {
        "productName": "M14 Rifle",
        "status": "Assigned",
        "soldierId": "56789",
        "soldierFullName": "Sophia Taylor",
        "date": "2023-06-21"
    },
    {
        "productName": "Glock 17",
        "status": "In Stock",
        "soldierId": "67890",
        "soldierFullName": "Joshua Martinez",
        "date": "2023-07-14"
    },
    {
        "productName": "Glock 19",
        "status": "Available",
        "soldierId": "78901",
        "soldierFullName": "Rachel Moore",
        "date": "2023-08-09"
    },
    {
        "productName": "M249 SAW",
        "status": "In Stock",
        "soldierId": "89012",
        "soldierFullName": "David Lee",
        "date": "2023-09-03"
    },
    {
        "productName": "M240 Machine Gun",
        "status": "Under Maintenance",
        "soldierId": "90123",
        "soldierFullName": "Olivia Anderson",
        "date": "2023-10-15"
    },
    {
        "productName": "Night Vision Goggles",
        "status": "Assigned",
        "soldierId": "10234",
        "soldierFullName": "Ethan Harris",
        "date": "2023-11-28"
    },
    {
        "productName": "First Aid Kit",
        "status": "In Stock",
        "soldierId": "21345",
        "soldierFullName": "Ava Clark",
        "date": "2023-12-09"
    },
    {
        "productName": "Granede",
        "status": "Avaiable",
        "soldierId": "21345",
        "soldierFullName": "Ava Clark",
        "date": "2023-12-09"
    },
    {
        "productName": "First Aid Kit",
        "status": "In Stock",
        "soldierId": "21345",
        "soldierFullName": "Ava Clark",
        "date": "2023-12-09"
    },
    {
        "productName": "M240B Machine Gun",
        "status": "In Stock",
        "soldierId": "21395",
        "soldierFullName": "Ava Clark",
        "date": "2023-12-09"
    },
    {
        "productName": "M249 SAW",
        "status": "Available",
        "soldierId": "32456",
        "soldierFullName": "Lucas Scott",
        "date": "2024-01-10"
    },
    {
        "productName": "M240B Machine Gun",
        "status": "In Stock",
        "soldierId": "43567",
        "soldierFullName": "Mason Robinson",
        "date": "2024-02-18"
    },
    {
        "productName": "Binoculars",
        "status": "Assigned",
        "soldierId": "54678",
        "soldierFullName": "Grace White",
        "date": "2024-03-01"
    },
    {
        "productName": "Radio Set",
        "status": "Available",
        "soldierId": "65789",
        "soldierFullName": "Henry Jackson",
        "date": "2024-04-12"
    },
    {
        "productName": "Transport Vehicle (Humvee)",
        "status": "In Stock",
        "soldierId": "76890",
        "soldierFullName": "Amelia Lewis",
        "date": "2024-05-24"
    }
]

let currentPage = 1
const rowsPerPage = 15  // Number of rows per page

function populateTable(data) {
    const tableBody = document.querySelector("#inventoryTable tbody")
    tableBody.innerHTML = ""

    const startIndex = (currentPage - 1) * rowsPerPage
    const paginatedData = data.slice(startIndex, startIndex + rowsPerPage)

    paginatedData.forEach(item => {
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${item.productName}</td>
            <td>${item.status}</td>
            <td>${item.soldierId}</td>
            <td>${item.soldierFullName}</td>
            <td>${item.date}</td>
        `
        tableBody.appendChild(row)
    })

    updatePaginationButtons(data.length)
}

function applySearchAndFilters() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase()
    const historyFilterValue = document.getElementById("historyFilter").value

    const filteredData = jsonData.filter(item => {
        const matchesSearch = item.productName.toLowerCase().includes(searchValue)

        let matchesStatus = true
        if (historyFilterValue === "inStock") {
            matchesStatus = item.status === "In Stock"
        } else if (historyFilterValue === "available") {
            matchesStatus = item.status === "Available"
        } else if (historyFilterValue === "underMaintenance") {
            matchesStatus = item.status === "Under Maintenance"
        } else if (historyFilterValue === "assigned") {
            matchesStatus = item.status === "Assigned"
        }

        return matchesSearch && matchesStatus
    })

    currentPage = 1
    populateTable(filteredData)
}

function applySort() {
    const sortValue = document.getElementById("sortSelect").value

    let sortedData = [...jsonData]

    switch (sortValue) {
        case "productType":
            sortedData.sort((a, b) => a.productName.localeCompare(b.productName))
            break
        case "status":
            sortedData.sort((a, b) => a.status.localeCompare(b.status))
            break
        case "soldierId":
            sortedData.sort((a, b) => a.soldierId - b.soldierId)
            break
        case "soldierFullName":
            sortedData.sort((a, b) => a.soldierFullName.localeCompare(b.soldierFullName))
            break
        case "date":
            sortedData.sort((a, b) => new Date(b.date) - new Date(a.date))
            break
        default:
            break
    }

    currentPage = 1
    populateTable(sortedData)
}

function changePage(direction) {
    const filteredData = jsonData.filter(item => {
        const searchValue = document.getElementById("searchInput").value.toLowerCase()
        const historyFilterValue = document.getElementById("historyFilter").value

        const matchesSearch = item.productName.toLowerCase().includes(searchValue)

        let matchesStatus = true
        if (historyFilterValue === "inStock") {
            matchesStatus = item.status === "In Stock"
        } else if (historyFilterValue === "available") {
            matchesStatus = item.status === "Available"
        } else if (historyFilterValue === "underMaintenance") {
            matchesStatus = item.status === "Under Maintenance"
        } else if (historyFilterValue === "assigned") {
            matchesStatus = item.status === "Assigned"
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
    document.getElementById("sortSelect").value = ""
    currentPage = 1
    populateTable(jsonData)
}

document.addEventListener("DOMContentLoaded", () => {
    populateTable(jsonData)
})
