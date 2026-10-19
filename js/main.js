/* ==========================================================================
   GLOSKA — לוגיקת העמוד
   1. החלפת שפה (עברית ⇄ אנגלית) כולל כיוון RTL/LTR ושמירת הבחירה
   2. תפריט מובייל
   3. אנימציית חשיפה בגלילה
   4. תמונת פורטרט — נפילה חזרה ללוגו אם הקובץ חסר
   ========================================================================== */
(function () {
  "use strict";

  var DICT = window.GLOSKA_I18N || {};
  var STORAGE_KEY = "gloska-lang";

  /* ---------- 1. שפה ---------- */
  function detectLang() {
    // עדיפות: פרמטר ?lang= בכתובת → בחירה שמורה → ברירת מחדל עברית
    var fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl && DICT[fromUrl]) return fromUrl;
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && DICT[saved]) return saved;
    } catch (e) { /* אחסון חסום — מתעלמים */ }
    return "he";
  }

  function applyLang(lang) {
    var t = DICT[lang];
    if (!t) return;
    var year = String(new Date().getFullYear());

    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;

    // טקסט רגיל
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (t[key] != null) el.textContent = t[key].replace("{year}", year);
    });
    // טקסט עם תגיות (em / strong)
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (t[key] != null) el.innerHTML = t[key].replace("{year}", year);
    });
    // מאפיינים (למשל content של meta)
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        var attr = parts[0], key = parts[1];
        if (t[key] != null) el.setAttribute(attr, t[key]);
      });
    });

    // כפתור השפה מציג את השפה *השנייה*
    var toggle = document.getElementById("langToggle");
    if (toggle) toggle.textContent = t["nav.langButton"];
    var burger = document.getElementById("navBurger");
    if (burger) burger.setAttribute("aria-label", t["nav.menu"]);

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* מתעלמים */ }
    document.documentElement.setAttribute("data-lang", lang);
  }

  var current = detectLang();
  applyLang(current);

  var langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", function () {
      current = current === "he" ? "en" : "he";
      applyLang(current);
    });
  }

  /* ---------- 2. תפריט מובייל ---------- */
  var burger = document.getElementById("navBurger");
  var links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // סגירה אחרי לחיצה על קישור
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 3. חשיפה בגלילה ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 4. פורטרט ---------- */
  var img = document.getElementById("portraitImg");
  var placeholder = document.getElementById("portraitPlaceholder");
  if (img && placeholder) {
    // מנסים לטעון את assets/portrait.jpg; אם קיים — מציגים אותו ומסתירים את הלוגו
    var probe = new Image();
    probe.onload = function () {
      img.hidden = false;
      img.removeAttribute("data-missing");
      placeholder.hidden = true;
    };
    probe.src = img.getAttribute("src");
  }

  /* ---------- קישורים שעדיין לא הוגדרו (placeholder) ---------- */
  document.querySelectorAll("[data-placeholder-link]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });
})();
