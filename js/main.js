/**
 * Główny plik JavaScript dla strony SCPIP z poprawionymi funkcjami dostępności.
 *
 * Wersja z dnia: 18.07.2024
 *
 * Główne zmiany:
 * 1. USUNIĘTO: Niestandardową nawigację strzałkami, która blokowała klawisz Tab.
 * - Problem: Funkcja handleNavigationArrows dynamicznie zmieniała atrybut tabindex,
 * przez co tylko jeden link w menu był dostępny dla klawisza Tab.
 * - Rozwiązanie: Całkowite usunięcie tej funkcji. Teraz nawigacja za pomocą Tab
 * działa w sposób standardowy i przewidywalny, przechodząc po wszystkich linkach.
 *
 * 2. POPRAWIONO: Płynne przewijanie i ustawianie fokusu.
 * - Problem: Po kliknięciu linku w menu, fokus był ustawiany na całej sekcji,
 * co powodowało wizualne "przeskoczenie" do jej środka.
 * - Rozwiązanie: Po przewinięciu, fokus jest teraz ustawiany na pierwszym nagłówku (np. <h2>)
 * wewnątrz danej sekcji. Dzięki temu czytnik ekranu od razu informuje użytkownika,
 * gdzie się znalazł, a strona pozostaje na początku sekcji.
 *
 * 3. UPROSZCZONO: Logika widżetu i innych funkcji została zachowana, ale kod jest
 * teraz czystszy i bardziej skoncentrowany na kluczowych funkcjonalnościach.
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- SELEKTORY GŁÓWNYCH ELEMENTÓW ---
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const accessibilityWidget = document.getElementById('accessibility-widget');
    const openWidgetBtn = document.getElementById('open-widget-btn');

    // --- INICJALIZACJA FUNKCJI ---
    // Funkcje te są wywoływane po załadowaniu całej strony.
    addSkipLinks();
    initSmoothScrolling(navLinks);
    
    // Sprawdzamy, czy widżet istnieje na stronie, zanim go zainicjujemy
    if (accessibilityWidget && openWidgetBtn) {
        handleWidget(accessibilityWidget, openWidgetBtn);
    }

    // Inicjalizacja opcjonalnej funkcji "czytaj po kliknięciu"
    initClickToRead();


    /**
     * Funkcja do płynnego przewijania do sekcji po kliknięciu linku w nawigacji.
     * Zawiera kluczową poprawkę dotyczącą ustawiania fokusu.
     */
    function initSmoothScrolling(links) {
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Przewiń stronę do początku sekcji
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // === POCZĄTEK KLUCZOWEJ POPRAWKI (WCAG 2.1.1) ===
                    // Szukamy pierwszego nagłówka (h2, h3, itd.) w docelowej sekcji.
                    const heading = targetElement.querySelector('h2, h3, h4, h5, h6');
                    
                    if (heading) {
                        // Ustawiamy atrybut tabindex="-1", aby element mógł otrzymać fokus programowo.
                        heading.setAttribute('tabindex', '-1');
                        // Ustawiamy fokus na nagłówku. Dzięki temu czytnik ekranu go odczyta.
                        heading.focus({ preventScroll: true }); // preventScroll zapobiega dodatkowemu skokowi strony.
                    } else {
                        // Jeśli w sekcji nie ma nagłówka (fallback), ustawiamy fokus na całej sekcji.
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus({ preventScroll: true });
                    }
                    // === KONIEC KLUCZOWEJ POPRAWKI ===
                }
            });
        });
    }

    /**
     * Funkcja dodająca na początku strony tzw. "skip links" (linki pomijające).
     * Ułatwiają one nawigację za pomocą klawiatury.
     */
    function addSkipLinks() {
        const body = document.querySelector('body');
        const mainContent = document.querySelector('main');
        const nav = document.querySelector('nav');

        // Upewniamy się, że główne elementy mają swoje ID
        if (mainContent) mainContent.id = 'main-content';
        if (nav) nav.id = 'main-nav';

        const skipToMain = document.createElement('a');
        skipToMain.href = '#main-content';
        skipToMain.className = 'skip-link';
        skipToMain.innerText = 'Przejdź do treści';

        const skipToNav = document.createElement('a');
        skipToNav.href = '#main-nav';
        skipToNav.className = 'skip-link';
        skipToNav.innerText = 'Przejdź do nawigacji';
        
        // Dodajemy linki na sam początek body
        body.insertBefore(skipToMain, body.firstChild);
        body.insertBefore(skipToNav, body.firstChild);

        // Obsługa fokusu po kliknięciu w skip link
        [skipToMain, skipToNav].forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        });
    }

    /**
     * Podstawowa obsługa widżetu dostępności.
     */
    function handleWidget(widget, openBtn) {
        const closeBtn = widget.querySelector('.close-widget');

        function toggleWidget(show) {
            widget.style.display = show ? 'block' : 'none';
            openBtn.style.display = show ? 'none' : 'block';
            if (show) {
                // Po otwarciu ustaw fokus na pierwszym interaktywnym elemencie w widżecie
                widget.querySelector('button, a, input').focus();
            } else {
                openBtn.focus();
            }
        }

        openBtn.addEventListener('click', () => toggleWidget(true));
        closeBtn.addEventListener('click', () => toggleWidget(false));
        
        // Zamykanie widżetu klawiszem Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && widget.style.display === 'block') {
                toggleWidget(false);
            }
        });

        // Prosta obsługa zmiany rozmiaru czcionki
        document.getElementById('increase-font')?.addEventListener('click', () => changeFontSize(2));
        document.getElementById('decrease-font')?.addEventListener('click', () => changeFontSize(-2));

        // Prosta obsługa kontrastu
        document.getElementById('increase-contrast')?.addEventListener('click', () => document.body.classList.toggle('high-contrast'));
        
        // Przycisk "Przejdź do treści" w widżecie
        document.getElementById('focus-main')?.addEventListener('click', () => {
             const mainContent = document.getElementById('main-content');
             if(mainContent){
                mainContent.setAttribute('tabindex', -1);
                mainContent.focus();
             }
        });
    }

    /**
     * Pomocnicza funkcja do zmiany rozmiaru czcionki na całej stronie.
     */
    function changeFontSize(amount) {
        const body = document.body;
        const currentSize = parseFloat(window.getComputedStyle(body, null).getPropertyValue('font-size'));
        body.style.fontSize = (currentSize + amount) + 'px';
    }

    /**
     * Funkcja do włączania/wyłączania trybu "czytaj po kliknięciu".
     * Uwaga: Web Speech API jest eksperymentalne i może nie działać we wszystkich przeglądarkach.
     */
    function initClickToRead() {
        const readButton = document.getElementById('click-to-read');
        if (!readButton) return; // Jeśli nie ma przycisku, zakończ
        
        let isReadingMode = false;

        readButton.addEventListener('click', () => {
            isReadingMode = !isReadingMode;
            document.body.classList.toggle('click-to-read-mode', isReadingMode);
            
            if (isReadingMode) {
                document.addEventListener('click', readElementText, true);
                readButton.textContent = "Zakończ czytanie";
            } else {
                document.removeEventListener('click', readElementText, true);
                speechSynthesis.cancel(); // Zatrzymaj mowę
                readButton.textContent = "Czytaj po kliknięciu";
            }
        });

        function readElementText(e) {
            // Ignoruj kliknięcia wewnątrz samego widżetu
            if (e.target.closest('#accessibility-widget')) return;

            e.preventDefault();
            e.stopPropagation();

            const element = e.target;
            const textToRead = element.innerText || element.alt || element.ariaLabel;

            if (textToRead && 'speechSynthesis' in window) {
                speechSynthesis.cancel(); // Przerwij poprzednie wypowiedzi
                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.lang = 'pl-PL';
                speechSynthesis.speak(utterance);
            }
        }
    }

});
