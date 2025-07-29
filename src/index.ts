import './styles.css';

import { contacts, addContact, groupByLetter, updateLetterCounts, Contact } from './contacts/index';

const form = document.getElementById('contact-form') as HTMLFormElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const vacancyInput = document.getElementById('vacancy') as HTMLInputElement;
const phoneInput = document.getElementById('phone') as HTMLInputElement;
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

        const groupedContacts = groupByLetter(contacts);
        console.log('Grouped contacts:', groupByLetter);

        nameInput.value = '';
        vacancyInput.value = '';
        phoneInput.value = '';
    } else {
        console.warn('❌ Error:', result);
    }
});