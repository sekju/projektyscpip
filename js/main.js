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
    initSamePageLinkFix(); // POPRAWKA: Nowa funkcja

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

    // POPRAWKA: Naprawienie problemu z resetem strony na linkach do tej samej strony
    function initSamePageLinkFix() {
        console.log('Inicjalizacja naprawy linków do tej samej strony');
        document.querySelectorAll('a[href="index.html"], a[href="../index.html"], a[href="./index.html"]').forEach(link => {
            link.addEventListener('click', function(e) {
                console.log('Kliknięto link do tej samej strony:', link.href);
                const currentPath = window.location.pathname;
                const linkPath = new URL(link.href, window.location.origin).pathname;
                
                // Jeśli link prowadzi do tej samej strony, nie rób nic
                if (currentPath === linkPath || 
                    (currentPath.endsWith('index.html') && linkPath.endsWith('index.html')) ||
                    (currentPath === '/' && linkPath.endsWith('index.html')) ||
                    (currentPath.endsWith('index.html') && linkPath === '/')) {
                    console.log('Zapobiegam odświeżeniu strony - link prowadzi do tej samej strony');
                    e.preventDefault();
                    return false;
                }
            });
        });

        // POPRAWKA: Dodanie obsługi klawiszy dla obrazów bez resetowania strony
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const activeElement = document.activeElement;
                console.log('Wciśnięto Enter na elemencie:', activeElement.tagName, activeElement);
                
                // Jeśli aktywny element to link zawierający obraz
                if (activeElement && activeElement.tagName === 'A') {
                    const img = activeElement.querySelector('img');
                    if (img) {
                        console.log('Element aktywny to link z obrazem');
                        const currentPath = window.location.pathname;
                        const linkPath = new URL(activeElement.href, window.location.origin).pathname;
                        
                        // Jeśli link prowadzi do tej samej strony
                        if (currentPath === linkPath || 
                            (currentPath.endsWith('index.html') && linkPath.endsWith('index.html')) ||
                            (currentPath === '/' && linkPath.endsWith('index.html')) ||
                            (currentPath.endsWith('index.html') && linkPath === '/')) {
                            console.log('Zapobiegam odświeżeniu strony - Enter na linku z obrazem do tej samej strony');
                            e.preventDefault();
                            return false;
                        }
                    }
                }
            }
        });
    }

    // --- NAWIGACJA I KLAWIATURA ---
    function initFullContentNavigation() {
        const elements = document.querySelectorAll('h1, h2, h3, h4, p, ul, li, .document-link-wrapper, img');
        elements.forEach(el => {
            if (!el.closest('nav') && !el.closest('.side-panel') && !el.closest('.modal-overlay')) {
                const isInteractive = el.querySelector('a, button');
                // POPRAWKA: Nie dodawaj tabindex do obrazów wewnątrz linków
                const isImageInLink = el.tagName === 'IMG' && el.closest('a');
                if (!isInteractive && !isImageInLink) {
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
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        const headerToFocus = targetElement.querySelector('h2') || targetElement;
                        headerToFocus.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        headerToFocus.focus();
                        const panel = this.closest('.side-panel');
                        if (panel) {
                             const toggleBtn = document.getElementById(panel.id.replace('-panel', '-panel-toggle'));
                             closePanel(panel, toggleBtn);
                        }
                    }
                } else {
                    window.location.href = href;
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
        const handleReading = (e) => {
             if (e.target.closest('.side-panel') || e.target.closest('.panel-toggles')) return;
             console.log('Tryb czytania - kliknięto element:', e.target);
             e.preventDefault();
             const textToRead = e.target.alt || e.target.innerText;
             if (textToRead) {
                 console.log('Czytam tekst:', textToRead);
                 speak(textToRead);
             }
        };
        const handleReadingOnEnter = (e) => {
            if (state.readingMode && e.key === 'Enter' && document.activeElement && !document.activeElement.matches('button, a')) {
                console.log('Tryb czytania - Enter na elemencie:', document.activeElement);
                e.preventDefault();
                const textToRead = document.activeElement.alt || document.activeElement.innerText;
                if (textToRead) {
                    console.log('Czytam tekst (Enter):', textToRead);
                    speak(textToRead);
                }
            }
        };

        readingToggle.addEventListener('click', () => {
            state.readingMode = !state.readingMode;
            readingToggle.textContent = state.readingMode ? 'Wyłącz czytanie' : 'Włącz czytanie';
            readingToggle.setAttribute('aria-pressed', String(state.readingMode));
            console.log('Tryb czytania:', state.readingMode ? 'WŁĄCZONY' : 'WYŁĄCZONY');

            if (state.readingMode) {
                document.addEventListener('click', handleReading, true);
                document.addEventListener('keydown', handleReadingOnEnter, true);
            } else {
                speechSynthesis.cancel();
                document.removeEventListener('click', handleReading, true);
                document.removeEventListener('keydown', handleReadingOnEnter, true);
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
