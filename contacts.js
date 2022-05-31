const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');

const contactsPath = path.join(__dirname, 'db/contacts.json');

const Error = {
  INVALID_ID: 'No contact with such ID.',
};

const write = async payload => {
  await fs.writeFile(contactsPath, JSON.stringify(payload, null, 2));
};

/**
 * Returns all contacts from DB.
 */
const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
};

/**
 * Returns contact with the specified ID.
 */
const getContactById = async contactId => {
  const contacts = await listContacts();
  const goal = contacts.find(contact => contact.id === contactId);
  return goal || Error.INVALID_ID;
};

/**
 * Removes contact with the specified ID.
 */
const removeContact = async contactId => {
  const contacts = await listContacts();
  for (let i = 0; i < contacts.length; i += 1) {
    if (contacts[i].id === contactId) {
      const removed = contacts.splice(i, 1).at(0);
      await write(contacts);
      return removed;
    }
  }
  return Error.INVALID_ID;
};

/**
 * Adds contact with specified params.
 * Generates new id automatically.
 */
const addContact = async (name, email, phone) => {
  const contacts = await listContacts();
  const payload = { id: nanoid(), name, email, phone };
  contacts.push(payload);
  await write(contacts);
  return payload;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
