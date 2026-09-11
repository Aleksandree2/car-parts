// ნათელი / მუქი თემა.
//
// საიტი ნაგულისხმევად მუქია და სისტემის არჩევანს არ მიჰყვება.
// ზედა ღილაკით შეიძლება ნათელზე გადართვა; არჩევანი ბრაუზერში ინახება
// და ორივე გვერდზე მოქმედებს.
//
// ეს ფაილი <head>-ში იტვირთება, სანამ გვერდი დაიხატება, რომ თემამ
// არ გაიელვოს.

(function () {
  const KEY = "carparts:theme";

  function stored() {
    try {
      const v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) {
      return null; // localStorage მიუწვდომელია (private mode და მისთ.)
    }
  }

  // არჩევანის გარეშე — მუქი
  const current = () => stored() || "dark";

  function apply(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  apply(current());

  function toggle() {
    const next = current() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {
      /* შენახვა ვერ მოხერხდა — გვერდის გადატვირთვამდე მაინც იმუშავებს */
    }
    apply(next);
    sync();
    window.dispatchEvent(new CustomEvent("themechange", { detail: next }));
  }

  function sync() {
    const dark = current() === "dark";
    for (const btn of document.querySelectorAll("[data-theme-toggle]")) {
      btn.textContent = dark ? "☀" : "☾";
      btn.title = dark ? "ნათელი თემა" : "მუქი თემა";
      btn.setAttribute("aria-label", btn.title);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    sync();
    for (const btn of document.querySelectorAll("[data-theme-toggle]")) {
      btn.addEventListener("click", toggle);
    }
  });

  window.Theme = { current, toggle };
})();
