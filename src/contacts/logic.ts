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
    // получаем все блоки букв
    const letterBlocks = document.querySelectorAll('.alphabet-list .letter-block');

    console.log('Total letter blocks:', letterBlocks.length);


    // сбрасываем текст для всех блоков до изначального состояния
    letterBlocks.forEach((block) => {
        const letter = block.getAttribute('data-letter');
        block.textContent = letter || '';
    });

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