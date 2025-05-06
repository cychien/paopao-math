import { API_URL } from "./constants";
import { Contact } from "./types";

async function createContact(contact: Contact) {
  return fetch(`${API_URL}/contacts/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
    },
    body: JSON.stringify(contact),
  })
    .then(() => {
      return { success: true };
    })
    .catch((error) => {
      return {
        success: false,
        message: error.message,
      };
    });
}

export { createContact };
