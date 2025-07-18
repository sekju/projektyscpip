/**
 * =================================================================================
 * Główny plik JavaScript dla strony z rozbudowanymi funkcjami dostępności (WCAG 2.1)
 * Wersja: 2.0
 *
 * Główne zmiany w tej wersji:
 * - Dostępny modal: Zastąpiono systemowy `alert()` w pełni dostępnym oknem modalnym
 * dla instrukcji, które jest w pełni obsługiwane klawiaturą i przez czytniki ekranu.
 * - Poprawione motywy: Naprawiono błędy w trybie monochromatycznym i dodano logikę
 * do obsługi różnych trybów (wysoki kontrast, monochromatyczny, ciemny).
 * - Pułapka na fokus: Zaimplementowano mechanizm pułapki na fokus w oknie modalnym,
 * aby użytkownik klawiatury nie mógł opuścić okna w niekontrolowany sposób.
 * - Zachowanie funkcji: Wszystkie poprzednie funkcje, takie jak płynne przewijanie,
 * zmiana czcionki i czytanie po kliknięciu, zostały zachowane i zintegrowane.
 * =================================================================================
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Inicjalizacja wszystkich funkcji po załadowaniu strony ---
    initSmoothScrolling();
    addSkipLinks();
    initAccessibilityWidget();
    initClickToRead(); // Inicjalizacja opcjonalnej funkcji "czytaj po kliknięciu"

    /**
     * Płynne przewijanie do sekcji i poprawne ustawienie fokusu na nagłówku.
     */
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    const heading = targetElement.querySelector('h2, h3, h4, h5, h6');
                    if (heading) {
                        heading.setAttribute('tabindex', '-1');
                        heading.focus({ preventScroll: true }); // preventScroll zapobiega dodatkowemu "skokowi"
                    } else {
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus({ preventScroll: true });
                    }
                }
            });
        });
    }

    /**
     * Dodawanie linków pomijających ("skip links") na początku strony.
     */
    function addSkipLinks() {
        const body = document.querySelector('body');
        const mainContent = document.querySelector('main');
        if (mainContent) mainContent.id = 'main-content';

        const skipToMain = document.createElement('a');
        skipToMain.href = '#main-content';
        skipToMain.className = 'skip-link';
        skipToMain.innerText = 'Przejdź do treści';
        body.insertBefore(skipToMain, body.firstChild);

        skipToMain.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipToMain.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }

    /**
     * Inicjalizacja głównego widżetu dostępności i jego przycisków.
     */
    function initAccessibilityWidget() {
        const widget = document.getElementById('accessibility-widget');
        const openBtn = document.getElementById('open-widget-btn');
        
        // Jeśli brakuje kluczowych elementów, nie kontynuuj
        if (!widget || !openBtn) return;

        const closeBtn = widget.querySelector('.close-widget');

        // Otwieranie/zamykanie widżetu
        openBtn.addEventListener('click', () => { widget.hidden = false; openBtn.hidden = true; closeBtn.focus(); });
        closeBtn.addEventListener('click', () => { widget.hidden = true; openBtn.hidden = false; openBtn.focus(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !widget.hidden) closeBtn.click(); });

        // Przyciski zmiany wyglądu
        widget.querySelector('#increase-font')?.addEventListener('click', () => changeFontSize(2));
        widget.querySelector('#decrease-font')?.addEventListener('click', () => changeFontSize(-2));
        widget.querySelector('#increase-contrast')?.addEventListener('click', () => toggleTheme('high-contrast'));
        widget.querySelector('#mono-mode')?.addEventListener('click', () => toggleTheme('monochrome'));
        widget.querySelector('#dark-mode')?.addEventListener('click', () => toggleTheme('dark-mode'));

        // Przycisk instrukcji (uruchamia modal zamiast alertu)
        widget.querySelector('#keyboard-help')?.addEventListener('click', showKeyboardHelp);
    }

    /**
     * Zmienia rozmiar czcionki na całej stronie.
     * @param {number} amount - Wartość w pikselach, o którą ma się zmienić czcionka.
     */
    function changeFontSize(amount) {
        const body = document.body;
        const currentSize = parseFloat(window.getComputedStyle(body, null).getPropertyValue('font-size'));
        const newSize = Math.max(12, currentSize + amount); // Ograniczenie minimalnej wielkości do 12px
        body.style.fontSize = newSize + 'px';
    }

    /**
     * Przełącza motyw kolorystyczny na stronie.
     * @param {string} themeClass - Nazwa klasy CSS motywu do przełączenia.
     */
    function toggleTheme(themeClass) {
        // Usuń inne motywy, aby się nie nakładały
        document.body.classList.remove('high-contrast', 'monochrome', 'dark-mode');
        // Dodaj wybrany motyw
        document.body.classList.add(themeClass);
    }
    
    /**
     * Wyświetla instrukcje dostępności w nowym, dostępnym oknie modalnym.
     */
    function showKeyboardHelp() {
        const helpTitle = 'Instrukcja Dostępności';
        const helpTextHTML = `
            <h3>Nawigacja Klawiaturą</h3>
            <p>Możesz w pełni nawigować po tej stronie używając tylko klawiatury:</p>
            <ul>
                <li>Użyj klawisza <strong>Tab</strong>, aby przechodzić do kolejnych linków, przycisków i pól formularzy.</li>
                <li>Użyj <strong>Shift + Tab</strong>, aby cofać się do poprzednich elementów.</li>
                <li>Użyj <strong>Enter</strong> lub <strong>Spacji</strong>, aby aktywować zaznaczony element.</li>
                <li>Użyj klawisza <strong>Escape</strong>, aby zamknąć to okno lub panel dostępności.</li>
            </ul>
            <h3>Panel Dostępności</h3>
            <p>Panel dostępności, aktywowany ikoną w rogu ekranu, pozwala na zmianę kontrastu, rozmiaru czcionki oraz oferuje funkcję czytania treści na głos dla ułatwienia dostępu.</p>
        `;
        showAccessibleModal(helpTitle, helpTextHTML);
    }

    /**
     * Wyświetla i zarządza dostępnym oknem modalnym (dialogowym).
     * @param {string} title - Tytuł okna.
     * @param {string} contentHTML - Treść okna w formacie HTML.
     */
    function showAccessibleModal(title, contentHTML) {
        const modal = document.getElementById('accessible-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const closeBtn = document.getElementById('modal-close-btn');
        
        if (!modal || !modalTitle || !modalBody || !closeBtn) return;
        
        const lastFocusedElement = document.activeElement; // Zapisz element, który miał fokus przed otwarciem modala

        // Ustawienie treści i pokazanie modala
        modalTitle.textContent = title;
        modalBody.innerHTML = contentHTML;
        modal.hidden = false;
        
        // Przeniesienie fokusu na przycisk zamykania
        closeBtn.focus();
        
        function trapFocus(e) {
            if (e.key !== 'Tab') return;
            
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Zwykły Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }

        function closeModal() {
            modal.hidden = true;
            document.removeEventListener('keydown', trapFocus);
            lastFocusedElement.focus(); // Zwróć fokus na element, który był aktywny przed otwarciem modala
        }

        function escapeListener(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeListener);
            }
        }
        
        closeBtn.addEventListener('click', closeModal, { once: true });
        document.addEventListener('keydown', trapFocus);
        document.addEventListener('keydown', escapeListener);
    }
    
    /**
     * Inicjalizuje funkcję "czytaj po kliknięciu" (Web Speech API).
     */
    function initClickToRead() {
        const readButton = document.getElementById('click-to-read');
        if (!readButton || !('speechSynthesis' in window)) {
            readButton?.setAttribute('disabled', 'true');
            readButton?.setAttribute('title', 'Twoja przeglądarka nie wspiera tej funkcji.');
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

            const element = e.target;
            const textToRead = element.innerText || element.alt || element.ariaLabel;

            if (textToRead) {
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.lang = 'pl-PL';
                speechSynthesis.speak(utterance);
            }
        }
    }
});
