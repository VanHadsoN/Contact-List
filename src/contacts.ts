// тип одного контакта
export type Contact = {
    name: string;
    vacancy: string;
    phone: string;
};

// тип группировки по первой букве имени name
export type ContactsMap = {
    [letter: string]: Contact[];
};

// массив контактов
let contacts: Contact[] = [];

// функция добавления контакта
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