// тип одного контакта
export type Contact = {
    name: string;
    vacancy: string;
    phone: string;
};

// тип группировки по первой букве имени name
export type ContactsMap = {
    [letter: string]: Contact[]; // объект, где ключ - это буква (A, B, C…), а значение - массив контактов
};