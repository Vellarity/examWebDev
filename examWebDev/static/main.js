$('#delete-film-modal').on('show.bs.modal', function (event) {
    let url = event.relatedTarget.dataset.url;
    let form = this.querySelector('form'); 
    form.action = url;
    let filmName = event.relatedTarget.closest('tr').querySelector('.film-name').textContent;
    this.querySelector('#film-name').textContent = filmName;
  })

  $('#delete-compilation-modal').on('show.bs.modal', function (event) {
    let url = event.relatedTarget.dataset.url;
    let form = this.querySelector('form'); 
    form.action = url;
    let compilationName = event.relatedTarget.closest('tr').querySelector('.compilation-name').textContent;
    this.querySelector('#compilation-name').textContent = compilationName;
  })

  $('#add_to_compilation').on('show.bs.modal', function (event) {
    let url = event.relatedTarget.dataset.url;
    let form = this.querySelector('form'); 
    form.action = url;
  })

  $('#delete_from_compilation').on('show.bs.modal', function (event) {
    let url = event.relatedTarget.dataset.url;
    let form = this.querySelector('form'); 
    form.action = url;
    let filmName = event.relatedTarget.closest('tr').querySelector('.film-name').textContent;
    this.querySelector('#film-name').textContent = filmName;
  })