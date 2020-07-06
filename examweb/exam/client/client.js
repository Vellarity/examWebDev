var summ = []
var k;
var json;
let min// = Math.ceil(0);
let max// = Math.floor(10);
let setnum// = Math.floor(Math.random() * (max - min)) + min;
async function test() {
  const response = await fetch('http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1');
  const data = await response.json();
  return data;
}
k = test();
console.log(k);
let mainContent = '',
  main = document.querySelector('#spisok');
k.then(films => {
  only20(films).forEach(film => {
    mainContent += `
      <tr class="pos" height="74px" id="${film.id}" onclick="menucards(this)">
        <td class="d-md-table-cell  w-25">${film.name}</td>
        <td class="d-none d-md-table-cell text-md-center">${film.typeObject}</td>
        <td class="d-none d-md-table-cell" style="padding-left: 3rem !important">${film.district} ${film.address} </td>
        <td class="text-center d-md-table-cell">${film.rate}</td>
        <td class="d-none">${film.socialPrivileges}</td>
        <td class="d-none">${film.admArea}</td>
      </tr>`;
  });
  main.innerHTML = mainContent;
  admSelector()
  typeSelector()
  socialSelector()
  setTimeout(only, 1000);
});

function retun() {
  event.preventDefault()
  let mainContent = '',
    main = document.querySelector('#spisok');
  k.then(films => {
    only20(films).forEach(film => {
      mainContent += `
      <tr class="unselectable pos" height="74px" id="${film.id}" onclick="menucards(this)">
        <td class="d-md-table-cell unselectable  w-25">${film.name}</td>
        <td class="d-none d-md-table-cell text-md-center">${film.typeObject}</td>
        <td class="d-none d-md-table-cell" style="padding-left: 3rem !important">${film.district} ${film.address} </td>
        <td class="text-center d-md-table-cell">${film.rate}</td>
        <td class="d-none">${film.socialPrivileges}</td>
        <td class="d-none">${film.admArea}</td>
      </tr>`;
    });
    console.log(films);
    main.innerHTML = mainContent;
    setTimeout(only, 2000);
  });
}

function tableSearch() {
  k.then(films => {
    let recordapp = [];
    films.forEach(film => { recordapp.push(film) });
    console.log(recordapp)
    let searchOptions = [];
    document.querySelectorAll("select").forEach((select) => {
      let value;
      let selected = select.options[select.selectedIndex];
      if (selected.innerText == "Не выбрано") return;
      if (select.name == "socialPrivileges")
        value = selected.innerText == "Есть" ? 1 : 0;
      else value = selected.innerText;
      searchOptions.push({ name: select.name, value: value });
      console.log(searchOptions)
    });
    for (option of searchOptions) {
      recordapp = recordapp.filter((item) => item[option.name] == option.value);
    }
    recordapp.slice(0, 20);
    console.log(recordapp.slice(0, 20))
    let main = document.querySelector('#spisok');
    let mainContent = ''
    only20(recordapp).forEach((record) => {
      console.log(record.name)
      mainContent += `
      <tr class="unselectable pos" height="74px" id="${record.id}" onclick="menucards(this)">
        <td class="d-md-table-cell unselectable w-25">${record.name}</td>
        <td class="d-none d-md-table-cell text-md-center">${record.typeObject}</td>
        <td class="d-none d-md-table-cell" style="padding-left: 3rem !important">${record.district} ${record.address} </td>
        <td class="text-center d-md-table-cell">${record.rate}</td>
        <td class="d-none">${record.socialPrivileges}</td>
        <td class="d-none">${record.admArea}</td>
      </tr>`;
    });
    main.innerHTML = mainContent;
  })
}

function btnsearch() {
  tableSearch()
}

function only20(arr) {
  return arr.filter((film) => film.rate != null).sort(function (prev, next) { return next.rate - prev.rate; }).slice(0, 20);
}

function admSelector() {
  let id = 0;
  let mainContent = `<option selected disabled hidden value='Не выбрано' id="adm">Не выбрано</option>`,
    main = document.querySelector("#admArea");
  k.then(films => {
    films.forEach(film => {
      id++
      if (film.typeObject != null) {
        mainContent += `
      <option class="only" value="${film.admArea}">${film.admArea}</option>
      `};
    });
    main.innerHTML = mainContent;
  });
}

function typeSelector() {
  let id = 0;
  let mainContent = `<option selected disabled hidden value='Не выбрано' id="type">Не выбрано</option>`,
    main = document.querySelector('#typeObject');
  k.then(films => {
    films.forEach(film => {
      id++
      if (film.typeObject != null) {
        mainContent += `
      <option class="only" value="${film.typeObject}">${film.typeObject}</option>
      `};
    });
    main.innerHTML = mainContent;
  });
}

