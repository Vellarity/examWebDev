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


const data = { name: 'Бары Попкорн' };

  const response = await fetch("http://exam-2020-1-api.std-400.ist.mospolytech.ru/api/data1", {
    method: 'POST', // или 'PUT'
    body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
    headers: {
      'Content-Type': 'application/json',
       "Accept": "application/json",
    }
  });
  const json = await response.json();
  console.log('Успех:', JSON.stringify(json));




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



 document.addEventListener('DOMContentLoaded', () => {
    const ajaxSend = (formData) => {
        fetch('http://exam-2020-1-api.std-400.ist.mospolytech.ru/api/data1', { // файл-обработчик 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                 "Accept": "application/json", // отправляемые данные 
            },
            body: JSON.stringify(formData)
        })
            .then(response => alert('Сообщение отправлено'))
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

function getPagination(table) {
  var lastPage = 1;
  $('#maxRows')
  .on('change', function(evt) {
    //$('.paginationprev').html('');						// reset pagination
  
   lastPage = 1;
    $('.pagination')
      .find('li')
      .slice(1, -1)
      .remove();
    var trnum = 0; // reset tr counter
    var maxRows = parseInt($(this).val()); // get Max Rows from select option
  
    if (maxRows == 5000) {
      $('.pagination').hide();
    } else {
      $('.pagination').show();
    }
  
    var totalRows = $(table + ' tbody tr').length; // numbers of rows
    $(table + ' tr:gt(0)').each(function() {
      // each TR in  table and not the header
      trnum++; // Start Counter
      if (trnum > maxRows) {
        // if tr number gt maxRows
  
        $(this).hide(); // fade it out
      }
      if (trnum <= maxRows) {
        $(this).show();
      } // else fade in Important in case if it ..
    }); //  was fade out to fade it in
    if (totalRows > maxRows) {
      // if tr total rows gt max rows option
      var pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
      //	numbers of pages
      for (var i = 1; i <= pagenum; ) {
        // for each page append pagination li
        $('.pagination #prev')
          .before(
            '<li class=" page-item" data-page="' +
              i +
              '">\
                <span class="page-link">' +
              i++ +
              '<span class="sr-only page-link">(current)</span></span>\
              </li>'
          )
          .show();
      } // end for i
    } // end if row count > max rows
    $('.pagination [data-page="1"]').addClass('active'); // add active class to the first li
    $('.pagination li').on('click', function(evt) {
      // on click each page
      evt.stopImmediatePropagation();
      evt.preventDefault();
      var pageNum = $(this).attr('data-page'); // get it's number
  
      var maxRows = parseInt($('#maxRows').val()); // get Max Rows from select option
  
      if (pageNum == 'prev') {
        if (lastPage == 1) {
          return;
        }
        pageNum = --lastPage;
      }
      if (pageNum == 'next') {
        if (lastPage == $('.pagination li').length - 2) {
          return;
        }
        pageNum = ++lastPage;
      }
  
      lastPage = pageNum;
      var trIndex = 0; // reset tr counter
      $('.pagination li').removeClass('active'); // remove active class from all li
      $('.pagination [data-page="' + lastPage + '"]').addClass('active'); // add active class to the clicked
      // $(this).addClass('active');					// add active class to the clicked
    limitPagging();
      $(table + ' tr:gt(0)').each(function() {
        // each tr in table not the header
        trIndex++; // tr index counter
        // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
        if (
          trIndex > maxRows * pageNum ||
          trIndex <= maxRows * pageNum - maxRows
        ) {
          $(this).hide();
        } else {
          $(this).show();
        } //else fade in
      }); // end of for each tr in table
    }); // end of on click pagination list
  limitPagging();
  })
  .val(20)
  .change();
  
  // end of on select change
  
  // END OF PAGINATION
  }
  
        function limitPagging(){
  // alert($('.pagination li').length)
  
  if($('.pagination li').length > 7 ){
    if( $('.pagination li.active').attr('data-page') <= 3 ){
    $('.pagination li:gt(5)').hide();
    $('.pagination li:lt(5)').show();
    $('.pagination [data-page="next"]').show();
  }if ($('.pagination li.active').attr('data-page') > 3){
    $('.pagination li:gt(0)').hide();
    $('.pagination [data-page="next"]').show();
    for( let i = ( parseInt($('.pagination li.active').attr('data-page'))  -2 )  ; i <= ( parseInt($('.pagination li.active').attr('data-page'))  + 2 ) ; i++ ){
      $('.pagination [data-page="'+i+'"]').show();
  
    }
  
  }
  }
  }
        $(function() {
  // Just to append id number for each row
  $('table tr:eq(0)').prepend('<th class="d-none"> ID </th>');
  
  var id = 0;
  
  $('table tr:gt(0)').each(function() {
  id++;
  $(this).prepend('<td class="d-none">' + id + '</td>');
  });
  });