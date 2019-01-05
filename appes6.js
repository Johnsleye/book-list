class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}


class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');

    const row = document.createElement('tr');

    //Insert columns
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class ="delete">X</a></td>
  `;

    list.appendChild(row);

  }

  showAlert(message, className) {
    //Create Div to show the error
    const div = document.createElement('div');
    //Add class
    div.className = `alert ${className}`;
    //Add text
    div.appendChild(document.createTextNode(message));
    //Get parent
    const container = document.querySelector('.container');
    //Get form
    const form = document.querySelector('#book-form');
    //Insert alert
    container.insertBefore(div, form);

    //Clear alert after 3 seconds
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);

  }

  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();

    }

  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

}

//Local Storage Class
class Store {

  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
       books = [];
    }else{
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book)  {
      const ui = new UI;

      //Add book to UI
      ui.addBookToList(book);
      
    });

  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    
    localStorage.setItem('books', JSON.stringify(books));

  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    
    books.forEach(function(book, index)  {
      const ui = new UI;

      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));

  }
}

//DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//Event Listner for add book
document.getElementById('book-form').addEventListener('submit', function(event) {

  //Get form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    //instatiating book constructor
    const book = new Book(title, author, isbn);

    //Instatiate UI object
    const ui = new UI();

    //Validate entries
    if(title === '' || author === '' || isbn === ''){
      //Error alert
      ui.showAlert('Please fill all fields', 'error');
    }else{

      //Add book to list
    ui.addBookToList(book);

    //Add to local storage
    Store.addBook(book);
    
    //show success alert
    ui.showAlert('Book Added Successfully', 'success');

    //Clear fields
    ui.clearFields();

    }

    event.preventDefault();
});

//Event listener for delete
document.getElementById('book-list').addEventListener('click', function(event) {

  //Instatiate UI object
  const ui = new UI();

  //Delete book
  ui.deleteBook(event.target);

  //Remove from Local Storage
  Store.removeBook(event.target.parentElement.previousElementSibling.textContent);

  //Show an alert
  ui.showAlert('Book Removed', 'success');

  event.preventDefault();
});