function socialSelector() {
  let id = 0;
  let moinContent = `<option selected disabled hidden value='Не выбрано' id="soc">Не выбрано</option>`,
    moin = document.querySelector('#socialPrivileges');
  k.then(films => {
    films.forEach(film => {
      id++
      if (film.socialPrivileges == 0) {
        moinContent += `
      <option class="only" value="${film.socialPrivileges}">Нет</option>
      `}
      else if (film.socialPrivileges == 1) {
        moinContent += `
      <option class="only" value="${film.socialPrivileges}">Есть</option>
      `}
    });
    moin.innerHTML = moinContent;
  });
}

function only() {
  var usedNames = {};
  $("select > .only").each(function () {
    if (usedNames[this.text]) {
      $(this).remove();
    } else {
      usedNames[this.text] = this.value;
    }
  });
}

function sortTable() {
  var tbl = document.getElementById("allnames").tBodies[0];
  var store = [];
  for (var i = 0, len = tbl.rows.length; i < len; i++) {
    var row = tbl.rows[i];
    var sortnr = parseFloat(row.cells[3].textContent || row.cells[3].innerText);
    if (!isNaN(sortnr)) store.push([sortnr, row]);
  }
  store.sort(function (x, y) {
    return y[0] - x[0]
  });
  for (var i = 0, len = store.length; i < len; i++) {
    tbl.appendChild(store[i][1]);
  }
  store = null;
}

async function menucards(el) {
  id = el.id
  let url = "http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1/" + id
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    }
  });
  json = await response.json();
  console.log('Успех:', JSON.stringify(json), json.set_1);
  let arr = [json.set_1, json.set_2, json.set_3, json.set_4, json.set_5, json.set_6, json.set_7, json.set_8, json.set_9, json.set_10];
  const myres = await fetch("mine.json", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
      'Access-Control-Allow-Origin': "",
    }
  });
  const jgirl = await myres.json();
  console.log(jgirl)
  let main = document.querySelector('#menucard')
  let mainContent = ""
  for (let i = 0; i < 10; i++) {
    mainContent += `
  <div class="card col-xl-3 col-md-4 justify-content-center" id="${i}">
    <object type="image/svg+xml" data="img/TARELKA.svg"></object>
    <div class="card-body counter">
      <h2 class="card-title text-center">${jgirl[i].set_name}</h2>
      <p class="card-text text-center">${jgirl[i].set_about}</p>
      <div class="row justify-content-around">
      <p class="card-text text-center stoimost" id="stoimost">${arr[i]}</p> <p>Руб</p>
      </div>
      <section class="sumSet">
        <div class="form-row d-flex justify-content-center align-content-end">
          <button class="counter__minus btnmenu">-</button>
          <input class="form-control w-25 text-center form-control-sm mx-2 counter__input" id="sum" type="number" min="0" value="0" disabled/>
          <button class="counter__plus btnmenu">+</button>
        </div>
      </section>
    </div>
  </div>
  `
  }
  main.innerHTML = mainContent;
  $('#shop').removeClass('d-none')

  var Counter = function (counter) {
    this.counter = counter;
    this.minus = counter.querySelector('.counter__minus');
    this.plus = counter.querySelector('.counter__plus');
    this.field = counter.querySelector('.counter__input');
    this.stoimost = counter.querySelector('.stoimost');
    this.events();
  }
  Counter.prototype.events = function () {
    this.plus.addEventListener('click', this.increment.bind(this));
    this.minus.addEventListener('click', this.decrement.bind(this));
    for (var cell in this.cells) {
      this.cells[cell].addEventListener('click', this.changeFromTable.bind(this, this.cells[cell]));
    }
  }
  Counter.prototype.increment = function () {
    this.field.value = parseInt(this.field.value) + 1;
    var text = this.stoimost.textContent;
    var number = Number(text);
    summ.push(number)
    console.log(summ)
    returnsum(summ)
  }
  Counter.prototype.decrement = function () {
    var newValue = parseInt(this.field.value) - 1;
    if (newValue < 0) {
      newValue = 0;
    }
    this.field.value = newValue;
    let text = this.stoimost.textContent;
    let number = Number(text);
    var index = summ.indexOf(number);
    if (index > -1) {
      summ.splice(index, 1);
    }
    console.log(summ)
    returnsum(summ)
  }
  var counters = document.querySelectorAll('.counter');
  counters = Array.prototype.slice.call(counters);
  counters.forEach(function (counter) {
    new Counter(counter);
  });
  min = Math.ceil(0);
  max = Math.floor(10);
  setnum = Math.floor(Math.random() * (max - min)) + min;
}
let sum = 0
function returnsum(array) {
  sum = 0
  let main = document.querySelector('#returnsum')
  mainContent = ""
  for (let i = 0; i < array.length; i++) {
    sum += array[i]
  }
  main.innerHTML = sum
}

