import './styles.css';

import { contacts, addContact, groupByLetter, updateLetterCounts, clearContacts, Contact } from './contacts/index';

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