import { contacts } from "./data";
import type { Contact, ContactsMap } from "./types";


// функция добавляет новый контакт, валидирует и проверяет дубликаты
export function addContact(newContact: Contact): string | null {
    const { name, vacancy, phone } = newContact;

    // проверка на пустое значение
    if (!name || name.trim() === '') {
        return 'Name cannot be empty';
    }

    if (!vacancy || vacancy.trim() === '') {
        return 'Vacancy cannot be empty';
    }

    // проверка номера телефона
    const phoneRegex = /^\+\d\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return 'Phone number must be in format: +x xxx xxx xx xx';
    }

    // проверка на дубликат по имени и телефону
    const isDublicate = contacts.some(
        (c) => c.name.toLowerCase() === name.toLocaleLowerCase() && c.phone === phone
    );
    if (isDublicate) {
        return 'Contact already exists';
    }
    contacts.push(newContact); // явно добавляем в массив contacts

    // обновляем счётчики букв
    updateLetterCounts(contacts);

    return null; // значит ошибок не было
}

// функция возвращает текущий список контактов
export function getContacts(): Contact[] {
    return contacts;
}

// функция полностью очищает список контактов
export function clearContacts() {
    contacts.length = 0; // полностью очищаем массив
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

    return null; // при успешном редактировании
}