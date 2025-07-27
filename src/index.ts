import { contacts, addContact, groupByLetter, Contact } from './contacts/index';

const nameInput = document.querySelector<HTMLInputElement>('#name')!;
const vacancyInput = document.querySelector<HTMLInputElement>('#vacancy')!;
const phoneInput = document.querySelector<HTMLInputElement>('#phone')!;
const addButton = document.querySelector<HTMLButtonElement>('#add-button')!;

addButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const vacancy = vacancyInput.value.trim();
    const phone = phoneInput.value.trim();

    // валидация
    if (!name || !vacancy || !phone) {
        console.warn('All fields are required');
        return;
    }

    addContact( { name, vacancy, phone } );

    console.log('Current contact list:', contacts);

    nameInput.value = '';
    vacancyInput.value = '';
    phoneInput.value = '';
});