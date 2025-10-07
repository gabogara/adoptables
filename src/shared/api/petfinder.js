import { Client } from "@petfinder/petfinder-js";

let _client = null;

export function getPetfinderClient() {
  if (_client) return _client;

  const key = import.meta.env.VITE_PETFINDER_KEY;
  const secret = import.meta.env.VITE_PETFINDER_SECRET;

  if (!key || !secret) {
    console.warn(
      "Is missing VITE_PETFINDER_KEY / VITE_PETFINDER_SECRET in .env.local"
    );
    return null;
  }

  _client = new Client({ apiKey: key, secret });
  return _client;
}

export async function searchAnimals(params = {}) {
  const client = getPetfinderClient();
  if (!client) throw new Error("Petfinder credentials are not configured.");
  const res = await client.animal.search(params);
  return res.data; // { animals: [], pagination: {...} }
}

export async function getAnimalById(id) {
  const client = getPetfinderClient();
  if (!client) throw new Error("Petfinder credentials are not configured.");
  const res = await client.animal.show(id);
  return res.data; // { animal: {...} }
}
