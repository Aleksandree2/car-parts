// ლოგოს ჩატვირთვა.
//
// ფაილი შეიძლება ჯერ არ იყოს ატვირთული ან სხვა გაფართოებით იყოს,
// ამიტომ სათითაოდ ვცდით. სანამ არ ჩაიტვირთება, ჩანს სათადარიგო
// ვარიანტი (⚙ + სახელი) — გატეხილი სურათის ხატულა არასოდეს ჩანს.

(function () {
  const CANDIDATES = ["logo.png", "logo.jpg", "logo.jpeg", "logo.webp", "logo.svg"];

  document.addEventListener("DOMContentLoaded", () => {
    const box = document.getElementById("logo");
    const img = document.getElementById("logo-img");
    if (!box || !img) return;

    let i = 0;

    function tryNext() {
      if (i >= CANDIDATES.length) return; // ლოგო არ არის — სათადარიგო რჩება
      img.src = CANDIDATES[i++];
    }

    img.addEventListener("load", () => {
      img.hidden = false;
      box.classList.add("has-logo");
      img.alt = (window.SITE && SITE.title) || "AutoZona";
    });

    img.addEventListener("error", tryNext);
    tryNext();
  });
})();
