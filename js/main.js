/**
 * =================================================================================
 * OSTATECZNY SKRYPT DOSTĘPNOŚCI (WCAG 2.1) - Wersja 4.0
 *
 * GŁÓWNA POPRAWKA:
 * Zapewnienie pełnej, linearnej nawigacji klawiszem TAB po wszystkich
 * kluczowych elementach treści strony (nagłówki, paragrafy, listy, linki),
 * a nie tylko po elementach interaktywnych.
 *
 * Autor: Gemini (poprawiona wersja)
 * Data: 18.07.2024
 * =================================================================================
 */
document.addEventListener('DOMContentLoaded', function() {

    /**
     * GŁÓWNA FUNKCJA INICJALIZUJĄCA POPRAWNĄ NAWIGACJĘ TAB
     * Ta funkcja jest sercem całego rozwiązania. Przechodzi przez stronę
     * i nadaje możliwość fokusowania wszystkim kluczowym elementom treści.
     */
    function enableFullContentNavigation() {
        // Selektor wybiera wszystkie kluczowe bloki treści, które domyślnie nie są fokusowalne.
        const contentElements = document.querySelectorAll(
            'h1, h2, h3, h4, p, ul, li'
        );

        // Nadajemy każdemu z tych elementów tabindex="0", co włącza je do naturalnej
        // kolejności nawigacji klawiszem Tab.
        contentElements.forEach(element => {
            element.setAttribute('tabindex', '0');
        });

        // Dodatkowo, naprawiamy błąd w głównym menu nawigacyjnym, gdzie
        // linki miały nieprawidłowy atrybut tabindex="-1".
        const navLinks = document.querySelectorAll('nav[role="navigation"] a[role="menuitem"]');
        navLinks.forEach(link => {
            link.setAttribute('tabindex', '0');
        });
    }

    /**
     * Inicjalizuje obsługę całego panelu dostępności, bazując na ID
     * elementów z dostarczonego pliku HTML.
     */
    function initAccessibilityWidget() {
        const toggleButton = document.getElementById('accessibility-toggle');
        const closeButton = document.getElementById('close-accessibility');
        const panel = document.getElementById('accessibility-panel');

        if (!toggleButton || !panel || !closeButton) {
            console.error('Nie znaleziono kluczowych elementów widżetu dostępności.');
            return;
        }

        // Logika otwierania i zamykania panelu
        toggleButton.addEventListener('click', () => {
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
            toggleButton.setAttribute('aria-expanded', !isExpanded);
            panel.setAttribute('aria-hidden', isExpanded);
        });

        closeButton.addEventListener('click', () => {
            toggleButton.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
            toggleButton.focus(); // Zwróć fokus na przycisk otwierający
        });

        // Obsługa zamykania klawiszem Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') {
                closeButton.click();
            }
        });

        initWidgetControls(panel);
    }
    
    /**
     * Inicjalizuje wszystkie przyciski i kontrolki wewnątrz panelu dostępności.
     */
    function initWidgetControls(panel) {
        // Kontrola rozmiaru czcionki
        const fontSlider = panel.querySelector('#font-size-slider');
        const fontValueDisplay = panel.querySelector('#font-size-value');
        const root = document.documentElement;
        
        fontSlider.addEventListener('input', () => {
            root.style.fontSize = fontSlider.value + 'px';
            fontValueDisplay.textContent = fontSlider.value + 'px';
        });
        panel.querySelector('#font-decrease').addEventListener('click', () => { fontSlider.stepDown(); fontSlider.dispatchEvent(new Event('input')); });
        panel.querySelector('#font-increase').addEventListener('click', () => { fontSlider.stepUp(); fontSlider.dispatchEvent(new Event('input')); });


        // Kontrola motywów (kontrast, tryb ciemny itp.)
        const contrastButtons = panel.querySelectorAll('.contrast-btn');
        contrastButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Usuń wszystkie klasy motywów z body
                document.body.className = '';
                const theme = button.getAttribute('data-contrast');
                if (theme !== 'normal') {
                    document.body.classList.add(theme);
                }
                // Ustaw klasę 'active' na klikniętym przycisku
                contrastButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Tutaj można dodać obsługę pozostałych przycisków (czytanie, reset itp.)
        // jeśli będą potrzebne w przyszłości.
    }


    // --- GŁÓWNE WYWOŁANIE SKRYPTÓW ---
    
    // 1. Najważniejszy krok: Włączamy pełną nawigację po treści.
    enableFullContentNavigation();
    
    // 2. Inicjalizujemy widżet dostępności.
    initAccessibilityWidget();

});
