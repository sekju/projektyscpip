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
                
                // W trybie czytania, przeczytaj alt text przed blokowaniem
                if (state.readingMode) {
                    const img = link.querySelector('img');
                    if (img && img.alt) {
                        console.log('CZYTANIE: Alt text z linka:', img.alt);
                        speak(img.alt);
                    }
                }
                
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

        // POPRAWKA: Globalna obsługa Enter dla wszystkich elementów w trybie czytania
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && state.readingMode && document.activeElement) {
                const activeElement = document.activeElement;
                console.log('ENTER - Element aktywny:', activeElement.tagName, activeElement);
                
                let textToRead = '';
                
                // Jeśli to link z obrazem
                if (activeElement.tagName === 'A') {
                    const img = activeElement.querySelector('img');
                    if (img && img.alt) {
                        textToRead = img.alt;
                        console.log('CZYTANIE ENTER: Alt text z linka:', textToRead);
                    } else if (activeElement.textContent.trim()) {
                        textToRead = activeElement.textContent.trim();
                        console.log('CZYTANIE ENTER: Tekst z linka:', textToRead);
                    }
                    
                    // Sprawdź czy to link do tej samej strony
                    const currentPath = window.location.pathname;
                    try {
                        const linkPath = new URL(activeElement.href, window.location.origin).pathname;
                        const isSamePage = currentPath === linkPath || 
                            (currentPath.endsWith('index.html') && linkPath.endsWith('index.html')) ||
                            (currentPath === '/' && linkPath.endsWith('index.html')) ||
                            (currentPath.endsWith('index.html') && linkPath === '/');
                        
                        if (isSamePage) {
                            console.log('ENTER: Zapobiegam nawigacji do tej samej strony');
                            e.preventDefault();
                        }
                    } catch (error) {
                        console.log('ENTER: Błąd podczas sprawdzania URL:', error);
                    }
                } 
                // Jeśli to obraz
                else if (activeElement.tagName === 'IMG') {
                    textToRead = activeElement.alt;
                    console.log('CZYTANIE ENTER: Alt text obrazu:', textToRead);
                    e.preventDefault();
                }
                // Inne elementy
                else if (!activeElement.matches('button, input, textarea, select')) {
                    textToRead = activeElement.textContent.trim();
                    console.log('CZYTANIE ENTER: Tekst elementu:', textToRead);
                    e.preventDefault();
                }
                
                if (textToRead) {
                    console.log('MÓWIĘ:', textToRead);
                    speak(textToRead);
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
            console.log('KLIK - Tryb czytania - element:', e.target.tagName, e.target);
            
            let textToRead = '';
            
            // Sprawdź typ elementu i pobierz odpowiedni tekst
            if (e.target.tagName === 'IMG') {
                textToRead = e.target.alt;
                console.log('KLIK - Alt text obrazu:', textToRead);
            } else if (e.target.tagName === 'A') {
                const img = e.target.querySelector('img');
                if (img && img.alt) {
                    textToRead = img.alt;
                    console.log('KLIK - Alt text z linka:', textToRead);
                } else {
                    textToRead = e.target.textContent.trim();
                    console.log('KLIK - Tekst z linka:', textToRead);
                }
            } else {
                textToRead = e.target.textContent.trim();
                console.log('KLIK - Tekst elementu:', textToRead);
            }
            
            if (textToRead) {
                console.log('KLIK - MÓWIĘ:', textToRead);
                e.preventDefault();
                speak(textToRead);
            }
        };

        readingToggle.addEventListener('click', () => {
            state.readingMode = !state.readingMode;
            readingToggle.textContent = state.readingMode ? 'Wyłącz czytanie' : 'Włącz czytanie';
            readingToggle.setAttribute('aria-pressed', String(state.readingMode));
            console.log('Tryb czytania:', state.readingMode ? 'WŁĄCZONY' : 'WYŁĄCZONY');

            if (state.readingMode) {
                // Test czy speech synthesis działa
                speak("Tryb czytania włączony");
                document.addEventListener('click', handleReading, true);
            } else {
                speechSynthesis.cancel();
                document.removeEventListener('click', handleReading, true);
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
        if (!text || typeof speechSynthesis === 'undefined') {
            console.log('SPEAK: Brak tekstu lub brak obsługi speechSynthesis');
            return;
        }
        
        console.log('SPEAK: Próbuję odczytać:', text);
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
        console.log('SPEAK: Polecenie speak() wydane');
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
