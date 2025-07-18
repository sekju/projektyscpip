/**
 * =================================================================================
 * Wersja finalna, naprawiona i kompletna: main.js
 * - Naprawiono błąd z modalem, stylami fokusu i niedziałającymi trybami.
 * - Przywrócono i zintegrowano wszystkie funkcje widżetu (czcionka, kontrast, czytanie).
 * - Zapewniono pełną, liniową nawigację klawiszem TAB po całej treści strony.
 * - Naprawiono działanie linków w panelu nawigacyjnym i menu głównym.
 * =================================================================================
 */
document.addEventListener('DOMContentLoaded', function () {
    const state = {
        readingMode: false
    };

    // --- GŁÓWNE WYWOŁANIE FUNKCJI ---
    initPanels();
    initFullContentNavigation();
    initKeyboardInstructions();
    initWidgetFunctionality();
    initSmoothScrolling();

    // --- INICJALIZACJA PANELI I MODALI ---
    function initPanels() {
        const panels = [
            { id: 'nav-panel', toggleBtnId: 'nav-panel-toggle' },
            { id: 'a11y-panel', toggleBtnId: 'a11y-panel-toggle' }
        ];

        panels.forEach(panelConfig => {
            const panel = document.getElementById(panelConfig.id);
            const toggleBtn = document.getElementById(panelConfig.toggleBtnId);
            if (!panel || !toggleBtn) return;
            
            const closeBtn = panel.querySelector('.close-panel-btn');

            toggleBtn.addEventListener('click', () => openPanel(panel));
            closeBtn.addEventListener('click', () => closePanel(panel, toggleBtn));
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.side-panel:not([hidden])').forEach(p => {
                    const toggleBtn = document.getElementById(p.id.replace('-panel', '-panel-toggle'));
                    closePanel(p, toggleBtn);
                });
            }
        });
    }
    
    function openPanel(panel) {
        panel.hidden = false;
        const firstFocusable = panel.querySelector('h3, button');
        setTimeout(() => firstFocusable?.focus(), 50); // Krótkie opóźnienie dla pewności
    }

    function closePanel(panel, toggleBtn) {
        panel.hidden = true;
        toggleBtn?.focus();
    }

    // --- NAWIGACJA I KLAWIATURA ---
    function initFullContentNavigation() {
        const elements = document.querySelectorAll('h1, h2, h3, h4, p, ul, li, .document-link-wrapper');
        elements.forEach(el => {
             // Unikamy dodawania tabindex do list, które same zawierają linki (jak menu nav)
            if (!el.querySelector('a')) {
                 el.setAttribute('tabindex', '0');
            }
        });
        document.querySelectorAll('nav a, footer a, .contact-info a, .document-link-wrapper a').forEach(el => el.setAttribute('tabindex', '0'));
    }

    function initKeyboardInstructions() {
        const modal = document.getElementById('keyboard-modal');
        if (!modal) return;
        const closeModalBtn = modal.querySelector('.close-modal-btn');

        const showInstructions = (e) => {
            if (e.key !== 'Tab' || sessionStorage.getItem('keyboardInstructionsShown')) return;
            
            modal.hidden = false;
            closeModalBtn.focus();
            sessionStorage.setItem('keyboardInstructionsShown', 'true');
            document.removeEventListener('keydown', showInstructions);
        };

        const closeInstructions = () => {
            modal.hidden = true;
            document.body.focus(); // Przenieś fokus z powrotem na stronę
        };
        
        document.addEventListener('keydown', showInstructions);
        closeModalBtn.addEventListener('click', closeInstructions);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.hidden) closeInstructions();
        });
    }

    function initSmoothScrolling() {
        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    const headerToFocus = targetElement.querySelector('h2') || targetElement;
                    headerToFocus.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    headerToFocus.focus();
                }
            });
        });
    }

    // --- LOGIKA WIDŻETU DOSTĘPNOŚCI ---
    function initWidgetFunctionality() {
        document.getElementById('font-decrease').addEventListener('click', () => updateFontSize(-10));
        document.getElementById('font-increase').addEventListener('click', () => updateFontSize(10));
        
        document.querySelectorAll('.theme-controls button').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                document.body.dataset.theme = theme;
                document.body.className = theme === 'monochrome' ? 'monochrome' : '';
                localStorage.setItem('theme', theme);
            });
        });
        
        document.getElementById('reset-settings').addEventListener('click', () => {
            localStorage.clear();
            document.body.style.fontSize = '';
            document.getElementById('font-size-value').textContent = '100%';
            document.body.dataset.theme = 'normal';
            document.body.className = '';
        });
        
        const readingToggle = document.getElementById('reading-toggle');
        readingToggle.addEventListener('click', () => {
            state.readingMode = !state.readingMode;
            readingToggle.textContent = state.readingMode ? 'Wyłącz czytanie' : 'Włącz czytanie';
            readingToggle.setAttribute('aria-pressed', String(state.readingMode));
        });
        
        document.addEventListener('keydown', (e) => {
            if (state.readingMode && e.key === 'Enter' && document.activeElement && !document.activeElement.matches('button, a')) {
                e.preventDefault();
                const text = document.activeElement.innerText;
                if (text) speak(text);
            }
        });

        const navPanelList = document.getElementById('nav-panel-list');
        document.querySelectorAll('main > section[id]').forEach(section => {
            const h2 = section.querySelector('h2');
            if(h2) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${section.id}`;
                a.textContent = h2.textContent;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    h2.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    h2.focus();
                    closePanel(document.getElementById('nav-panel'), document.getElementById('nav-panel-toggle'));
                });
                li.appendChild(a);
                navPanelList.appendChild(li);
            }
        });
        
        restoreSettings();
    }

    function updateFontSize(change) {
        const body = document.body;
        const display = document.getElementById('font-size-value');
        let currentSize = parseInt(body.style.fontSize || 100);
        currentSize += change;
        if (currentSize < 70) currentSize = 70;
        if (currentSize > 150) currentSize = 150;
        body.style.fontSize = currentSize + '%';
        display.textContent = currentSize + '%';
        localStorage.setItem('fontSize', currentSize);
    }
    
    function speak(text) {
        if (!text || typeof speechSynthesis === 'undefined') return;
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pl-PL';
        speechSynthesis.speak(utterance);
    }

    function restoreSettings() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.dataset.theme = savedTheme;
            document.body.className = savedTheme === 'monochrome' ? 'monochrome' : '';
        }

        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            document.body.style.fontSize = savedFontSize + '%';
            document.getElementById('font-size-value').textContent = savedFontSize + '%';
        }
    }
});