let namearr = []
let colarr = []

function fillmodal() {
  namearr = []
  colarr = []
  let main = document.querySelector(".poZak")
  mainContent = ""
  let cards = document.querySelectorAll(".card")
  cards.forEach(card => {
    let name = card.querySelector("h2")
    namearr.push(name.innerText)
    let colvo = card.querySelector("input")
    let colvonum = Number(colvo.value)
    colarr.push(colvonum)
  })
  for (let i = 0; i < 10; i++) {
    if (colarr[i] == 0) continue;
    mainContent += `
      <div class="row rwitem">
        <div class="col d-flex justify-content-center align-items-center"><object type="image/svg+xml" data="img/TARELKA.svg"></object></div>
        <div class="col d-flex justify-content-center align-items-center text-center">${namearr[i]}</div>
        <div class="col d-flex justify-content-center align-items-center"> x ${colarr[i]}</div>
      </div>
      `
  }
  main.innerHTML = mainContent;
  main = document.querySelector(".infoZav")
  mainContent = `<p class="mt-2">Информация о заведении:</p>`
  mainContent += `
    <div class="row">
      <div class="font-weight-bold">Название:</div><p class="card-text">${json.name}</p>
    </div>
    <div class="row">
      <div class="font-weight-bold">Адрес:</div><p class="card-text">${json.district} ${json.address}</p>
    </div>
    <div class="row">
      <div class="font-weight-bold">Рейтинг:</div><p class="card-text">${json.rate}</p>
    </div> `
  main.innerHTML = mainContent;
  main = document.querySelector("#totalsum")
  main.innerHTML = sum
}

$("#prise").on("change", function () {
  let countCh = document.getElementById("prise")
  if (countCh.checked) {
    console.log(setnum)
    let searchSet = document.getElementById(setnum)
    console.log(searchSet)
    let field = searchSet.querySelector('.counter__input');
    field.value = parseInt(field.value) + 1;
    console.log(field.value)
    let stoimost = searchSet.querySelector('.stoimost');
    var text = stoimost.textContent;
    var number = Number(text);
    summ.push(number)
    returnsum(summ)
    mainContent = ""
    fillmodal()
  }
  else {
    let searchSet = document.getElementById(setnum)
    console.log(searchSet)
    let field = searchSet.querySelector('.counter__input');
    let stoimost = searchSet.querySelector('.stoimost');
    var newValue = parseInt(field.value) - 1;
    if (newValue < 0) {
      newValue = 0;
    }
    field.value = newValue;
    let text = stoimost.textContent;
    let number = Number(text);
    var index = summ.indexOf(number);
    if (index > -1) {
      summ.splice(index, 1);
    }
    console.log(summ)
    returnsum(summ)
    fillmodal()
  }
})

$('#onFive').on('change', function () {
  let countCh = document.getElementById("onFive")
  if (countCh.checked) {
    let main = document.querySelector(".poZak")
    mainContent = ""
    let cards = document.querySelectorAll(".card")
    cards.forEach(card => {
      let name = card.querySelector("h2")
      namearr.push(name.innerText)
      let colvo = card.querySelector("input")
      let colvonum = Number(colvo.value)
      colarr.push(colvonum)
    })
    for (let i = 0; i < 10; i++) {
      if (colarr[i] == 0) continue;
      mainContent += `
      <div class="row rwitem">
        <div class="col d-flex justify-content-center align-items-center"><object type="image/svg+xml" data="img/TARELKA.svg"></object></div>
        <div class="col d-flex justify-content-center align-items-center text-center">${namearr[i]}</div>
        <div class="col d-flex justify-content-center align-items-center"> x ${colarr[i] + 5}</div>
      </div>
      `
    }
    main.innerHTML = mainContent;
    main = document.querySelector("#totalsum")
    let newSum = sum * 2.5
    main.innerHTML = newSum
  }
  else {
    let main = document.querySelector(".poZak")
    mainContent = ""
    let cards = document.querySelectorAll(".card")
    cards.forEach(card => {
      let name = card.querySelector("h2")
      namearr.push(name.innerText)
      let colvo = card.querySelector("input")
      let colvonum = Number(colvo.value)
      colarr.push(colvonum)
    })
    fillmodal()
  }
})

