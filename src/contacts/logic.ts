import { contacts } from "./data";
import type { Contact, ContactsMap } from "./types";

// загрузка контактов из LocalStorage
export function loadContactsFromLocalStorage() {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
        contacts.splice(0, contacts.length, ...JSON.parse(savedContacts));
        console.log('Contacts loaded from localStorage:', contacts);
        updateLetterCounts(contacts);
    } else {
        console.log('There are no contacts in localStorage');
    }
}

// сохранение контактов в LocalStorage
export function saveContactsToLocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    console.log('Contacts loaded from localStorage:', contacts);
}

// функция добавляет новый контакт, валидирует и проверяет дубликаты
export function addContact(newContact: Contact): string | null {
    const { name, phone } = newContact;

    // проверка на дубликат по имени и телефону
    const isDublicate = contacts.some(
        (c) => c.phone === phone
    );
    if (isDublicate) {
        return 'Contact already exists';
    }
    contacts.push(newContact); // явно добавляем в массив contacts

    // обновляем счётчики букв
    updateLetterCounts(contacts);
    saveContactsToLocalStorage();

    return null; // значит ошибок не было
}
// функция полностью очищает список контактов
export function clearContacts() {
    contacts.length = 0; // полностью очищаем массив
    saveContactsToLocalStorage();
    updateLetterCounts(contacts);
}

// функция группирует контакты по первой букве имени - возвращает объект вида { A: [...], B: [...], ... }
export function groupByLetter(list: Contact[]): ContactsMap {
    const grouped: ContactsMap = {};
    const letterPattern = /^[A-Za-zА-Яа-яЁё]$/; // символ должен быть буквой

    for (const contact of list) {
        const rawLetter = contact.name.charAt(0);

        if (!rawLetter) continue; // пропускаем пустые имена

        const firstLetter = rawLetter.toUpperCase();

        if (!letterPattern.test(firstLetter)) continue; // пропускаем если первый символ не буква

        if (!grouped[firstLetter]) {
            grouped[firstLetter] = [];
        }

        grouped[firstLetter].push(contact);
    }
    return grouped;
}

// функция для обновления счетчиков букв
export function updateLetterCounts(contacts: Contact[]) {
    console.log('Updating letter counts:', contacts.length);
    // получаем все блоки букв
    const letterBlocks = document.querySelectorAll('.alphabet-list .letter-block');

    console.log('Total letter blocks:', letterBlocks.length);


    // сбрасываем текст для всех блоков до изначального состояния
    letterBlocks.forEach((block) => {
        const letter = block.getAttribute('data-letter');
        block.textContent = letter || '';
    });

    if (contacts.length === 0) { // Если список контактов пустой - выходим
        return;
    }

    // контакты группируются по первой букве
    const groupedContacts = contacts.reduce((acc, contact) => {
        const firstLetter = contact.name[0].toUpperCase();
        console.log('Processing contact:', contact.name, 'First letter:', firstLetter);

        if (!acc[firstLetter]) {
            acc[firstLetter] = 0;
        }
        acc[firstLetter]++;
        return acc;
    }, {} as Record<string, number>);

    console.log('Grouped contacts:', groupedContacts);

    // обновляются блоки  буквами
    Object.entries(groupedContacts).forEach(([letter, count]) => {
        const letterBlock = document.querySelector(`.alphabet-list .letter-block[data-letter="${letter}"]`);

        if (letterBlock) {
            console.log(`Updating letter block for ${letter} with count ${count}`);
            letterBlock.textContent = `${letter} (${count})`;
        } else {
            console.warn(`No letter blocks found for letter ${letter}`);
        }
    });
}

export function searchContacts(query: string): Contact[] {
    const lowerQuery = query.toLowerCase();
    console.log('Search query:', lowerQuery);


    const results = contacts.filter(contact => {
        console.log('Checking contact:', contact.name, 'Query:', lowerQuery);
        console.log('Name includes:', contact.name.toLowerCase().includes(lowerQuery));
        return contact.name.toLowerCase().includes(lowerQuery) ||
        contact.phone.includes(lowerQuery)
    });

    console.log('Search results:', results);
    return results;
}

export function deleteContact(contactToDelete: Contact): void {
    const index = contacts.findIndex(
        contact =>
            contact.name === contactToDelete.name &&
            contact.phone === contactToDelete.phone
    );

    if (index !== 1) {
        contacts.splice(index, 1);
        updateLetterCounts(contacts);
    }
}

export function editContact(oldContact: Contact, newContactData: Contact): string | null {
    const index = contacts.findIndex(
        contact =>
            contact.name === oldContact.name &&
            contact.phone === oldContact.phone
    );

    if (index === -1) return "Contact not found";

    // валидация
    const trimmedName = newContactData.name.trim();
    const trimmedPhone = newContactData.phone.trim();

    if (trimmedName.length === 0) return "Name cannot be empty";
    if (trimmedPhone.length === 0) return "Phone cannot be empty";

    // обновляем контакт
    contacts[index] = {
        name: trimmedName,
        vacancy: newContactData.vacancy.trim(),
        phone: trimmedPhone
    };

    saveContactsToLocalStorage();
    return null; // при успешном редактировании
}