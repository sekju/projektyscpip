document.addEventListener('DOMContentLoaded', function () {
    const state = {
        readingMode: false
    };

    // --- GŁÓWNE WYWOŁANIE FUNKCJI ---
    console.log('=== INICJALIZACJA STRONY ===');
    console.log('speechSynthesis dostępny:', typeof speechSynthesis !== 'undefined');
    
    initPanels();
    initFullContentNavigation();
    initKeyboardInstructions();
    initWidgetFunctionality();
    initSmoothScrolling();
    initSamePageLinkFix();

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
        const elements = document.querySelectorAll('h1, h2, h3, h4, p, ul, li, .document-link-wrapper, img');
        elements.forEach(el => {
            if (!el.closest('nav') && !el.closest('.side-panel') && !el.closest('.modal-overlay')) {
                const isInteractive = el.querySelector('a, button');
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

    // --- NAPRAWIENIE PROBLEMU Z RESETEM STRONY ---
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
    }
    
    // --- TRYB CZYTANIA ZGODNY Z WCAG 2.1 ---
    function handleFocusReading(e) {
        if (!state.readingMode) return;
        if (e.target.closest('.side-panel') || e.target.closest('.panel-toggles')) return;
        
        const element = e.target;
        let textToRead = '';
        
        console.log('FOCUS: Element otrzymał focus:', element.tagName, element);
        
        // Pobierz tekst do przeczytania na podstawie typu elementu
        if (element.tagName === 'IMG') {
            textToRead = element.alt;
            console.log('FOCUS: Alt text obrazu:', textToRead);
        } else if (element.tagName === 'A') {
            const img = element.querySelector('img');
            if (img && img.alt) {
                textToRead = img.alt;
                console.log('FOCUS: Alt text obrazu w linku:', textToRead);
            } else {
                textToRead = element.textContent.trim();
                console.log('FOCUS: Tekst linka:', textToRead);
            }
        } else if (element.tagName === 'BUTTON') {
            textToRead = element.textContent.trim() || element.getAttribute('aria-label');
            console.log('FOCUS: Tekst przycisku:', textToRead);
        } else {
            textToRead = element.textContent.trim();
            console.log('FOCUS: Tekst elementu:', textToRead);
        }
        
        if (textToRead) {
            console.log('FOCUS: Czytam automatycznie:', textToRead);
            speak(textToRead);
        }
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
            console.log('Ustawienia zresetowane');
        });
        
        // NOWA LOGIKA TRYBU CZYTANIA - zgodna z WCAG 2.1
        const readingToggle = document.getElementById('reading-toggle');
        
        readingToggle.addEventListener('click', () => {
            state.readingMode = !state.readingMode;
            readingToggle.textContent = state.readingMode ? 'Wyłącz czytanie' : 'Włącz czytanie';
            readingToggle.setAttribute('aria-pressed', String(state.readingMode));
            console.log('Tryb czytania:', state.readingMode ? 'WŁĄCZONY' : 'WYŁĄCZONY');

            if (state.readingMode) {
                // Test funkcjonalności + dodanie event listenera dla focus
                speak("Tryb czytania włączony. Nawiguj klawiszem Tab, aby słyszeć treść elementów.");
                document.addEventListener('focus', handleFocusReading, true);
            } else {
                // Wyłącz czytanie i usuń event listener
                speechSynthesis.cancel();
                document.removeEventListener('focus', handleFocusReading, true);
                speak("Tryb czytania wyłączony.");
            }
        });

        // Generowanie nawigacji w panelu
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
        if (!text || typeof speechSynthesis === 'undefined') {
            console.log('SPEAK: Brak tekstu lub brak obsługi speechSynthesis');
            return;
        }
        
        console.log('SPEAK: Czytam:', text);
        speechSynthesis.cancel(); // Zatrzymaj poprzednie czytanie
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pl-PL';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => console.log('SPEAK: Rozpoczęto czytanie');
        utterance.onend = () => console.log('SPEAK: Zakończono czytanie');
        utterance.onerror = (e) => console.log('SPEAK: Błąd:', e);
        
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
