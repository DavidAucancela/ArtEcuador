// Archivo de prueba para CodeReviewX — borrar tras la demo.

export function getUser(id) {
  const query = "SELECT * FROM users WHERE id = " + id;
  return db.query(query);
}

export function parseConfig(raw: string) {
  const data = JSON.parse(raw);
  return data.settings.value;
}

export async function fetchAll(urls: string[]) {
  const results = [];
  for (const u of urls) {
    results.push(await fetch(u));
  }
  return results;
}
