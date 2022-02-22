// BELOW adapted from https://medium.com/@johnwadelinatoc/manipulating-the-dom-with-fetch-7bfddf9c526b
    
// MDN: 'The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, 
// without waiting for stylesheets, images, and subframes to finish loading.'
// In effect, start fetching once HTML is loaded, cos it needs the `ul` to be there, but don't need to wait for CSS and images.



const savedDisplay = document.getElementById("saved-display")
const updateEtaBtn = document.getElementById("update-eta")

let containerID = ''
let ship = ''
let eta = ''

////////////////////////////////////////////////////////////////////////////        
// 1. POST container no. and shipping line in order to receive Request ID //
//////////////////////////////////////////////////////////////////////////// 

let entries = []
const form = document.getElementById("new-post")

// function handleSubmit(event) {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const asString = new URLSearchParams(formData).toString();
//     console.log(asString);
//   }

function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const params = new URLSearchParams(formData)
    fetch('https://shipsgo.com/api/ContainerService/PostContainerInfo/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params    
    })
    .then((response) => response.json())
      .then((responseData) => {
          console.log(JSON.stringify(responseData));
      }).catch(err=>{console.log(err)})
    
}

form.addEventListener('submit', handleSubmit);

// form.addEventListener('submit', async (e) => {

//     // stops page refreshing on submit
//     e.preventDefault() 

//     const formData = new FormData(form);
//     try {
//         await fetch('https://shipsgo.com/api/ContainerService/PostContainerInfo/',{
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: new URLSearchParams(Object.fromEntries(formData))
//         })
//     } catch (err) {
//         console.log(err)
//     }
//     renderTable()
    
// })

let leadsLocalStorage = JSON.parse( localStorage.getItem("entries") )

if (leadsLocalStorage) {
    entries = leadsLocalStorage
    renderTable()
}



// delete last entry in local storage with DOUBLE click
const deleteLastBtn = document.getElementById("delete-last-entry")

deleteLastBtn.addEventListener("dblclick", function() {
    entries.pop()
    localStorage.setItem("entries", JSON.stringify(entries))
    renderTable()
    // console.log(entries)
    // console.log( localStorage.getItem("entries") )

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

/////////////////////////////////////////////////////////////////////////        
// 2. GET current arrival ETA by using previously requested Request ID //
///////////////////////////////////////////////////////////////////////// 

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



