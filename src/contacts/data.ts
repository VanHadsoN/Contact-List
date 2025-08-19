import type { Contact } from "./types";

// массив контактов
export let contacts: Contact[] = [];

export function getContacts() {
    return contacts;
}

export function setContacts(newContacts: Contact[]) {
    contacts = newContacts;
}