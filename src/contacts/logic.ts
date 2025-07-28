import { contacts } from "./data";
import type { Contact, ContactsMap } from "./types";


// функция добавляет новый контакт, валидирует и проверяет дубликаты
export function addContact(newContact: Contact): string | null {
    const { name, vacancy, phone } = newContact;

    // валидация
    if (!name || !vacancy || !phone) {
        return 'All fields are required.';
    }

    // проверка на дубликат по имени и телефону
    const isDublicate = contacts.some(
        (c) => c.name.toLowerCase() === name.toLocaleLowerCase() && c.phone === phone
    );
    if (isDublicate) {
        return 'Contact already exists.';
    }
    contacts.push(newContact);
    return null; // значит ошибок не было
}

// функция возвращает текущий список контактов
export function getContacts(): Contact[] {
    return contacts;
}

// функция полностью очищает список контактов
export function clearContacts() {
    contacts.length = 0;
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
    // берём все блоки букв
    const letterBlocks = document.querySelector('.letter-block');

    // обнуляются счётчики

}