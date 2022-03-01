// Check if add or edit
var id;
var Upobj;
var xhr = new XMLHttpRequest();
let currentUrl = window.location.search;
let url = new URLSearchParams(currentUrl);
for (let i of url.entries()) {
    id = i[1];
}
if (id) {
    var updata = "";
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            Upobj = JSON.parse(this.responseText);
            document.getElementById("inventoryName").value = Upobj[0].inventoryName;
            document.getElementById("SerialNumber").value = Upobj[0].serialNumber;
            document.getElementById("Category").value = Upobj[0].category;
            document.getElementById("Status").value = Upobj[0].status;
            document.getElementById("PurchaseDate").value = Upobj[0].purchaseDate;
            document.getElementById("textArea").value = Upobj[0].notes;
        }
    });
    xhr.open("GET", "http://localhost:8080/officeInventory/" + id);
    xhr.send(updata);
}
// If edit set values in form

const form = document.getElementById("form");
var inventoryNameValue;
var SerialNumberValue;
var CategoryValue;
var StatusValue;
var PurchaseDateValue;
var notesValue;
function getValue() {
    inventoryNameValue = document.getElementById("inventoryName").value.trim();
    SerialNumberValue = document.getElementById("SerialNumber").value.trim();
    CategoryValue = document.getElementById("Category").value.trim();
    StatusValue = document.getElementById("Status").value.trim();
    PurchaseDateValue = document.getElementById("PurchaseDate").value;
    notesValue = document.getElementById("textArea").value.trim();
}

form.addEventListener('submit', e => {
    e.preventDefault();
    checkInput();
});
function checkInput() {
    getValue();
    let namecheck = /^[a-zA-Z]+$/;
    let SerialNumberRegex = /^\d+$/;
    if (!inventoryNameValue) {
        setAlert("Please enter Inventory Name", "alert-danger");
    } else if (namecheck.test(inventoryNameValue) === false) {
        setAlert("Please enter a valid Name", "alert-danger");
    } else if (!SerialNumberValue) {
        setAlert("Please enter Serial Number", "alert-danger");
    } else if (SerialNumberRegex.test(SerialNumberValue) === false) {
        setAlert("Please enter a valid Serial Number", "alert-danger");
    } else if (!CategoryValue) {
        setAlert("please select item Category", "alert-danger");
    } else if (!StatusValue) {
        setAlert("please select item status", "alert-danger");
    } else if (!PurchaseDateValue) {
        setAlert("please enter vali Purchase Date", "alert-danger");
    } else if (!isDateBeforeToday(PurchaseDateValue)) {
        setAlert("please enter valid Purchase Date", "alert-danger");
    } else if (!notesValue) {
        setAlert("please enter the notes", "alert-danger");
    } else if (notesValue.lenght < 500) {
        setAlert("please enter less than 500 words on notes", "alert-danger");
    } else {
        // let obj = {
        //     name: inventoryNameValue,
        //     number: SerialNumberValue,
        //     category: CategoryValue,
        //     status: StatusValue,
        //     purchaseDate: PurchaseDateValue,
        //     notes: notesValue
        // age: ageValue
        // }
        // if (localStorage.getItem("storedData")) {
        //     inventoryData = JSON.parse(localStorage.getItem("storedData"));
        // }
        // inventoryData.push(obj);
        // // set the data in local storage
        // setAlert("Product added successfully", "alert-success");
        // localStorage.setItem("storedData", JSON.stringify(inventoryData));
        var data = {
            "inventoryName": inventoryNameValue,
            "serialNumber": SerialNumberValue,
            "category": CategoryValue,
            "status": StatusValue,
            "purchaseDate": PurchaseDateValue,
            "notes": notesValue
        };
        console.log(data);
        // if edit save data.id, api url, api result messages.
        let url;
        if (id) {
            data.id = id;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4 && this.status === 200) {
                    setAlert("Product updated successfully", "alert-success");
                }
                else {
                    setAlert("product not updated", "alert-danger");
                }
            });
            url = "http://localhost:8080/officeInventory/update";
        }
        else {
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4 && this.status === 200) {
                    setAlert("Product added successfully", "alert-success");
                }
                else if (this.status === 500) {
                    setAlert("please check the Serial Number Duplicate values not Accepted", "alert-danger");
                }
                else {
                    setAlert("product not added", "alert-danger");
                }
            });
            url = "http://localhost:8080/officeInventory/add";
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    }
    function setAlert(messageContent, messageType) {
        document.getElementById("alertMsg").innerHTML = messageContent;
        document.getElementById("alertMsg").classList.add(messageType,'d-block');
        setTimeout(() => {
            document.getElementById("alertMsg").classList.remove('d-block');
        }, 3000);
    }
}
function isDateBeforeToday(date) {
    return new Date(date) <= new Date(new Date().toDateString());
}
// datepicker
$('#PurchaseDate').datepicker({
    dateFormat: "yy-mm-dd",
        maxDate: new Date()
});
var tableBody = document.getElementById("frame");
var obj=[{"n":1,"s":2,"e":3,"f":4},{"n":1,"s":2,"e":3,"f":4},{"n":1,"s":2,"e":3,"f":4}]
for(let i=0;i<3;i++){
    bodyText += `<div> 
                        <p>${obj[index].n}</p>
                    </div>`
    }
    tableBody.innerHTML = bodyText;