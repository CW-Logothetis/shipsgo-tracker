// BELOW adapted from https://medium.com/@johnwadelinatoc/manipulating-the-dom-with-fetch-7bfddf9c526b
    
// MDN: 'The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, 
// without waiting for stylesheets, images, and subframes to finish loading.'
// In effect, start fetching once HTML is loaded, cos it needs the `ul` to be there, but don't need to wait for CSS and images.

//////////////////////////////////////////        
// 1. fetch to GET the placeholder data //
////////////////////////////////////////// 

const savedDisplay = document.getElementById("saved-display")
const updateEtaBtn = document.getElementById("update-eta")

let containerID = ''
let ship = ''
let eta = ''

const fetchEta = async function() {
    await Promise.all(
        entries.map(async (containerID, i) => {
            console.log(entries[i].containerID)
        const response = await fetch(`https://shipsgo.com/api/ContainerService/GetContainerInfo/2e4bfc6af6a84620951449e42c43cd25/${entries[i].containerID}`)
        const data = await response.json()
        console.log(data)
        
        // for (let i = 0; i < data.length; i++) {
        //     entries[i].eta = data[i].ArrivalDate
        //     entries[i].ship = data[i].ship
        // }
        entries.forEach(entry => {
            entry.eta = data[i].ArrivalDate,
            entry.ship = data[i].ShippingLine
            console.log(data[i].ArrivalDate)
            console.log(`ETA: ${entries[0].eta}`)
            console.log(`SL: ${entries[0].ship}`)
        })
        
        
        })
    )
    renderTable()
}

updateEtaBtn.addEventListener('click', fetchEta)


let entries = []
const form = document.getElementById("new-post")

form.addEventListener('submit', function(e) {

    e.preventDefault() // stops page refreshing on submit
    let containerID = document.getElementById("post-title").value
    let ship = document.getElementById("post-body").value
    
    // const data = {
    //     ContainerNumber: postTitle, // again, title and body must match what server has for keys
    //     ship: postBody
    // }

    let entryObj = {
        containerID,
        ship,
        eta
    }
    entries.push(entryObj)
    localStorage.setItem("entries", JSON.stringify(entries))
    
    console.log(entryObj)
    console.log(entries)
    renderTable()

})

let leadsLocalStorage = JSON.parse( localStorage.getItem("entries") )

if (leadsLocalStorage) {
    entries = leadsLocalStorage
    renderTable()
}

const deleteLastBtn = document.getElementById("delete-last-entry")

deleteLastBtn.addEventListener("dblclick", function() {
    entries.pop()
    localStorage.setItem("entries", JSON.stringify(entries))
    renderTable()
    console.log(entries)
    console.log( localStorage.getItem("entries") )

})

function renderTable() {
    let entriesHTML = ''
    for (i = 0; i < entries.length; i ++) {
    entriesHTML += 
        `
            <tr>
                <td>${entries[i].containerID}</td>
                <td>${entries[i].ship}</td>
                <td>${entries[i].eta}</td>
            </tr>  
        `
    }
    savedDisplay.innerHTML = entriesHTML
    // console.log(entries[0].containerID)
}
