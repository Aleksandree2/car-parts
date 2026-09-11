// ნათელი / მუქი თემა.
//
// სამი მდგომარეობაა: ხელით ნათელი, ხელით მუქი და — თუ არჩევანი არ
// გაუკეთებია — სისტემისა. არჩევანი ინახება ბრაუზერში.
//
// ეს ფაილი <head>-ის ბოლოს უნდა ჩაიტვირთოს, სანამ გვერდი დაიხატება,
// თორემ მუქ თემაზე ჯერ ნათელი გაიელვებს.

(function () {
  const KEY = "carparts:theme";

  function stored() {
    try {
      const v = localStorage.getItem(KEY);
      return v === "dark" || v === "light" ? v : null;
    } catch (e) {
      return null; // localStorage მიუწვდომელია (private mode და მისთ.)
    }
  }

  const systemDark = () =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  // რა თემა ჩანს ეკრანზე ახლა
  const current = () => stored() || (systemDark() ? "dark" : "light");

  function apply(theme) {
    if (theme) document.documentElement.setAttribute("data-theme", theme);
    else document.documentElement.removeAttribute("data-theme");
  }

  // არჩევანი მაშინვე, სანამ <body> დაიხატება
  apply(stored());

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

  // ღილაკის იერსახე მიმდინარე თემას მიჰყვება
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

  // სისტემის თემა შეიცვალა და ხელით არჩევანი არ გვაქვს
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (!stored()) {
        sync();
        window.dispatchEvent(new CustomEvent("themechange", { detail: current() }));
      }
    });
  }

  window.Theme = { current, toggle };
})();
