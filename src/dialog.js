export default function (Alpine) {
    Alpine.directive("dialog", fylgjaAlpineDialog);

    function fylgjaAlpineDialog(
        el,
        { expression, modifiers },
        { evaluateLater, cleanup }
    ) {
        const evaluate = expression.length
            ? evaluateLater(expression)
            : () => {};
        const lockPageScroll = modifiers.includes("noscroll");

        // Remove any logic set by `x-show`
        el.style.display = null;
        el.hidden = false;
        el.style.length === 0 && el.removeAttribute("style");

        function scrollLock(use = true) {
            document.body.style.overflow = use ? "hidden" : "";
        }

        function escapeDialog(event) {
            if (event.key !== "Escape") return;
            event.preventDefault(); // prevent native escape
            evaluate();
        }

        function backdropDialog(event) {
            const rect = el.getBoundingClientRect();
            const isInDialog =
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width;
            if (isInDialog) return;
            evaluate();
        }

        el._x_doShow = () => {
            if (el.hasAttribute("open")) return;
            el.showModal();
            document.addEventListener("keydown", escapeDialog);
            el.addEventListener("click", backdropDialog);
            scrollLock(lockPageScroll);
        };

        el._x_doHide = () => {
            if (!el.hasAttribute("open")) return;
            el.close();
            document.removeEventListener("keydown", escapeDialog);
            el.removeEventListener("click", backdropDialog);
            scrollLock(false);
        };

        cleanup(() => {
            document.removeEventListener("keydown", escapeDialog);
            el.removeEventListener("click", backdropDialog);
            scrollLock(false);
        });
    }
}
