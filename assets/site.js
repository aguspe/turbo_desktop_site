(() => {
  "use strict";

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    themeBtn.textContent = theme === "dark" ? "Light" : "Dark";
  };
  let theme = "dark";
  try { theme = localStorage.getItem("td:theme") || "dark"; } catch (_) {}
  applyTheme(theme);
  themeBtn.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    try { localStorage.setItem("td:theme", theme); } catch (_) {}
  });

  /* ---------- Syntax highlighting ---------- */
  // One combined alternation per language; group index -> class. Single pass,
  // so markup inserted for one token is never re-scanned by another rule.
  const HL = {
    ruby: { re: /(#[^\n]*)|("[^"\n]*")|\b(gem|def|end|do|class|module|config|get|to|true|false|nil)\b/g,
            cls: ["tok-com", "tok-str", "tok-kw"] },
    bash: { re: /(#[^\n]*)|\b(npx|npm|cargo|bin|cd|install|new|dev|build|server)\b/g,
            cls: ["tok-com", "tok-kw"] },
    json: { re: /("[^"\n]*")(?=\s*:)|("[^"\n]*")|\b(true|false|null)\b|\b(\d+)\b/g,
            cls: ["tok-key", "tok-str", "tok-kw", "tok-num"] },
    js:   { re: /(\/\/[^\n]*)|("[^"\n]*"|`[^`\n]*`)|\b(import|from|export|default|class|extends|const|let|if|await|return|new|super|this|console)\b/g,
            cls: ["tok-com", "tok-str", "tok-kw"] },
    erb:  { re: /(&lt;%#[^\n]*%&gt;)|("[^"\n]*")|\b(do|end)\b/g,
            cls: ["tok-com", "tok-str", "tok-kw"] }
  };

  document.querySelectorAll("pre[data-lang]").forEach((pre) => {
    const lang = HL[pre.dataset.lang];
    if (!lang) return;
    const esc = pre.textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    lang.re.lastIndex = 0;
    pre.innerHTML = esc.replace(lang.re, function () {
      const m = arguments[0];
      for (let i = 0; i < lang.cls.length; i++) {
        if (arguments[i + 1]) return '<span class="' + lang.cls[i] + '">' + m + "</span>";
      }
      return m;
    });
  });

  /* ---------- Copy buttons ---------- */
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pre = btn.parentElement.querySelector("pre");
      if (!pre) return;
      if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent);
      const prev = btn.textContent;
      btn.textContent = "copied";
      setTimeout(() => { btn.textContent = prev; }, 1400);
    });
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll("[data-tabs]").forEach((row) => {
    const group = row.dataset.tabs;
    row.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        row.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("active", b === btn));
        document.querySelectorAll('[data-panel^="' + group + ':"]').forEach((panel) => {
          panel.classList.toggle("active", panel.dataset.panel === group + ":" + btn.dataset.tab);
        });
      });
    });
  });

  /* ---------- Presentation demo ---------- */
  const PRES = {
    default:    { desc: "Navigate in the current window. Turbo Drive handles it exactly as it would in a browser." },
    modal:      { desc: "Open the URL in a modal-style window (800×600). Good for /new and /edit forms." },
    new_window: { desc: "Open the URL in a full separate window (1200×800) the user can move and keep open." },
    replace:    { desc: "Replace the current page with no back-navigation — for post-login or post-destroy redirects." },
    native:     { desc: "Emit a native-screen-requested event and let Rust render the screen. No web content is loaded." },
    none:       { desc: "Do nothing. A Bridge Component owns this interaction entirely." }
  };

  const demoWindow = document.getElementById("demo-window");
  const demoTitle = document.getElementById("demo-title");
  const demoUrl = document.getElementById("demo-url");
  const presName = document.getElementById("pres-name");
  const presDesc = document.getElementById("pres-desc");
  const presModes = document.getElementById("pres-modes");
  const presTable = document.getElementById("pres-table");

  const setPres = (key) => {
    demoWindow.dataset.pres = key;
    demoTitle.textContent = key === "native" ? "Settings — My App" : "My App";
    demoUrl.textContent = key === "replace" ? "/dashboard  ·  no back entry" : "/tasks";
    presName.textContent = key;
    presDesc.textContent = PRES[key].desc;
    presModes.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.pres === key));
  };

  Object.keys(PRES).forEach((key) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pres-btn";
    btn.dataset.pres = key;
    btn.textContent = key;
    btn.addEventListener("click", () => setPres(key));
    presModes.appendChild(btn);

    const row = document.createElement("div");
    row.className = "tbl-row";
    const k = document.createElement("div");
    k.className = "mono";
    k.textContent = key;
    const d = document.createElement("div");
    d.textContent = PRES[key].desc;
    row.append(k, d);
    presTable.appendChild(row);
  });
  setPres("modal");

  /* ---------- Scrollspy ---------- */
  const scroller = document.getElementById("td-article");
  const ids = Array.from(document.querySelectorAll("section[id]")).map((s) => s.id);
  const navLinks = Array.from(document.querySelectorAll(".nav-link, .toc-link"));
  let active = null;

  const spy = () => {
    const top = scroller.getBoundingClientRect().top;
    let cur = ids[0];
    for (const id of ids) {
      const s = document.getElementById(id);
      if (s && s.getBoundingClientRect().top - top <= 120) cur = id;
    }
    if (cur === active) return;
    active = cur;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
  };
  scroller.addEventListener("scroll", spy, { passive: true });
  spy();
})();
