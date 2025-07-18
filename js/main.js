/**
 * =================================================================================
 * Wersja finalna, naprawiona i kompletna: main.js
 * - Naprawiono błąd z modalem blokującym stronę przy starcie.
 * - Przywrócono i zintegrowano wszystkie funkcje widżetu (czcionka, kontrast, czytanie).
 * - Zapewniono pełną, liniową nawigację klawiszem TAB po całej treści strony.
 * =================================================================================
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- GŁÓWNE WYWOŁANIE FUNKCJI ---
    enableFullContentNavigation();
    initAccessibilityWidget();

    /**
     * Kluczowa funkcja zapewniająca nawigację TAB po całej treści.
     */
    function enableFullContentNavigation() {
        const contentElements = document.querySelectorAll('h1, h2, h3, h4, p, ul, li');
        contentElements.forEach(element => {
            element.setAttribute('tabindex', '0');
        });
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.setAttribute('tabindex', '0');
        });
    }

    /**
     * Inicjalizuje główny widżet dostępności i jego przyciski.
     */
    function initAccessibilityWidget() {
        const widget = document.getElementById('accessibility-widget');
        const openBtn = document.getElementById('open-widget-btn');
        if (!widget || !openBtn) return;
        
        const closeBtn = widget.querySelector('.close-widget');
        
        // Logika otwierania/zamykania
        openBtn.addEventListener('click', () => { widget.hidden = false; openBtn.hidden = true; widget.querySelector('h3').focus(); });
        closeBtn.addEventListener('click', () => { widget.hidden = true; openBtn.hidden = false; openBtn.focus(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !widget.hidden) closeBtn.click(); });
        
        // Inicjalizacja kontrolek
        initWidgetControls(widget);
        populateSectionNav(widget);
    }

    /**
     * Podpina logikę do wszystkich przycisków w widżecie.
     */
    function initWidgetControls(widget) {
        widget.querySelector('#increase-font')?.addEventListener('click', () => changeFontSize(2));
        widget.querySelector('#decrease-font')?.addEventListener('click', () => changeFontSize(-2));
        widget.querySelector('#high-contrast-mode')?.addEventListener('click', () => toggleTheme('high-contrast'));
        widget.querySelector('#mono-mode')?.addEventListener('click', () => toggleTheme('monochrome'));
        widget.querySelector('#keyboard-help')?.addEventListener('click', showKeyboardHelp);
        initClickToRead(widget.querySelector('#click-to-read'));
    }

    /**
     * Wypełnia listę szybkiej nawigacji w widżecie.
     */
    function populateSectionNav(widget) {
        const navList = widget.querySelector('#widget-section-nav');
        if (!navList) return;
        
        navList.innerHTML = '';
        const sections = document.querySelectorAll('main > section');
        sections.forEach(section => {
            const heading = section.querySelector('h2');
            if (heading && section.id) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${section.id}`;
                a.textContent = heading.textContent;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    heading.focus();
                    widget.hidden = true;
                    document.getElementById('open-widget-btn').hidden = false;
                });
                li.appendChild(a);
                navList.appendChild(li);
            }
        });
    }

    function changeFontSize(amount) {
        const body = document.body;
        const currentSize = parseFloat(window.getComputedStyle(body, null).getPropertyValue('font-size'));
        const newSize = Math.max(12, currentSize + amount);
        body.style.fontSize = newSize + 'px';
    }

    function toggleTheme(themeClass) {
        document.body.classList.toggle(themeClass);
    }

    /**
     * Inicjalizuje funkcję "czytaj po kliknięciu".
     */
    function initClickToRead(readButton) {
        if (!readButton || !('speechSynthesis' in window)) {
            readButton?.setAttribute('disabled', 'true');
            return;
        }
        
        let isReadingMode = false;
        readButton.addEventListener('click', () => {
            isReadingMode = !isReadingMode;
            document.body.classList.toggle('click-to-read-mode', isReadingMode);
            if (isReadingMode) {
                document.addEventListener('click', readElementText, true);
                readButton.textContent = "Zakończ czytanie";
            } else {
                document.removeEventListener('click', readElementText, true);
                speechSynthesis.cancel();
                readButton.textContent = "Czytaj po kliknięciu";
            }
        });

        function readElementText(e) {
            if (e.target.closest('#accessibility-widget')) return;
            e.preventDefault();
            e.stopPropagation();
            const textToRead = e.target.innerText || e.target.alt;
            if (textToRead) {
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.lang = 'pl-PL';
                speechSynthesis.speak(utterance);
            }
        }
    }

    /**
     * Wyświetla instrukcje w oknie modalnym.
     */
    function showKeyboardHelp() {
        const helpTitle = 'Instrukcja Dostępności';
        const helpTextHTML = `
            <h3>Nawigacja Klawiaturą</h3>
            <p>Możesz w pełni nawigować po tej stronie używając tylko klawiatury:</p>
            <ul>
                <li>Użyj klawisza <strong>Tab</strong>, aby przechodzić do kolejnych elementów (nagłówków, paragrafów, linków).</li>
                <li>Użyj <strong>Shift + Tab</strong>, aby cofać się do poprzednich elementów.</li>
                <li>Użyj <strong>Enter</strong> lub <strong>Spacji</strong>, aby aktywować zaznaczony link lub przycisk.</li>
            </ul>
        `;
        showAccessibleModal(helpTitle, helpTextHTML);
    }

    /**
     * Wyświetla i zarządza dostępnym oknem modalnym z pułapką na fokus.
     */
    function showAccessibleModal(title, contentHTML) {
        const modal = document.getElementById('accessible-modal');
        if (!modal) return;

        const modalTitle = modal.querySelector('#modal-title');
        const modalBody = modal.querySelector('#modal-body');
        const closeBtn = modal.querySelector('#modal-close-btn');
        const lastFocusedElement = document.activeElement;

        modalTitle.textContent = title;
        modalBody.innerHTML = contentHTML;
        modal.hidden = false;
        closeBtn.focus();

        const focusableElements = Array.from(modal.querySelectorAll('button, [href]'));
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        function trapFocus(e) {
            if (e.key !== 'Tab') return;
            if (e.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }

        const closeModal = () => {
            modal.hidden = true;
            document.removeEventListener('keydown', trapFocus);
            document.removeEventListener('keydown', escapeListener);
            lastFocusedElement?.focus();
        };

        const escapeListener = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        
        closeBtn.addEventListener('click', closeModal, { once: true });
        document.addEventListener('keydown', trapFocus);
        document.addEventListener('keydown', escapeListener, { once: true });
    }
});
