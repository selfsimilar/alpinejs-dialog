(() => {
  // src/dialog.js
  function dialog_default(Alpine) {
    Alpine.directive("htmldialog", fylgjaAlpineDialog);
    function fylgjaAlpineDialog(el, { expression, modifiers }, { evaluateLater, cleanup }) {
      const evaluate = expression.length ? evaluateLater(expression) : () => {
      };
      const lockPageScroll = modifiers.includes("noscroll");
      el.style.display = null;
      el.hidden = false;
      el.style.length === 0 && el.removeAttribute("style");
      function scrollLock(use = true) {
        document.body.style.overflow = use ? "hidden" : "";
      }
      function escapeDialog(event) {
        if (event.key !== "Escape")
          return;
        event.preventDefault();
        evaluate();
      }
      function backdropDialog(event) {
        const rect = el.getBoundingClientRect();
        const isInDialog = rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width;
        if (isInDialog)
          return;
        evaluate();
      }
      function preventInvalidClose(event) {
        const form = el.querySelector("form");
        if (form && !form.checkValidity()) {
          event.preventDefault();
        }
      }
      function handleEnterKey(event) {
        if (event.key === "Enter") {
          const form = el.querySelector("form");
          if (form && !form.checkValidity()) {
            event.preventDefault();
          }
        }
      }
      el._x_doShow = () => {
        if (el.hasAttribute("open"))
          return;
        el.showModal();
        document.addEventListener("keydown", escapeDialog);
        el.addEventListener("click", backdropDialog);
        el.addEventListener("close", preventInvalidClose);
        el.addEventListener("keydown", handleEnterKey);
        scrollLock(lockPageScroll);
      };
      el._x_doHide = () => {
        if (!el.hasAttribute("open"))
          return;
        el.close();
        document.removeEventListener("keydown", escapeDialog);
        el.removeEventListener("click", backdropDialog);
        el.removeEventListener("close", preventInvalidClose);
        el.removeEventListener("keydown", handleEnterKey);
        scrollLock(false);
      };
      cleanup(() => {
        document.removeEventListener("keydown", escapeDialog);
        el.removeEventListener("click", backdropDialog);
        el.removeEventListener("close", preventInvalidClose);
        el.removeEventListener("keydown", handleEnterKey);
        scrollLock(false);
      });
    }
  }

  // src/cdn.js
  document.addEventListener("alpine:init", () => {
    window.Alpine.plugin(dialog_default);
  });
})();
