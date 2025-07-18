/**
 * =================================================================================
 * OSTATECZNY I KOMPLETNY SKRYPT DOSTĘPNOŚCI (WCAG 2.1) - Wersja 5.0 (Finalna)
 *
 * Cel: Zapewnienie pełnej funkcjonalności widżetu dostępności oraz
 * prawidłowej, linearnej nawigacji klawiszem TAB po wszystkich kluczowych
 * elementach treści strony.
 *
 * Data: 18.07.2024
 * =================================================================================
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- GŁÓWNE WYWOŁANIE SKRYPTÓW ---
    enableFullContentNavigation();
    initAccessibilityWidget();
    restoreSettings();

    /**
     * Kluczowa funkcja zapewniająca nawigację TAB po całej treści.
     * Nadaje `tabindex="0"` wszystkim elementom, które powinny być
     * osiągalne za pomocą klawiatury.
     */
    function enableFullContentNavigation() {
        const contentElements = document.querySelectorAll(
            'h1, h2, h3, h4, p, ul, li'
        );
        contentElements.forEach(element => {
            element.setAttribute('tabindex', '0');
        });

        const navLinks = document.querySelectorAll('nav[role="navigation"] a[role="menuitem"]');
        navLinks.forEach(link => {
            link.setAttribute('tabindex', '0');
        });
    }

    /**
     * Inicjalizuje cały widżet dostępności i wszystkie jego kontrolki.
     */
    function initAccessibilityWidget() {
        const panel = document.getElementById('accessibility-panel');
        if (!panel) return;

        // Logika otwierania/zamykania panelu
        const toggleButton = document.getElementById('accessibility-toggle');
        const closeButton = document.getElementById('close-accessibility');
        toggleButton.addEventListener('click', () => togglePanel(panel, toggleButton, true));
        closeButton.addEventListener('click', () => togglePanel(panel, toggleButton, false));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') {
                togglePanel(panel, toggleButton, false);
            }
        });

        // Inicjalizacja poszczególnych modułów widżetu
        initFontControls(panel);
        initContrastControls(panel);
        initTextToSpeechControls(panel);
        initNavigationControls(panel);
        initHelpControls(panel);
        initResetButton(panel);
    }
    
    function togglePanel(panel, toggleButton, show) {
        if (show) {
            toggleButton.setAttribute('aria-expanded', 'true');
            panel.setAttribute('aria-hidden', 'false');
            panel.querySelector('button, input').focus();
        } else {
            toggleButton.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
            toggleButton.focus();
        }
    }

    /**
     * Inicjalizuje kontrolki do zmiany rozmiaru czcionki.
     */
    function initFontControls(panel) {
        const slider = panel.querySelector('#font-size-slider');
        const valueDisplay = panel.querySelector('#font-size-value');
        const decreaseBtn = panel.querySelector('#font-decrease');
        const increaseBtn = panel.querySelector('#font-increase');
        const root = document.documentElement;

        function updateFontSize(size) {
            root.style.fontSize = size + 'px';
            valueDisplay.textContent = size + 'px';
            localStorage.setItem('fontSize', size);
        }

        slider.addEventListener('input', () => updateFontSize(slider.value));
        decreaseBtn.addEventListener('click', () => { slider.stepDown(); slider.dispatchEvent(new Event('input')); });
        increaseBtn.addEventListener('click', () => { slider.stepUp(); slider.dispatchEvent(new Event('input')); });
    }

    /**
     * Inicjalizuje przyciski do zmiany motywu/kontrastu.
     */
    function initContrastControls(panel) {
        const contrastButtons = panel.querySelectorAll('.contrast-btn');
        contrastButtons.forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.getAttribute('data-contrast');
                document.body.className = ''; // Reset klas
                if (theme !== 'normal') {
                    document.body.classList.add(theme);
                }
                localStorage.setItem('theme', theme);

                contrastButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    /**
     * Inicjalizuje kontrolki do czytania tekstu na głos (Text-to-Speech).
     */
    function initTextToSpeechControls(panel) {
        const readBtn = panel.querySelector('#read-page');
        const pauseBtn = panel.querySelector('#pause-reading');
        const stopBtn = panel.querySelector('#stop-reading');
        let isReading = false;

        readBtn.addEventListener('click', () => {
            if (!isReading) {
                const content = document.querySelector('main').innerText;
                const utterance = new SpeechSynthesisUtterance(content);
                utterance.lang = 'pl-PL';
                utterance.onstart = () => isReading = true;
                utterance.onend = () => isReading = false;
                speechSynthesis.speak(utterance);
            }
        });

        pauseBtn.addEventListener('click', () => {
            if (speechSynthesis.speaking) {
                speechSynthesis.paused ? speechSynthesis.resume() : speechSynthesis.pause();
            }
        });

        stopBtn.addEventListener('click', () => {
            speechSynthesis.cancel();
            isReading = false;
        });
    }

    /**
     * Inicjalizuje przyciski nawigacyjne "Przejdź do...".
     */
    function initNavigationControls(panel) {
        panel.querySelector('#focus-main').addEventListener('click', () => {
            document.getElementById('main-content').focus();
        });
        panel.querySelector('#focus-nav').addEventListener('click', () => {
            document.querySelector('nav a').focus();
        });
    }
    
    /**
     * Inicjalizuje przyciski pomocy.
     */
    function initHelpControls(panel) {
        // Ta funkcja może zostać rozbudowana o modal z instrukcjami,
        // jeśli będzie taka potrzeba w przyszłości.
        panel.querySelector('#keyboard-help').addEventListener('click', () => {
            alert("Użyj klawiszy TAB i SHIFT+TAB do nawigacji, a ENTER do aktywacji elementów.");
        });
         panel.querySelector('#read-help').addEventListener('click', () => {
            const helpText = "Panel dostępności pozwala na zmianę rozmiaru czcionki, kontrastu oraz włączenie czytania strony na głos.";
            const utterance = new SpeechSynthesisUtterance(helpText);
            utterance.lang = 'pl-PL';
            speechSynthesis.speak(utterance);
        });
    }

    /**
     * Inicjalizuje przycisk resetowania ustawień.
     */
    function initResetButton(panel) {
        panel.querySelector('#reset-settings').addEventListener('click', () => {
            // Resetuj localStorage
            localStorage.removeItem('fontSize');
            localStorage.removeItem('theme');
            
            // Resetuj style
            document.documentElement.style.fontSize = '';
            document.body.className = '';
            
            // Resetuj kontrolki w panelu
            const slider = panel.querySelector('#font-size-slider');
            const valueDisplay = panel.querySelector('#font-size-value');
            slider.value = 16;
            valueDisplay.textContent = '16px';
            
            panel.querySelectorAll('.contrast-btn').forEach(btn => btn.classList.remove('active'));
            panel.querySelector('[data-contrast="normal"]').classList.add('active');
            
            // Zatrzymaj czytanie
            speechSynthesis.cancel();
        });
    }
    
    /**
     * Przywraca zapisane ustawienia z localStorage przy załadowaniu strony.
     */
    function restoreSettings() {
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            document.documentElement.style.fontSize = savedFontSize + 'px';
            const slider = document.getElementById('font-size-slider');
            const valueDisplay = document.getElementById('font-size-value');
            if(slider) slider.value = savedFontSize;
            if(valueDisplay) valueDisplay.textContent = savedFontSize + 'px';
        }

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && savedTheme !== 'normal') {
            document.body.classList.add(savedTheme);
        }
        
        const contrastButtons = document.querySelectorAll('.contrast-btn');
        contrastButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-contrast') === (savedTheme || 'normal')) {
                btn.classList.add('active');
            }
        });
    }

});
