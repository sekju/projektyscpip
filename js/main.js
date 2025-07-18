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
            const firstFocusable = panel.querySelector('h3');
            toggleBtn.addEventListener('click', () => openPanel(panel, firstFocusable, toggleBtn));
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

    function openPanel(panel, firstFocusable, toggleBtn) {
        panel.hidden = false;
        toggleBtn.setAttribute('aria-expanded', 'true');
        setTimeout(() => firstFocusable?.focus(), 50);
    }

    function closePanel(panel, toggleBtn) {
        panel.hidden = true;
        toggleBtn?.setAttribute('aria-expanded', 'false');
        toggleBtn?.focus();
    }

    // --- NAWIGACJA I KLAWIATURA ---
    function initFullContentNavigation() {
        const elements = document.querySelectorAll('h1, h2, h3, h4, p, ul, li, .document-link-wrapper');
        elements.forEach(el => {
            if (!el.closest('nav') && !el.closest('.side-panel') && !el.closest('.modal-overlay')) {
                if (!el.querySelector('a, button')) {
                    el.setAttribute('tabindex', '0');
                }
            }
        });
        document.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '0'));
    }

    function initKeyboardInstructions() {
        const modal = document.getElementById('keyboard-modal');
        if (!modal) return;
        const closeModalBtn = modal.querySelector('.close-modal-btn');
        const showInstructions = (e) => {
            if (e.key !== 'Tab' || sessionStorage.getItem('keyboardInstructionsShown')) return;
            
            modal.hidden = false;
            modal.querySelector('h2').focus();
            sessionStorage.setItem('keyboardInstructionsShown', 'true');
            document.removeEventListener('keydown', showInstructions);
        };
        const closeInstructions = () => {
            modal.hidden = true;
            document.querySelector('.skip-link')?.focus();
        };
        document.addEventListener('keydown', showInstructions);
        closeModalBtn.addEventListener('click', closeInstructions);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.hidden) closeInstructions();
        });
    }

    function initSmoothScrolling() {
        document.querySelectorAll('nav a, #nav-panel-list a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    const headerToFocus = targetElement.querySelector('h2') || targetElement;
                    headerToFocus.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    headerToFocus.focus();
                    const panel = this.closest('.side-panel');
                    if(panel){
                         const toggleBtn = document.getElementById(panel.id.replace('-panel', '-panel-toggle'));
                         closePanel(panel, toggleBtn);
                    }
                }
            });
        });
    }

    // --- LOGIKA WIDŻETU DOSTĘPNOŚCI ---
    function initWidgetFunctionality() {
        document.getElementById('font-decrease').addEventListener('click', () => updateFontSize(-10));
        document.getElementById('font-increase').addEventListener('click', () => updateFontSize(10));
        
        const themeButtons = document.querySelectorAll('.theme-controls button');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                document.body.dataset.theme = theme;
                document.body.className = theme === 'monochrome' ? 'monochrome' : '';
                localStorage.setItem('theme', theme);
                themeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        document.getElementById('reset-settings').addEventListener('click', () => {
            localStorage.clear();
            document.body.style.fontSize = '';
            document.getElementById('font-size-value').textContent = '100%';
            document.body.dataset.theme = 'normal';
            document.body.className = '';
            themeButtons.forEach(b => b.classList.remove('active'));
            document.querySelector('.theme-controls button[data-theme="normal"]').classList.add('active');
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
        if (navPanelList) {
            document.querySelectorAll('main > section[id]').forEach(section => {
                const h2 = section.querySelector('h2');
                if(h2) {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = `#${section.id}`;
                    a.textContent = h2.textContent;
                    li.appendChild(a);
                    navPanelList.appendChild(li);
                }
            });
            initSmoothScrolling();
        }
        
        restoreSettings();
    }

    function updateFontSize(change) {
        const body = document.body;
        const display = document.getElementById('font-size-value');
        let currentSize = parseInt(body.style.fontSize) || 100;
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
        const savedTheme = localStorage.getItem('theme') || 'normal';
        document.body.dataset.theme = savedTheme;
        document.body.className = savedTheme === 'monochrome' ? 'monochrome' : '';
        document.querySelectorAll('.theme-controls button').forEach(b => {
            b.classList.toggle('active', b.dataset.theme === savedTheme);
        });

        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            document.body.style.fontSize = savedFontSize + '%';
            document.getElementById('font-size-value').textContent = savedFontSize + '%';
        }
    }
});
