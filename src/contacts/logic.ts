import { contacts } from "./data";
import type { Contact, ContactsMap } from "./types";

// загрузка контактов из LocalStorage
export function loadContactsFromLocalStorage() {
    console.log('🔍 LOAD CONTACTS: Start');
    console.log('Current contacts before load:', contacts);

    // явная синхронизация с localStorage
    const savedContacts = localStorage.getItem('contacts');

    console.log('Saved contacts:', savedContacts);

    if (savedContacts) {
        try {
            const parsedContacts = JSON.parse(savedContacts);
            console.log('🔍 LOAD CONTACTS: Parsed contacts:', parsedContacts);

            // полная замена массива
            contacts.length = 0;
            contacts.push(...parsedContacts);
        } catch (error) {
            console.log('🚨 Error parsing contacts:', error);
            localStorage.removeItem('contacts');
        }
    }

    console.log('🔍 LOAD CONTACTS: After load:', contacts);
    updateLetterCounts(contacts);
    console.log('🔍 LOAD CONTACTS: End');
}

// сохранение контактов в LocalStorage
export function saveContactsToLocalStorage() {
    console.log('💾 SAVE CONTACTS: Start');
    console.log('💾 Contacts to save:', [...contacts]);

    if (contacts.length > 0) {
        localStorage.setItem('contacts', JSON.stringify(contacts));
    } else {
        localStorage.removeItem('contacts');
    }
    console.log('💾 SAVE CONTACTS: End');
}

// функция добавляет новый контакт, валидирует и проверяет дубликаты
export function addContact(contact: Contact): Contact {
    console.log('➕ ADD CONTACT: Start');
    console.log('➕ Contact to add:', contacts);
    console.log('➕ Current contacts:', [...contacts]);

    contacts.push(contact); // явно добавляем в массив contacts

    console.log('➕ Contacts after add:', [...contacts]);

    // обновляем счётчики букв
    saveContactsToLocalStorage();
    updateLetterCounts(contacts);

    console.log('➕ ADD CONTACT: End');
    return contact;
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
    console.log('📊 UPDATE LETTER COUNTS: Start');
    console.log('📊 Total contacts:', contacts.length);
    console.log('📊 Actual contacts:', [...contacts]);

    // получаем все блоки букв
    const letterBlocks = document.querySelectorAll('.alphabet-list .letter-block');

    // если контактов нет - сбрасываем все блоки
    if (contacts.length === 0) {
        letterBlocks.forEach((block) => {
            const letter = block.getAttribute('data-letter');
            block.textContent = letter || '';
        });
        return;
    }

    // // контакты группируются по первой букве
    // const groupedContacts = contacts.reduce((acc, contact) => {
    //     const firstLetter = contact.name[0].toUpperCase();
    //     console.log('Processing contact:', contact.name, 'First letter:', firstLetter);
    //
    //     if (!acc[firstLetter]) {
    //         acc[firstLetter] = 0;
    //     }
    //     acc[firstLetter]++;
    //     return acc;
    // }, {} as Record<string, number>);
    //
    // console.log('Grouped contacts:', groupedContacts);

    // подсчет контактов по буквам
    const letterCounts: Record<string, number> = {};
    contacts.forEach(contact => {
        const firstLetter = contact.name[0].toUpperCase();
        letterCounts[firstLetter] = (letterCounts[firstLetter] || 0) + 1;
    });

    // обновляются блоки с буквами
    letterBlocks.forEach((block) => {
        const letter = block.getAttribute('data-letter');
        if (letter) {
            const count = letterCounts[letter] || 0;
            block.textContent = count > 0 ? `${letter} (${count})` : letter;
        }
    });
    console.log('📊 UPDATE LETTER COUNTS: End');
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
    console.log('🗑️ DELETE CONTACT: Start');
    console.log('🗑️ Contact to delete:', contactToDelete);
    console.log('🗑️ Current contacts:', [...contacts]);

    // явный поиск по всем параметрам
    const index = contacts.findIndex(
        contact =>
            // contact.name === contactToDelete.name &&
            // contact.phone === contactToDelete.phone &&
            contact.id === contactToDelete.id
    );

    if (index !== -1) {
        console.log('🗑️ Contact found. Removing...');

        // удаляем контакт
        contacts.splice(index, 1);

        console.log('🗑️ Contacts after deletion:', [...contacts]);

        // явное обновление LocalStorage
        saveContactsToLocalStorage();

        updateLetterCounts(contacts);
    } else {
        console.warn('🗑️ Contact not found for deletion');
    }
    console.log('🗑️ DELETE CONTACT: End');
}

export function editContact(oldContact: Contact, newContactData: Contact): string | null {
    const index = contacts.findIndex(
        contact =>
            contact.name === oldContact.name &&
            contact.phone === oldContact.phone &&
            contact.id === oldContact.id
    );

    if (index === -1) return "Contact not found";

    // валидация
    const trimmedName = newContactData.name.trim();
    const trimmedPhone = newContactData.phone.trim();

    if (trimmedName.length === 0) return "Name cannot be empty";
    if (trimmedPhone.length === 0) return "Phone cannot be empty";

    // обновляем контакт, сохраняя прежний ID
    contacts[index] = {
        id: oldContact.id,
        name: trimmedName,
        vacancy: newContactData.vacancy.trim(),
        phone: trimmedPhone
    };

    saveContactsToLocalStorage();
    updateLetterCounts(contacts);
    return null; // при успешном редактировании
}

export function getContactsByLetter(contact: Contact[], letter: string): Contact[] {
    return contacts.filter(contact =>
        contact.name[0].toUpperCase() === letter.toUpperCase()
    );
}