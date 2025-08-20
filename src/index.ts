import './styles.css';

import {
    contacts,
    addContact,
    searchContacts,
    deleteContact,
    editContact,
    groupByLetter,
    updateLetterCounts,
    clearContacts,
    loadContactsFromLocalStorage,
    saveContactsToLocalStorage,
    Contact
} from './contacts/index';

const form = document.getElementById('contact-form') as HTMLFormElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const vacancyInput = document.getElementById('vacancy') as HTMLInputElement;
const phoneInput = document.getElementById('phone') as HTMLInputElement;
const clearButton = document.getElementById('clear-btn') as HTMLButtonElement; // Получаем кнопку Clear List
// const addButton = document.querySelector<HTMLButtonElement>('#add-btn')!;

document.addEventListener('DOMContentLoaded', () => {
    try {
        loadContactsFromLocalStorage(); // загрузка контактов при старте приложения
        updateLetterCounts(contacts);
    } catch (error) {
        console.error('Error during initial load:', error);
        // отображение ошибки пользователю
        const errorElement = document.createElement('div');
        errorElement.textContent = 'An error occurred while loading contacts. Please refresh the page or check your browser settings.';
        errorElement.style.color = 'red';
        document.body.insertBefore(errorElement, document.body.firstChild);
    }
    // добавление контакта
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

        try {
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
        } catch (error) {
            console.error('Error adding contact:', error);
            // Отображение ошибки пользователю
            const errorMsg = document.createElement('div');
            errorMsg.classList.add('error-message');
            errorMsg.textContent = 'An error occurred while adding the contact. Please try again.';
            form.appendChild(errorMsg);
        }
    });

    clearButton.addEventListener('click', () => {
        try {
            clearContacts(); // вызываем функцию очистки контактов
            updateLetterCounts(contacts); // обновляем счетчики букв после очистки
            saveContactsToLocalStorage();
        } catch (error) {
            console.error('Error clearing contacts:', error);
            // Отображение ошибки пользователю
            const errorElement = document.createElement('div');
            errorElement.classList.add('error-message');
            errorElement.textContent = 'An error occurred while clearing contacts. Please try again.';
            form.appendChild(errorElement);
        }
    });

    // модальное окно поиска
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
                if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
                    deleteContact(contact);
                    resultItem.remove();
                    updateLetterCounts(contacts);
                    // сохраняем в localStorage после удаления
                    saveContactsToLocalStorage();
                }
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

    // получаем модальное окно и элемент для отображения контактов
    const letterContactsModal = document.getElementById('letter-contacts-modal')!;
    const letterContactsList = document.getElementById('letter-contacts-list')!;
    const modalLetter = document.getElementById('modal-letter')!;

    // функция для отображения модального окна с контактами по букве
    function showContactsByLetter(letter: string) {
        const filteredContacts = contacts.filter(contact => contact.name[0].toUpperCase() === letter);

        modalLetter.textContent = letter; // устанавливаем букву в заголовок h2 модального окна
        letterContactsList.innerHTML = ''; // очистка предыдущего содержимого

        if (filteredContacts.length === 0) {
            letterContactsList.innerHTML = '<p>No contacts found.</p>';
        } else {
            filteredContacts.forEach(contact => {
                const contactItem = document.createElement('div');
                contactItem.classList.add('letter-contacts-item');
                contactItem.innerHTML = `
                    <span>${contact.name} - ${contact.vacancy} - ${contact.phone}</span>
                    <button class="delete-contact-btn"><i class="fas fa-trash"></i></button>
                `;
                const deleteButton = contactItem.querySelector('.delete-contact-btn')!;
                deleteButton.addEventListener('click', () => {
                    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
                        deleteContact(contact);
                        contactItem.remove();
                        updateLetterCounts(contacts);
                        saveContactsToLocalStorage();
                        // проверяем, остались ли еще контакты после удаления
                        if (letterContactsList.children.length === 0) {
                            letterContactsModal.classList.add('hidden');
                        }
                    }
                });
                letterContactsList.appendChild(contactItem);
            });
        }

        // открытие модального окна
        letterContactsModal.classList.remove('hidden');
    }

    // закрытие модального окна
    document.querySelectorAll('.close-modal').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            letterContactsModal.classList.add('hidden');
        });
    });

    // обработка кликов на блоки с буквами
    document.querySelectorAll('.letter-block').forEach(block => {
        block.addEventListener('click', (e) => {
            console.log('Click event detected on letter block:', e.target);
            const letter = (e.target as HTMLElement).textContent?.trim();
            console.log('Extracted letter:', letter);
            if (letter && letter.length === 1) {
                console.log('Calling showContactsByLetter with:', letter.toUpperCase());
                showContactsByLetter(letter.toUpperCase());
            }
        });
    });
});