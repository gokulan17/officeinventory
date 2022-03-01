var inventroyname;
var category;
var startdate;
var enddate;
var data = "";
var obj = [];
var page = 0;
var totalPages;
var tableBody = document.getElementById("inventoryTable");
var xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    obj = JSON.parse(this.responseText);
    let bodyText = '';
    if (obj.length == 0) {
      bodyText += `<tr>
                        <td colspan="7" class="text-center">No Data Found</td>
                   </tr>`
      tableBody.innerHTML = bodyText;
    }
    for (let index = 0; index < obj.length; index++) {
      bodyText += `<tr> 
                        <td>${obj[index].serialNumber}</td>
                        <td>${obj[index].inventoryName}</td>
                        <td>${obj[index].category}</td>
                        <td>${obj[index].status}</td>
                        <td class="text-center">${Datevalue(obj[index].purchaseDate)}</td>
                        <td class="text-left">${age(obj[index].purchaseDate)}</td>
                        <td class="text-center"><span class="btn btn-info"onclick=updateFunction(${obj[index].id})>Update</span></td>
                        <td class="text-center"><span class="btn btn-info" onclick=deleteFunction(${obj[index].id})>Delete</span></td>
                    </tr>`
    }
    tableBody.innerHTML = bodyText;
    let calPage = obj[0].countVal / showPages;
    totalPages = Math.ceil(calPage);
    createpagination(totalPages);
  }
});
//filteration
var temp = '';
var AscDec = "DESC";
var inventroyname = "";
var category = "";
var startdate = "";
var enddate = "";
var catName = 'CreatedDate';
var AscDec = 'ASC';
var sort = 'no';
var url;
var showPages = document.getElementById("shows").value;
var pageActive = 1;
function pageChangeUp() {
  if (pageActive <= totalPages) {
    pageActive += 1;
  }
}
function pageChangeDown() {
  if (pageActive == totalPages) {
    pageActive = pageActive - 1;
  }
  if (pageActive >= 1) {
    pageActive -= 1;
  }
}
function createpagination(pages) {

  let element = document.getElementById("pageno");
  var pagebody = "";
  if (pageActive > 1) {
    if (pageActive == length) {
      pageActive = pages - 1;
    }
    pagebody += `<button type="button" class="btn btn-info  m-1" onclick="pageChangeDown(),getFilterValue('CreatedDate',${pageActive - 1})" >prev</button>`;
  }
  if (pageActive > 1) {
    pagebody += `<button type="button" class="btn btn-info  m-1" onclick="getFilterValue('CreatedDate',0)" >1</button>`;
    if (pageActive > 2) {
      pagebody += `<button type="button" class="btn   m-1" >...</button>`;
    }
  }
  for (let plength = pageActive; plength < pageActive + 3; plength++) {
    if (plength < pages) {
      pagebody += `<button type="button" class="btn btn-info  m-1" onclick="getFilterValue('CreatedDate',${plength - 1})" >${plength}</button>`;
    }
  }
  if (pageActive < pages - 3) {
    pagebody += `<button type="button" class="btn   m-1"  >...</button>`;
  }

  if (pageActive <= pages) {
    pagebody += `<button type="button" class="btn btn-info  m-1" onclick="getFilterValue('CreatedDate',${pages - 1})" >${pages}</button>`;
  }
  if (pageActive < pages) {
    pagebody += `<button type="button" class="btn btn-info  m-1" onclick="pageChangeUp(),getFilterValue('CreatedDate',${pageActive})">next</button>`;
  }
  element.innerHTML = pagebody;
}

function getFilterValue(catName, page) {
  inventroyname = document.getElementById("inventoryName").value;
  category = document.getElementById("Category").value;
  startdate = document.getElementById("start").value;
  enddate = document.getElementById("end").value;
  showPages = document.getElementById("shows").value;
  let pageno = showPages * page;
  // sorting
  if (temp == catName) {
    if (AscDec == "ASC") {
      AscDec = "DESC";
    }
    else {
      AscDec = "ASC";
    }
  }
  else {
    AscDec = "ASC";
  }
  temp = catName;
  // sortcondtion
  // if (sort == 'no') {
  //   AscDec = "ASC";
  // }
  url = "http://localhost:8080/officeInventory/search?iname=" + inventroyname + "&catry=" + category + "&sdate=" + startdate + "&edate=" + enddate + "&columnName=" + catName + "&sortValue=" + AscDec + "&limitval=" + showPages + "&offSetVal=" + pageno;
  if (startdate == "" && enddate == "" || (startdate != "" && enddate != "")) {
    xhr.open("GET", url);
    xhr.send(data);
  }
  else {
    alert("Please Fill The Date Fields");
  }

}
url = "http://localhost:8080/officeInventory/search?iname=" + inventroyname + "&catry=" + category + "&sdate=" + startdate + "&edate=" + enddate + "&columnName=" + catName + "&sortValue=" + AscDec + "&limitval=" + 5 + "&offSetVal=" + page;
xhr.open("GET", url);
xhr.send(data);
// url = "http://localhost:8080/officeInventory/getall";
// xhr.open("GET", url);
// xhr.send();
//update Function
function updateFunction(id) {
  location.href = "form.html?id=" + id;
}

