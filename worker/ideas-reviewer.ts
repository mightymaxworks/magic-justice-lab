export const reviewerPage = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MAGIC Ideas reviewer · Synthetic test</title>
<style>
  body{margin:0;background:#080e22;color:#edf1ff;font:16px system-ui,sans-serif}
  main{max-width:740px;margin:auto;padding:clamp(20px,6vw,64px)}
  h1,h2,p{margin:0 0 16px} h1{font-size:clamp(28px,6vw,48px)}
  section,article{border:1px solid #d8b87955;border-radius:12px;background:#121c39;padding:20px;margin:16px 0}
  button,input,select{font:inherit;padding:10px 12px;border-radius:6px;border:1px solid #aeb9d1}
  input,select{max-width:100%;background:#080e22;color:#edf1ff;box-sizing:border-box}
  button{background:#d8b879;color:#11192e;font-weight:700;cursor:pointer;margin:6px 6px 0 0}
  :focus-visible{outline:3px solid #f1d395;outline-offset:3px}
  label{display:grid;gap:6px;margin-bottom:12px}
  [role=status]{color:#e4c78f}
</style>
<main>
  <h1>MAGIC Ideas reviewer</h1>
  <p>Synthetic test queue. Use fictional submissions.</p>
  <section id="access">
    <form id="unlock">
      <label>Local reviewer token <input id="token" type="password" required autocomplete="off"></label>
      <button>Open test queue</button>
    </form>
  </section>
  <p id="notice" role="status"></p>
  <section id="queue" hidden>
    <h2>Review queue</h2>
    <button id="submit" type="button">Create fictional submission</button>
    <button id="verify" type="button" hidden>Simulate email verification</button>
    <button id="refresh" type="button">Refresh queue</button>
    <div id="entries"></div>
    <button id="next" type="button" hidden>Next page</button>
  </section>
</main>
<script>
  const get = id => document.getElementById(id);
  const base = "/api/ideas/test-queue";
  let token = "";
  let pending;
  let cursor;
  async function request(path, options = {}) {
    const result = await fetch(base + path, { ...options, headers: { Authorization: "Bearer " + token, ...options.headers } });
    const body = await result.json();
    if (!result.ok) throw new Error(body.error || "The request failed");
    return body;
  }
  function action(handler) {
    return async event => {
      event.preventDefault();
      get("notice").textContent = "";
      try { await handler(); }
      catch (error) { get("notice").textContent = error.message; }
    };
  }
  async function render(after) {
    const page = await request(after ? "?cursor=" + encodeURIComponent(after) : "");
    get("entries").replaceChildren();
    cursor = page.cursor;
    get("next").hidden = !cursor;
    if (page.submissions.length === 0) get("entries").textContent = "No verified submissions on this page.";
    for (const entry of page.submissions) {
      const card = document.createElement("article");
      const heading = document.createElement("h3");
      heading.textContent = entry.title;
      const description = document.createElement("p");
      description.textContent = entry.description;
      const contact = document.createElement("p");
      contact.textContent = "Verified test contact: " + entry.contactEmail;
      const label = document.createElement("label");
      label.textContent = "Review status";
      const select = document.createElement("select");
      for (const status of ["received", "follow-up", "shortlisted", "closed"]) {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        option.selected = status === entry.status;
        select.append(option);
      }
      label.append(select);
      const save = document.createElement("button");
      save.textContent = "Save status";
      save.onclick = action(async () => {
        await request("/" + entry.id + "/status?value=" + encodeURIComponent(select.value), {
          method: "PUT", headers: { "If-Match": entry.version },
        });
        await render(after);
        get("notice").textContent = "Review status saved.";
      });
      card.append(heading, description, contact, label, save);
      get("entries").append(card);
    }
  }
  get("unlock").onsubmit = action(async () => {
    token = get("token").value;
    await render();
    get("token").value = "";
    get("access").hidden = true;
    get("queue").hidden = false;
  });
  get("submit").onclick = action(async () => {
    pending = await request("/submit", { method: "POST" });
    get("submit").disabled = true;
    get("verify").hidden = false;
    get("notice").textContent = "Fictional submission created. Verify it to add it to the queue.";
  });
  get("verify").onclick = action(async () => {
    await request("/" + pending.id + "/verify", { method: "POST", headers: { "X-Test-Verification": pending.verification } });
    pending = undefined;
    get("verify").hidden = true;
    get("submit").disabled = false;
    await render();
    get("notice").textContent = "Verified. The submission is in the review queue.";
  });
  get("refresh").onclick = action(() => render());
  get("next").onclick = action(() => render(cursor));
</script>
</html>`;
