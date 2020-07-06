var url = "http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1" + $.param('api_key:22dcb7d1-e4ce-49ed-86fa-ee1e1b3569a5')
console.log(url)


const fetchPromise = fetch("http://exam-2020-1-api.std-400.ist.mospolytech.ru/api/data1");
        let mainContent = '',
           main = document.querySelector('#spisok');
        
        fetchPromise.then(response => {
           return response.json();
        }).then(films => {
        films.forEach(film => {
          mainContent+=`
          <div class="row">
            <div class="col-8 col-md-2">${film.name}</div>
            <div class="col-2 d-none d-md-block">${film.typeObject}</div>
            <div class="col-4 d-none d-md-block">${film.admArea} ${film.address}</div>
            <div class="col-1 d-none d-md-block">${film.rate}</div>
            <div class="col-4 col-md-2"><button class="btn"></div>
          </div>`;
          });
          console.log(films);
          main.innerHTML = mainContent;
        });

const data = {"name":"имя"}
  const response = await fetch("http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1?api_key=22dcb7d1-e4ce-49ed-86fa-ee1e1b3569a5", {
    method: 'POST', // или 'PUT'
    body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
    headers: {
      'Content-Type': 'application/json',
       "Accept": "application/json",
    }
  });
  const jsoon = await response.json();
  console.log('Успех:', JSON.stringify(jsoon));

fetch("http://exam-2020-1-api.std-400.ist.mospolytech.ru/api/data1/158268", {
  method: 'DELETE',
})
.then(res => res.json()) // or res.json()
.then(res => console.log(res))

  const data = {"name":"Garnets & co","rate":27,"isNetObject":0,"operatingCompany":"dzv","typeObject":"ресторан","admArea":"Центральный","district":"Мещанский","address":"город Москва, проспект Мира, дом 68, строение 1А","publicPhone":"(495) 680-39-45","seatsCount":104,"socialPrivileges":0,"socialDiscount":15,"created_at":null,"updated_at":"2020-06-28T14:44:40.000000Z","set_1":583,"set_2":720,"set_3":494,"set_4":349,"set_5":671,"set_6":799,"set_7":720,"set_8":728,"set_9":239,"set_10":779};

  const response = await fetch("http://exam-2020-1-api.std-400.ist.mospolytech.ru/api/data1/125121", {
    method: 'PUT', // или 'PUT'
    body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
    headers: {
      'Content-Type': 'application/json',
       "Accept": "application/json",
    }
  });
  const json = await response.json();
  console.log('Успех:', JSON.stringify(json));


  const data = {"address":"город Москва, проспект Вернадского, дом 125","admArea":"Западный административный округ","district":"район Тропарёво-Никулино","isNetObject":0,"name":"Кафешка","operatingCompany":"","publicPhone":"(495) 434-11-91","rate":33,"seatsCount":20,"set_1":708,"set_10":276,"set_2":609,"set_3":352,"set_4":147,"set_5":905,"set_6":714,"set_7":993,"set_8":498,"set_9":619,"socialDiscount":82,"socialPrivileges":0,"student_id":1083,"typeObject":"кафе"}

 document.addEventListener('DOMContentLoaded', () => {
    const ajaxSend = (formData) => {
        fetch('http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1?api_key=22dcb7d1-e4ce-49ed-86fa-ee1e1b3569a5', { // файл-обработчик 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                 "Accept": "application/json", // отправляемые данные 
            },
            body: JSON.stringify(data)
        })
            .then(response => console.log(response.json()))
            .catch(error => console.error(error))
    };

    const forms = document.getElementsByTagName('form');
    for (let i = 0; i < forms.length; i++) {
        forms[i].addEventListener('submit', function (e) {
            e.preventDefault();

            let formData = new FormData(this);
            formData = Object.fromEntries(formData);

            ajaxSend(formData);
            this.reset();
        });
    };
});

