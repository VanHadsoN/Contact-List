import type { Contact } from "./types";

// массив контактов с функцией загрузки из localStorage
function initContacts(): Contact[] {
    const savedContacts = localStorage.getItem('contacts');
    console.log('🔍 INIT CONTACTS: Saved contacts:', savedContacts);

    if (savedContacts) {
        try {
            const parsedContacts = JSON.parse(savedContacts);
            console.log('🔍 INIT CONTACTS: Parsed contacts:', parsedContacts);
            return parsedContacts;
        } catch (error) {
            console.log('🚨 Error parsing contacts:', error);
            return [];
        }
    }
    return [];
}

// экспортируем массив с инициализацией
export let contacts: Contact[] = initContacts();
