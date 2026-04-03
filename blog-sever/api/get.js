export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { file } = req.query;
  if (!file) return res.status(400).json([]);

  const OWNER = "tjh0614";
  const REPO = "tjh0614.github.io";
  const TOKEN = process.env.GITHUB_TOKEN;

  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${file}`;
    const r = await fetch(url, {
      headers: { Authorization: `token ${TOKEN}` }
    });
    if (!r.ok) return res.json([]);
    const d = await r.json();
    const content = JSON.parse(decodeURIComponent(escape(atob(d.content))));
    return res.json(content);
  } catch (e) {
    return res.json([]);
  }
}
