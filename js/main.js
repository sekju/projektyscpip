/**
 * =================================================================================
 * Główny plik JavaScript z poprawioną nawigacją po sekcjach (WCAG 2.1)
 * Wersja: 3.0
 *
 * Główne zmiany w tej wersji:
 * - NAWIGACJA PO SEKCJACH: Nagłówki `<h2>` wewnątrz `<main>` są teraz częścią
 * naturalnej kolejności nawigacji klawiszem Tab (`tabindex="0"`), co pozwala
 * na łatwe przeskakiwanie między głównymi częściami strony.
 * - SZYBKA NAWIGACJA W WIDŻECIE: Panel dostępności jest dynamicznie
 * wypełniany listą linków do wszystkich głównych sekcji (nagłówków `<h2>`),
 * realizując sugestię użytkownika.
 * - CZYSTOŚĆ KODU: Cały skrypt został zrefaktoryzowany i uporządkowany
 * w celu zapewnienia stabilności i łatwiejszego utrzymania.
 * =================================================================================
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Inicjalizacja wszystkich modułów po załadowaniu strony ---
    initSmoothScrolling();
    addSkipLinks();
    initSectionNavigation(); // KLUCZOWA NOWA FUNKCJA
    initAccessibilityWidget();
    initClickToRead();

    /**
     * Ustawia nagłówki `<h2>` w głównych sekcjach jako nawigowalne
     * za pomocą klawisza Tab i tworzy menu w panelu dostępności.
     */
    function initSectionNavigation() {
        const sections = document.querySelectorAll('main > section');
        const widgetNavList = document.getElementById('widget-section-nav');

        if (widgetNavList) {
            widgetNavList.innerHTML = ''; // Wyczyść listę przed wypełnieniem
        }

        sections.forEach(section => {
            const heading = section.querySelector('h2');
            if (heading) {
                // 1. Dodaj nagłówek do naturalnej kolejności nawigacji klawiszem Tab
                heading.setAttribute('tabindex', '0');

                // 2. Dodaj link do tego nagłówka w panelu dostępności
                if (widgetNavList && section.id) {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = `#${section.id}`;
                    link.textContent = heading.textContent;

                    // Po kliknięciu linku w widżecie, przewiń i ustaw fokus na nagłówku
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        heading.focus();
                        // Opcjonalnie zamknij widżet po wyborze
                        document.getElementById('accessibility-widget').hidden = true;
                        document.getElementById('open-widget-btn').hidden = false;
                    });
                    
                    listItem.appendChild(link);
                    widgetNavList.appendChild(listItem);
                }
            }
        });
    }

    /**
     * Płynne przewijanie dla linków w menu głównym.
     */
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    const heading = targetElement.querySelector('h2');
                    if(heading) {
                         // Po przewinięciu fokusujemy nagłówek, który jest już fokusowalny
                        heading.focus();
                    }
                }
            });
        });
    }

    /**
     * Dodawanie linków pomijających ("skip links").
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
                // Fokusujemy pierwszy fokusowalny element w main, czyli pierwszy nagłówek h2
                const firstFocusable = target.querySelector('[tabindex="0"], a, button, input');
                if(firstFocusable) firstFocusable.focus();
            }
        });
    }

    /**
     * Inicjalizacja głównego widżetu dostępności.
     */
    function initAccessibilityWidget() {
        const widget = document.getElementById('accessibility-widget');
        const openBtn = document.getElementById('open-widget-btn');
        if (!widget || !openBtn) return;

        const closeBtn = widget.querySelector('.close-widget');

        openBtn.addEventListener('click', () => { widget.hidden = false; openBtn.hidden = true; closeBtn.focus(); });
        closeBtn.addEventListener('click', () => { widget.hidden = true; openBtn.hidden = false; openBtn.focus(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !widget.hidden) closeBtn.click(); });

        widget.querySelector('#increase-font')?.addEventListener('click', () => changeFontSize(2));
        widget.querySelector('#decrease-font')?.addEventListener('click', () => changeFontSize(-2));
        widget.querySelector('#increase-contrast')?.addEventListener('click', () => toggleTheme('high-contrast'));
        widget.querySelector('#mono-mode')?.addEventListener('click', () => toggleTheme('monochrome'));

        widget.querySelector('#keyboard-help')?.addEventListener('click', showKeyboardHelp);
    }
    
    function changeFontSize(amount) {
        const body = document.body;
        const currentSize = parseFloat(window.getComputedStyle(body, null).getPropertyValue('font-size'));
        const newSize = Math.max(12, currentSize + amount);
        body.style.fontSize = newSize + 'px';
    }

    function toggleTheme(themeClass) {
        const activeClasses = ['high-contrast', 'monochrome'];
        document.body.classList.remove(...activeClasses);
        document.body.classList.add(themeClass);
    }

    /**
     * Wyświetla instrukcje dostępności w dostępnym oknie modalnym.
     */
    function showKeyboardHelp() {
        const helpTitle = 'Instrukcja Dostępności';
        const helpTextHTML = `
            <h3>Nawigacja Klawiaturą</h3>
            <p>Możesz w pełni nawigować po tej stronie używając tylko klawiatury:</p>
            <ul>
                <li>Użyj klawisza <strong>Tab</strong>, aby przechodzić do kolejnych linków, przycisków oraz nagłówków głównych sekcji.</li>
                <li>Użyj <strong>Shift + Tab</strong>, aby cofać się do poprzednich elementów.</li>
                <li>Użyj <strong>Enter</strong> lub <strong>Spacji</strong>, aby aktywować zaznaczony element.</li>
            </ul>
            <h3>Panel Dostępności</h3>
            <p>Panel dostępności, aktywowany ikoną w rogu ekranu, pozwala na szybkie przejście do wybranej sekcji, zmianę wyglądu strony oraz oferuje funkcję czytania treści na głos.</p>
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
        
        function closeModal() {
            modal.hidden = true;
            document.removeEventListener('keydown', trapFocus);
            lastFocusedElement.focus();
        }

        const escapeListener = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeListener);
            }
        };
        
        closeBtn.addEventListener('click', closeModal, { once: true });
        document.addEventListener('keydown', trapFocus);
        document.addEventListener('keydown', escapeListener);
    }
    
    /**
     * Inicjalizuje funkcję "czytaj po kliknięciu".
     */
    function initClickToRead() {
        const readButton = document.getElementById('click-to-read');
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
            const textToRead = e.target.innerText || e.target.alt || e.target.ariaLabel;
            if (textToRead) {
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.lang = 'pl-PL';
                speechSynthesis.speak(utterance);
            }
        }
    }
});