//clear function
function reset() {
  document.getElementById("inventoryName").value = "";
  document.getElementById("Category").value = "";
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
}

//delete function
function deleteFunction(id) {
  url = "http://localhost:8080/officeInventory/delete";
  let delData = {
    "id": id
  };
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(delData));
  setTimeout(() => {
    location.reload();
  }, 50);

}


// date picker
$('#start').datepicker({
  dateFormat: "yy-mm-dd",
  maxDate: new Date()
});
$('#end').datepicker({
  dateFormat: "yy-mm-dd",
  maxDate: new Date()
});


//age calculation
function age(pDate) {
  let y1 = parseInt(pDate.substring(0, 4));
  let m1 = parseInt(pDate.substring(5, 7));
  let d1 = parseInt(pDate.substring(8, 10));
  var date = new Date();
  var d2 = date.getDate();
  var m2 = 1 + date.getMonth();
  var y2 = date.getFullYear();
  var month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (d1 > d2) {
    d2 = d2 + month[m2 - 1];
    m2 = m2 - 1;
  }
  if (m1 > m2) {
    m2 = m2 + 12;
    y2 = y2 - 1;
  }
  var d = d2 - d1;
  var m = m2 - m1;
  var y = y2 - y1;

  if (y > 0) {
    return y + "-Years";
  }
  else if (m > 0) {
    return m + "-Months";
  }
  else {
    return d + "-Days";
  }
}
//date value formate 
function Datevalue(val) {
  var date = new Date(val);
  date = date.toLocaleDateString(undefined, { month: 'short' }) + '-' + date.toLocaleDateString(undefined, { day: '2-digit' }) + '-' + date.toLocaleDateString(undefined, { year: 'numeric' })
  return date;
}

// --------------------------------------------local storage--------------------------------------------------------------
// var localStorageData = [];
// var tableBody = document.getElementById("inventoryTable");

// if(localStorage.getItem("storedData")){
//     localStorageData = JSON.parse(localStorage.getItem("storedData"));
// }
// if(localStorageData.length >0){ 
//     let bodyText = '';
//     for (let index = 0; index < localStorageData.length; index++) {
//         bodyText += `<tr> 
//                         <td>${localStorageData[index].number}</td>
//                         <td>${localStorageData[index].name}</td>
//                         <td>${localStorageData[index].category}</td>
//                         <td>${localStorageData[index].status}</td>
//                         <td class="text-center">${localStorageData[index].purchaseDate}</td>
//                         <td class="text-left">${localStorageData[index].age+'-years'}</td>
//                         <td class="text-center"><span class="btn btn-info" >Update</span></td>
//                         <td class="text-center"><span class="btn btn-info">Delete</span></td>
//                     </tr>`
//     }
//     tableBody.innerHTML = bodyText;
// }



// filteration
// var temp = '';
// var AscDec = "DESC";
// var y = 1
// var val = 0;
// function getFilterValue(catName, page, sort) {
// var inventroyname = document.getElementById("inventoryName").value;
// var category = document.getElementById("Category").value;
// var startdate = document.getElementById("start").value;
// var enddate = document.getElementById("end").value;
// // sorting
// if (temp == catName) {
//   if (AscDec == "ASC") {
//     AscDec = "DESC";
//   }
//   else {
//     AscDec = "ASC";
//   }
// }
// else {
//   AscDec = "ASC";
// }
// temp = catName;

// // pagination
// if (page == 'f') {
//   y = y + 1;
//   val = y * 5;
//   if (y >= 9) {
//     y = 4;
//   }
// }
// else {
//   y = y - 1;
//   val = val - 5;
//   if (y <= 0) {
//     y = 1;
//     val = 0;
//   }
// } 
// // sortcondtion
// if (sort == 'no') {
//   AscDec = "ASC";
// }
// document.getElementById("pageNo").innerHTML = y;
// url = "http://localhost:8080/officeInventory/search?iname=" + inventroyname + "&catry=" + category + "&sdate=" + startdate + "&edate=" + enddate + "&columnName=" + catName + "&sortValue=" + AscDec + "&offSetVal=" + val;
// if (startdate == "" && enddate == "" || (startdate != "" && enddate != "")) {
//   xhr.open("GET", url);
//   xhr.send(data);
// }
// else {
//   alert("Please Fill The Date Fields");
// }
// }
// function reset() {
//   document.getElementById("search-box").reset;
// }


// //page no
// var clickpage = 0;
// function pageForw() {
//   clickpage += 1;
//   pageVal();
// }
// function pageBack() {

