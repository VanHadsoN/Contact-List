import './styles.css';

import {
    contacts,
    loadContactsFromLocalStorage,
    addContact,
    searchContacts,
    deleteContact,
    editContact,
    groupByLetter,
    updateLetterCounts,
    clearContacts,
    getContactsByLetter,
    Contact
} from './contacts/index';

const form = document.getElementById('contact-form') as HTMLFormElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const vacancyInput = document.getElementById('vacancy') as HTMLInputElement;
const phoneInput = document.getElementById('phone') as HTMLInputElement;
const clearButton = document.getElementById('clear-btn') as HTMLButtonElement; // Получаем кнопку Clear List
// const addButton = document.querySelector<HTMLButtonElement>('#add-btn')!;

document.addEventListener('DOMContentLoaded', () => {
    loadContactsFromLocalStorage(); // загружаем контакты при старте приложения
});

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку формы

    // сбрасываем предыдущие ошибки
    const previousErrorMessages = document.querySelectorAll('.error-message');
    Array.from(previousErrorMessages).forEach(el => el.remove());

    nameInput.classList.remove('error-input');
    vacancyInput.classList.remove('error-input');
    phoneInput.classList.remove('error-input');

    const name = nameInput.value.trim();
    const vacancy = vacancyInput.value.trim();
    const phone = phoneInput.value.trim();

    let hasErrors = false;

    // валидация имени (только буквы)
    const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s]+$/;
    if (name.length < 2 || !nameRegex.test(name)) {
        nameInput.classList.add('error-input');
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('error-message');
        errorMsg.textContent = 'The name must contain only letters and be at least 2 characters long';
        nameInput.after(errorMsg);
        hasErrors = true;
    }

    // валидация должности (только буквы)
    const vacancyRegex = /^[а-яА-ЯёЁa-zA-Z\s]+$/;
    if (vacancy.length > 0 && !vacancyRegex.test(vacancy)) {
        vacancyInput.classList.add('error-input');
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('error-message');
        errorMsg.textContent = 'The vacancy should only contain letters.';
        vacancyInput.after(errorMsg);
        hasErrors = true;
    }

    // валидация телефона
    const phoneRegex = /^\+?7\d{10}$/;
    if (!phoneRegex.test(phone)) {
        phoneInput.classList.add('error-input');
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('error-message');
        errorMsg.textContent = 'Enter the number with the format +7XXXXXXXXXX';
        phoneInput.after(errorMsg);
        hasErrors = true;
    }

    // проверка на дубликаты
    const isDuplicate = contacts.some(contact =>
        contact.phone === phone
    );
    if (isDuplicate) {
        phoneInput.classList.add('error-input');
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('error-message');
        errorMsg.textContent = 'Such phone number is already exists.';
        phoneInput.after(errorMsg);
        hasErrors = true;
    }

    // если есть ошибки, то контакт не добавляется
    if (hasErrors) {
        return;
    }

    const result = addContact({name, vacancy, phone});

    if (result === null) {
        console.log('✅ Contact successfully added');

        const groupedContacts = groupByLetter(contacts);
        console.log('Grouped contacts:', groupedContacts);

        nameInput.value = '';
        vacancyInput.value = '';
        phoneInput.value = '';
        updateLetterCounts(contacts);
    } else {
        console.warn('❌ Error:', result);
        // показываем ошибку пользователю, если контакт не добавлен
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('error-message');
        errorMsg.textContent = result;
        phoneInput.after(errorMsg);
    }
});

// инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateLetterCounts(contacts);
});

clearButton.addEventListener('click', () => {
    clearContacts(); // вызываем функцию очистки контактов
    updateLetterCounts(contacts); // обновляем счетчики букв после очистки
});

// модальное окно
const searchModal = document.getElementById('search-modal')!;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const searchResultsContainer = document.getElementById('search-results')!;
const searchBtn = document.getElementById('search-btn')!;
const closeModalBtn = document.querySelector('.close-modal')!;

// открытие модального окна
searchBtn.addEventListener('click', () => {
    searchModal.classList.remove('hidden');
});

// закрытие модального окна
closeModalBtn.addEventListener('click', () => {
    searchModal.classList.add('hidden');
});

// поиск
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();

    // Если строка пустая, очищаем результаты
    if (query === '') {
        searchResultsContainer.innerHTML = '';
        return;
    }

    const results = searchContacts(query);

    // очистка предыдущих результатов
    searchResultsContainer.innerHTML = '';

    // отображение результатов
    results.forEach(contact => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('search-result-item');
        resultItem.innerHTML = `
            <span class="contact-info">${contact.name} - ${contact.vacancy} - ${contact.phone}</span>
            <div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
    // логика удаления
    const deleteButton = resultItem.querySelector('.delete-btn')!;
        deleteButton.addEventListener('click', () => {
        deleteContact(contact); // передаем конкретный контакт для удаления
        resultItem.remove();
        updateLetterCounts(contacts);
    });

   // логика редактирования
   const editButton = resultItem.querySelector('.edit-btn')!;
   editButton.addEventListener('click', () => {
       const contactInfoSpan = resultItem.querySelector('.contact-info')!;

       // меняем текст на инпуты
       contactInfoSpan.innerHTML = `
            <input type="text" class="edit-name" value="${contact.name}">
            <input type="text" class="edit-vacancy" value="${contact.vacancy}">
            <input type="text" class="edit-phone" value="${contact.phone}">
            <button class="save-edit-btn">Save</button>
       `;

       const saveEditBtn = resultItem.querySelector('.save-edit-btn')!;
       saveEditBtn.addEventListener('click', () => {
           const editedName = (resultItem.querySelector('.edit-name') as HTMLInputElement).value;
           const editedVacancy = (resultItem.querySelector('.edit-vacancy') as HTMLInputElement).value;
           const editedPhone = (resultItem.querySelector('.edit-phone') as HTMLInputElement).value;

           const editResult = editContact(contact, {
               name: editedName,
               vacancy: editedVacancy,
               phone: editedPhone
           });

           if (editResult === null) {
               // успешное редактирование
               contactInfoSpan.textContent = `${editedName} - ${editedVacancy} - ${editedPhone}`;
               updateLetterCounts(contacts);
           } else {
               alert(editResult);
           }
       });
   });

   searchResultsContainer.appendChild(resultItem);
  });
});

// обработчик модального окна для вывода контактов
function createLetterContactModal(contacts: Contact[]) {
    // создаём модальное окно
    const modal = document.createElement('div');
    modal.className = 'letter-contacts-modal';

    // генерируем список контактов
    const contactsList = contacts.map(contact => `
        <div class="letter-contacts-item">
          <div class="contact-details">
            <div>Name: ${contact.name}</div>
            <div>Vacancy: ${contact.vacancy}</div>
            <div>Phone: ${contact.phone}</div>
          </div>
          <button class="delete-contact-btn" data-id="${contact.id}">x</button>
        </div>
    `).join('');

    modal.innerHTML = `
        <div class="letter-contacts-modal-content">
          ${contactsList}
        </div>>
    `;

    // добавляем в body
}