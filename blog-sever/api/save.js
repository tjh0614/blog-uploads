export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { file, data } = req.body;
  if (!file || !data) return res.status(400).json({ ok: false });

  const OWNER = "tjh0614";
  const REPO = "tjh0614.github.io";
  const TOKEN = process.env.GITHUB_TOKEN;
  let sha = null;

  try {
    // 获取文件sha
    const check = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${file}`, {
      headers: { Authorization: `token ${TOKEN}` }
    });
    if (check.ok) {
      const d = await check.json();
      sha = d.sha;
    }

    // 编码内容
    const str = JSON.stringify(data, null, 2);
    const b64 = btoa(unescape(encodeURIComponent(str)));

    // 提交GitHub
    await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${file}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "访客提交内容自动同步",
        content: b64,
        branch: "main",
        sha
      })
    });
    return res.json({ ok: true });
  } catch (e) {
    return res.json({ ok: false });
  }
}