//   console.log(clickpage);
//   if (clickpage > 0) {
//     clickpage -= 1;
//   }
//   pageVal();
// }
// function pageVal(pageNo) {
//   var pageno = document.getElementById("pageNo");
//   let pageBody = '';

//   countValue = pageNo / 5;
//   // totalPage=Math.ceil(countValue);
//   var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
//   button = 5 + clickpage;
//   if ((arr.length - clickpage) >= 5) {
//     for (let i = clickpage; (clickpage >= 0 && i < button && i < arr.length); i++) {
//       pageBody += `<button type="button" class="btn " id="pagevalno" onclick="valuepage(${arr[i]})">${arr[i]}</button>`  
//     }
//     if(clickpage==3){
//       var element=document.getElementById("pagevalno");
//       element.classList.add("btn-info");
//      }
//     pageno.innerHTML = pageBody;
//   }
//   else if (arr.length <= 5) {
//     for (let i = 0; i < arr.length; i++) {
//       pageBody += `<button type="button" class="btn " onclick="valuepage(${arr[i]})">${arr[i]}</button>`
//       pageno.innerHTML = pageBody;
//     }
//   }
// }
// function valuepage(val) {
//   console.log(val);
// }
// var pageno = document.getElementById("pageNo");
// function pageVal(totalPages){    
//  var pages=Math.ceil(totalPages/5);
//  pages=5;
//  if(pages<=5){
//    lessLimitPages(pages)
//  }
//  else{
//  }
// }
// function lessLimitPages(pages){
//   let pagebody='';
//   for(let i=0;i<pages;i++){
//    pagebody +=`<button type="button" class="btn" id="pagevalno" onclick="valuepage(${i+1})"active>${i+1}</button>`
//   }
//   pageno.innerHTML = pagebody;
// }



// const element = document.getElementById("pageno");

// function createPagination(totalPages, page) {
//   let pagebody = '';
//   let active = "";
//   let beforePage = page - 1;
//   let afterPage = page + 1;
//   if (page > 1) {
//     pagebody += `<li class="btn prev" onclick="createPagination(totalPages,${page - 1})"><span><i class="fa fa-angle-left"></i> Prev</span></li>`;
//   }
//   if (page > 2) {
//     pagebody += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>1</span></li>`;
//     if (page > 3) {
//       pagebody += `<li class="dots"><span>...</span></li>`;
//     }
//   }
//   if (page == totalPages) {
//     beforePage = beforePage - 2;
//   } else if (page == totalPages - 1) {
//     beforePage = beforePage - 1;
//   }

//   if (page == 1) {
//     afterPage = afterPage + 2;
//   } else if (page == 2) {
//     afterPage = afterPage + 1;
//   }
//   for (let plength = beforePage; plength <= afterPage; plength++) {
//     if (plength > totalPages) {
//       continue;
//     }
//     if (plength == 0) {
//       plength = plength + 1;
//     }
//     if (page == plength) {
//       active = "active";
//     } else {
//       active = "";
//     }
//     pagebody += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${plength}</span></li>`;
//   }
//   if (page < totalPages - 1) {
//     if (page < totalPages - 2) {
//       pagebody += `<li class="dots"><span>...</span></li>`;
//     }
//     pagebody += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
//   }
//   if (page < totalPages) {
//     pagebody += `<li class="btn next" onclick="createPagination(totalPages, ${page + 1})"><span> Next <i class="fa fa-angle-right"></i></span></li>`;
//   }
//   element.innerHTML = pagebody;
//   console.log(page);
// }

// function nav(direction) {
//   console.log(pageActive);
//   if (pageActive >= 0) {
//     document.getElementById("prevbtn").style.display = 'block';
//   }
//   if (pageActive == 1) {

//     document.getElementById("prevbtn").style.display = 'none';
//   }
//   if (direction == "prev") {

//     if (pageActive > 0) {
//       pageActive -= 1;
//       getFilterValue('CreatedDate', 'no', pageActive)
//     }
//   }
//   else {
//     if (pageActive < totalPages - 1) {
//       pageActive += 1;
//       getFilterValue('CreatedDate', 'no', pageActive)
//     }
//   }
//   if (pageActive == totalPages - 1) {
//     document.getElementById("nextbtn").style.display = 'none';
//   }
//   else {
//     document.getElementById("nextbtn").style.display = 'block';
//   }
// }
  // for (let i = 0; i < pages; i++) {
  //   if (i == pageActive) {
  //     pagebody += `<button type="button" class="btn btn-info  m-1" onclick="getFilterValue('CreatedDate','no',${i})" id='page${i + 1}'>${i + 1}</button>`;
  //   }
  //   else {
  //     pagebody += `<button type="button" class="btn   m-1" onclick="getFilterValue('CreatedDate','no',${i})" id='page${i + 1}'>${i + 1}</button>`;
  //   }
  // }