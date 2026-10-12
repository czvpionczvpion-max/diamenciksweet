(() => {
  const buttons = document.querySelectorAll(".promo-copy");
  if (!buttons.length) return;

  async function copyCode(btn) {
    const slot = btn.closest(".promo-box")?.querySelector(".promo-code");
    const code = slot?.textContent.trim() ?? "";
    const prev = btn.textContent;

    if (!code) {
      btn.textContent = "Brak kodu";
      window.setTimeout(() => {
        btn.textContent = prev;
      }, 1400);
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const input = document.createElement("textarea");
      input.value = code;
      input.setAttribute("readonly", "");
      input.style.position = "absolute";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }

    btn.textContent = "Skopiowano";
    btn.classList.add("is-copied");
    window.setTimeout(() => {
      btn.textContent = prev;
      btn.classList.remove("is-copied");
    }, 1600);
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => copyCode(btn));
  });
})();
