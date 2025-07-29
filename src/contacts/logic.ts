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
    console.log('Updating letter counts:', contacts.length);
    // берём все блоки букв
    const letterBlocks = document.querySelectorAll<HTMLDivElement>('.letter-block');

    // NodeList преобразуется в массив с явным указанием типа
    Array.from(letterBlocks).forEach((block) => {
        const letter = block.getAttribute('.data-letter');
        block.textContent = letter || '';
    })

    // контакты группируются по первой букве
    const groupedContacts = contacts.reduce((acc, contact) => {
        const firstLetter = contact.name[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = 0;
        }
        acc[firstLetter]++;
        return acc;
    }, {} as Record<string, number>);

    // обновляются блоки  буквами
    Object.entries(groupedContacts).forEach(([letter, count]) => {
        const letterBlock = document.querySelector<HTMLDivElement>(`.letter-block[data-letter="${letter}"]`);
        if (letterBlock) {
            letterBlock.textContent = `${letter} (${count})`;
        }
    });
}