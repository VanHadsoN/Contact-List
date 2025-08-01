import './styles.css';

import {
    contacts,
    addContact,
    searchContacts,
    deleteContact,
    groupByLetter,
    updateLetterCounts,
    clearContacts,
    Contact
} from './contacts/index';

const form = document.getElementById('contact-form') as HTMLFormElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const vacancyInput = document.getElementById('vacancy') as HTMLInputElement;
const phoneInput = document.getElementById('phone') as HTMLInputElement;
const clearButton = document.getElementById('clear-btn') as HTMLButtonElement; // Получаем кнопку Clear List
const addButton = document.querySelector<HTMLButtonElement>('#add-btn')!;

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку формы

    const name = nameInput.value.trim();
    const vacancy = vacancyInput.value.trim();
    const phone = phoneInput.value.trim();

    console.log('Attempt to add contact:', { name, vacancy, phone });

    const result = addContact({ name, vacancy, phone });

    if (result === null) {
        console.log('✅ Contact successfully added');
        console.log('Current list of contacts:', contacts);

        // // вызывается updateLetterCounts сразу после добавления контакта
        // updateLetterCounts(contacts);

        const groupedContacts = groupByLetter(contacts);
        console.log('Grouped contacts:', groupedContacts);

        nameInput.value = '';
        vacancyInput.value = '';
        phoneInput.value = '';
    } else {
        console.warn('❌ Error:', result);
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
    const results = searchContacts(query);

    // очистка предыдущих результатов
    searchResultsContainer.innerHTML = '';

    // отображение результатов
    results.forEach(contact => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('search-result-item');
        resultItem.innerHTML = `
            <span>${contact.name} - ${contact.vacancy} - ${contact.phone}</span>
            <div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
    // кнопка удаления
    const deleteButton = resultItem.querySelector('.delete-btn')!;
        deleteButton.addEventListener('click', () => {
        resultItem.remove();
        updateLetterCounts(contacts);
    });

    searchResultsContainer.appendChild(resultItem);
  });
});