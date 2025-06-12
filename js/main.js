// Główny plik JavaScript dla strony SCPIP z funkcjami dostępności
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicjalizacja wszystkich funkcji dostępności
    initAccessibilityWidget();
    initSmoothScrolling();
    initKeyboardNavigation();
    initImageErrorHandling();
    initDocumentTracking();
    initLastModified();
    initScrollDetection();
    restoreAccessibilitySettings();

    // Smooth scrolling dla linków nawigacyjnych
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Ustaw fokus na docelowym elemencie dla czytników ekranu
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            });
        });
    }

    // Ulepszona nawigacja klawiaturą
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
            
            // Escape zamyka panel dostępności
            if (e.key === 'Escape') {
                closeAccessibilityPanel();
            }
            
            // Strzałki w nawigacji
            if (e.target.closest('nav')) {
                handleNavigationArrows(e);
            }
            
            // Enter i Spacja dla elementów z role="button"
            if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute('role') === 'button') {
                e.preventDefault();
                e.target.click();
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('using-keyboard');
        });
        
        // Dodaj obsługę strzałek w nawigacji
        function handleNavigationArrows(e) {
            const navLinks = Array.from(document.querySelectorAll('nav a[role="menuitem"]'));
            const currentIndex = navLinks.indexOf(e.target);
            
            if (currentIndex === -1) return;
            
            let nextIndex;
            
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    nextIndex = (currentIndex + 1) % navLinks.length;
                    // Ustaw tabindex
                    navLinks.forEach((link, index) => {
                        link.tabIndex = index === nextIndex ? 0 : -1;
                    });
                    navLinks[nextIndex].focus();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    nextIndex = currentIndex === 0 ? navLinks.length - 1 : currentIndex - 1;
                    // Ustaw tabindex
                    navLinks.forEach((link, index) => {
                        link.tabIndex = index === nextIndex ? 0 : -1;
                    });
                    navLinks[nextIndex].focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    navLinks.forEach((link, index) => {
                        link.tabIndex = index === 0 ? 0 : -1;
                    });
                    navLinks[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    const lastIndex = navLinks.length - 1;
                    navLinks.forEach((link, index) => {
                        link.tabIndex = index === lastIndex ? 0 : -1;
                    });
                    navLinks[lastIndex].focus();
                    break;
            }
        }
        
        // Dodaj skip links
        addSkipLinks();
    }
    
    // Dodaj skip links dla lepszej nawigacji klawiaturą
    function addSkipLinks() {
        const skipNav = document.createElement('nav');
        skipNav.setAttribute('aria-label', 'Skip links');
        skipNav.innerHTML = `
            <a href="#main-content" class="skip-nav">Przejdź do głównej treści</a>
            <a href="nav" class="skip-nav">Przejdź do nawigacji</a>
            <a href="#footer" class="skip-nav">Przejdź do stopki</a>
        `;
        document.body.insertBefore(skipNav, document.body.firstChild);
    }

    // Funkcja do śledzenia pobierania dokumentów
    function initDocumentTracking() {
        const documentLinks = document.querySelectorAll('a[download]');
        documentLinks.forEach(link => {
            link.addEventListener('click', function() {
                const fileName = this.getAttribute('href').split('/').pop();
                console.log('Pobieranie dokumentu:', fileName);
                announceToScreenReader(`Rozpoczęto pobieranie dokumentu: ${fileName}`);
            });
        });
    }

    // Sprawdzenie dostępności obrazów i obsługa błędów
    function initImageErrorHandling() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Sprawdź czy obraz ma atrybut alt
            if (!img.hasAttribute('alt')) {
                console.warn('Obraz bez atrybutu alt:', img.src);
                img.setAttribute('alt', 'Obraz bez opisu - wymagana aktualizacja');
                img.setAttribute('aria-label', 'Obraz bez opisu - wymagana aktualizacja');
                
                // Dodaj wizualny wskaźnik dla deweloperów
                img.style.border = '2px dashed #ff0000';
                img.title = 'UWAGA: Ten obraz nie ma atrybutu alt';
            }
            
            // Sprawdź czy alt nie jest pusty
            if (img.hasAttribute('alt') && img.alt.trim() === '') {
                console.warn('Obraz z pustym atrybutem alt:', img.src);
                img.setAttribute('alt', 'Obraz dekoracyjny');
                img.setAttribute('aria-hidden', 'true');
            }
            
            // Obsługa błędów ładowania
            img.addEventListener('error', function() {
                this.style.display = 'none';
                console.warn('Nie można załadować obrazu:', this.src);
                
                // Dodaj alternatywny tekst dla czytników ekranu
                const altText = document.createElement('div');
                altText.textContent = this.alt || 'Obraz niedostępny';
                altText.className = 'image-placeholder';
                altText.setAttribute('role', 'img');
                altText.setAttribute('aria-label', this.alt || 'Obraz niedostępny');
                this.parentNode.insertBefore(altText, this.nextSibling);
            });
            
            // Dodaj obsługę dla obrazów które się załadowały ale mogą mieć problemy z dostępnością
            img.addEventListener('load', function() {
                // Sprawdź czy alt text jest opisowy
                if (this.alt && (this.alt.toLowerCase().includes('image') ||
                                this.alt.toLowerCase().includes('photo') ||
                                this.alt.toLowerCase().includes('picture'))) {
                    console.warn('Obraz z nieopisowym tekstem alt:', this.src, this.alt);
                }
            });
        });
        
        // Dodaj funkcję sprawdzającą wszystkie obrazy na stronie
        checkAllImagesAccessibility();
    }
    
    // Funkcja sprawdzająca dostępność wszystkich obrazów
    function checkAllImagesAccessibility() {
        const images = document.querySelectorAll('img');
        let issuesFound = 0;
        
        images.forEach((img, index) => {
            const issues = [];
            
            if (!img.hasAttribute('alt')) {
                issues.push('Brak atrybutu alt');
                issuesFound++;
            }
            
            if (img.hasAttribute('alt') && img.alt.trim() === '' && !img.hasAttribute('aria-hidden')) {
                issues.push('Pusty alt bez aria-hidden');
                issuesFound++;
            }
            
            if (img.alt && img.alt.length > 125) {
                issues.push('Alt text zbyt długi (>125 znaków)');
                issuesFound++;
            }
            
            if (issues.length > 0) {
                console.warn(`Obraz ${index + 1} (${img.src}):`, issues);
            }
        });
        
        if (issuesFound > 0) {
            console.warn(`Znaleziono ${issuesFound} problemów z dostępnością obrazów`);
            announceToScreenReader(`Uwaga: Znaleziono ${issuesFound} problemów z dostępnością obrazów na stronie`);
        }
    }

    // Dodanie informacji o ostatniej aktualizacji strony
    function initLastModified() {
        const footer = document.querySelector('footer .container');
        if (footer) {
            const lastModified = document.lastModified;
            const updateInfo = document.createElement('p');
            updateInfo.style.marginTop = '1rem';
            updateInfo.style.fontSize = '0.9em';
            updateInfo.style.color = '#666';
            updateInfo.innerHTML = `<small>Ostatnia aktualizacja: ${lastModified}</small>`;
            footer.appendChild(updateInfo);
        }
    }

    // Funkcja wykrywania przewijania dla skip-link
    function initScrollDetection() {
        let scrollTimeout;
        
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY > 100;
            
            if (scrolled) {
                document.body.classList.add('scrolled');
            } else {
                document.body.classList.remove('scrolled');
            }
            
            // Wyczyść poprzedni timeout
            clearTimeout(scrollTimeout);
            
            // Ustaw nowy timeout
            scrollTimeout = setTimeout(function() {
                // Dodatkowa logika po zakończeniu przewijania jeśli potrzebna
            }, 150);
        });
    }

    // Inicjalizacja widżetu dostępności
    function initAccessibilityWidget() {
        const toggle = document.getElementById('accessibility-toggle');
        const panel = document.getElementById('accessibility-panel');
        const closeBtn = document.getElementById('close-accessibility');
        
        // Przełączanie panelu dostępności
        toggle.addEventListener('click', function() {
            const isOpen = panel.getAttribute('aria-hidden') === 'false';
            if (isOpen) {
                closeAccessibilityPanel();
            } else {
                openAccessibilityPanel();
            }
        });

        // Zamykanie panelu
        closeBtn.addEventListener('click', closeAccessibilityPanel);

        // Inicjalizacja kontrolek rozmiaru czcionki
        initFontSizeControls();
        
        // Inicjalizacja kontrolek kontrastu
        initContrastControls();
        
        // Inicjalizacja funkcji czytania tekstu
        initTextToSpeech();
        
        // Inicjalizacja nawigacji
        initNavigationControls();
        
        // Inicjalizacja pomocy
        initHelpControls();
        
        // Reset ustawień
        document.getElementById('reset-settings').addEventListener('click', resetAllSettings);
        
        // Inicjalizacja kliknięć do czytania
        initClickToRead();
    }

    function openAccessibilityPanel() {
        const panel = document.getElementById('accessibility-panel');
        const toggle = document.getElementById('accessibility-toggle');
        
        panel.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        
        // Ustaw fokus na pierwszym elemencie w panelu
        const firstFocusable = panel.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        announceToScreenReader('Panel dostępności został otwarty');
    }

    function closeAccessibilityPanel() {
        const panel = document.getElementById('accessibility-panel');
        const toggle = document.getElementById('accessibility-toggle');
        
        panel.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        
        announceToScreenReader('Panel dostępności został zamknięty');
    }

    // Kontrolki rozmiaru czcionki
    function initFontSizeControls() {
        const slider = document.getElementById('font-size-slider');
        const decreaseBtn = document.getElementById('font-decrease');
        const increaseBtn = document.getElementById('font-increase');
        const valueDisplay = document.getElementById('font-size-value');

        function updateFontSize(size) {
            document.documentElement.style.setProperty('--font-size-base', size + 'px');
            slider.value = size;
            valueDisplay.textContent = size + 'px';
            localStorage.setItem('fontSize', size);
            announceToScreenReader(`Rozmiar czcionki zmieniony na ${size} pikseli`);
        }

        slider.addEventListener('input', function() {
            updateFontSize(parseInt(this.value));
        });

        decreaseBtn.addEventListener('click', function() {
            const currentSize = parseInt(slider.value);
            const newSize = Math.max(12, currentSize - 1);
            updateFontSize(newSize);
        });

        increaseBtn.addEventListener('click', function() {
            const currentSize = parseInt(slider.value);
            const newSize = Math.min(24, currentSize + 1);
            updateFontSize(newSize);
        });
    }

    // Kontrolki kontrastu
    function initContrastControls() {
        const contrastButtons = document.querySelectorAll('.contrast-btn');
        
        contrastButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const theme = this.getAttribute('data-contrast');
                setTheme(theme);
                
                // Aktualizuj aktywny przycisk
                contrastButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeNames = {
            'normal': 'normalny',
            'high': 'wysoki kontrast',
            'mono': 'monochromatyczny',
            'dark': 'tryb ciemny'
        };
        
        announceToScreenReader(`Zmieniono motyw na ${themeNames[theme] || theme}`);
    }

    // Funkcje czytania tekstu (Text-to-Speech)
    function initTextToSpeech() {
        let currentUtterance = null;
        let isReading = false;
        
        document.getElementById('read-page').addEventListener('click', function() {
            if (isReading) {
                speechSynthesis.cancel();
                isReading = false;
                disableClickToRead();
                this.textContent = 'Czytaj stronę';
                announceToScreenReader('Zatrzymano czytanie strony');
                return;
            }
            
            readPageContent();
            enableClickToRead();
            this.textContent = 'Zatrzymaj czytanie';
        });

        document.getElementById('pause-reading').addEventListener('click', function() {
            if (speechSynthesis.speaking && !speechSynthesis.paused) {
                speechSynthesis.pause();
                this.textContent = 'Wznów';
                announceToScreenReader('Czytanie zostało wstrzymane');
            } else if (speechSynthesis.paused) {
                speechSynthesis.resume();
                this.textContent = 'Pauza';
                announceToScreenReader('Wznowiono czytanie');
            }
        });

        document.getElementById('stop-reading').addEventListener('click', function() {
            speechSynthesis.cancel();
            isReading = false;
            disableClickToRead();
            removeReadingHighlights();
            document.getElementById('read-page').textContent = 'Czytaj stronę';
            document.getElementById('pause-reading').textContent = 'Pauza';
            announceToScreenReader('Czytanie zostało zatrzymane');
        });

        function readPageContent() {
            const content = document.querySelector('main');
            const textContent = extractTextContent(content);
            
            if (textContent.trim()) {
                isReading = true;
                speakText(textContent);
                announceToScreenReader('Rozpoczęto czytanie strony');
            }
        }

        function extractTextContent(element) {
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        const parent = node.parentElement;
                        if (parent.style.display === 'none' ||
                            parent.classList.contains('sr-only') ||
                            parent.tagName === 'SCRIPT' ||
                            parent.tagName === 'STYLE') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            let text = '';
            let node;
            while (node = walker.nextNode()) {
                text += node.textContent + ' ';
            }
            
            return text.replace(/\s+/g, ' ').trim();
        }

        function speakText(text) {
            currentUtterance = new SpeechSynthesisUtterance(text);
            currentUtterance.lang = 'pl-PL';
            currentUtterance.rate = 0.8;
            currentUtterance.pitch = 1;
            
            currentUtterance.onend = function() {
                isReading = false;
                removeReadingHighlights();
            };
            
            speechSynthesis.speak(currentUtterance);
        }

        function removeReadingHighlights() {
            document.querySelectorAll('.reading-highlight').forEach(el => {
                el.classList.remove('reading-highlight');
            });
        }
    }

    // Globalna funkcja removeReadingHighlights dla kompatybilności
    function removeReadingHighlights() {
        document.querySelectorAll('.reading-highlight').forEach(el => {
            el.classList.remove('reading-highlight');
        });
    }

    // Kontrolki nawigacji
    function initNavigationControls() {
        let currentSectionIndex = -1;
        
        document.getElementById('focus-main').addEventListener('click', function() {
            const sections = document.querySelectorAll('main section');
            
            if (sections.length === 0) {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.setAttribute('tabindex', '-1');
                    mainContent.focus();
                    announceToScreenReader('Przeszedłeś do głównej treści');
                    
                    // Odtwarzaj od początku treści głównej
                    if (window.clickToReadEnabled) {
                        setTimeout(() => {
                            readSectionContent(mainContent);
                        }, 500);
                    }
                }
                return;
            }
            
            // Przejdź do kolejnej sekcji
            currentSectionIndex = (currentSectionIndex + 1) % sections.length;
            const targetSection = sections[currentSectionIndex];
            
            if (targetSection) {
                targetSection.setAttribute('tabindex', '-1');
                targetSection.focus();
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                const sectionTitle = targetSection.querySelector('h2, h3, h4');
                const sectionName = sectionTitle ? sectionTitle.textContent : `Sekcja ${currentSectionIndex + 1}`;
                announceToScreenReader(`Przeszedłeś do sekcji: ${sectionName}`);
                
                // Odtwarzaj od początku sekcji po przewinięciu
                if (window.clickToReadEnabled) {
                    setTimeout(() => {
                        readSectionContent(targetSection);
                    }, 500);
                }
            }
        });

        document.getElementById('focus-nav').addEventListener('click', function() {
            const nav = document.querySelector('nav');
            if (nav) {
                const firstLink = nav.querySelector('a');
                if (firstLink) {
                    firstLink.focus();
                    announceToScreenReader('Przeszedłeś do menu nawigacji');
                }
            }
        });
    }

    // Funkcja do czytania zawartości sekcji od początku
    function readSectionContent(section) {
        const textContent = extractTextContent(section);
        if (textContent.trim()) {
            // Podświetl sekcję podczas czytania
            removeReadingHighlights();
            section.classList.add('reading-highlight');
            
            speakText(textContent);
            
            // Usuń podświetlenie po zakończeniu czytania
            setTimeout(() => {
                section.classList.remove('reading-highlight');
            }, Math.max(5000, textContent.length * 50)); // Dostosuj czas do długości tekstu
        }
    }

    // Reset wszystkich ustawień
    function resetAllSettings() {
        // Reset rozmiaru czcionki
        document.documentElement.style.removeProperty('--font-size-base');
        document.getElementById('font-size-slider').value = 16;
        document.getElementById('font-size-value').textContent = '16px';
        
        // Reset motywu
        document.documentElement.removeAttribute('data-theme');
        document.querySelectorAll('.contrast-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-contrast') === 'normal') {
                btn.classList.add('active');
            }
        });
        
        // Zatrzymaj czytanie
        speechSynthesis.cancel();
        
        // Wyczyść localStorage
        localStorage.removeItem('fontSize');
        localStorage.removeItem('theme');
        
        announceToScreenReader('Wszystkie ustawienia dostępności zostały zresetowane');
    }

    // Przywracanie ustawień z localStorage
    function restoreAccessibilitySettings() {
        // Przywróć rozmiar czcionki
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            document.documentElement.style.setProperty('--font-size-base', savedFontSize + 'px');
            document.getElementById('font-size-slider').value = savedFontSize;
            document.getElementById('font-size-value').textContent = savedFontSize + 'px';
        }
        
        // Przywróć motyw
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            document.querySelectorAll('.contrast-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-contrast') === savedTheme) {
                    btn.classList.add('active');
                }
            });
        } else {
            // Ustaw domyślny aktywny przycisk
            const normalBtn = document.querySelector('[data-contrast="normal"]');
            if (normalBtn) {
                normalBtn.classList.add('active');
            }
        }
    }

    // Funkcja pomocnicza do ogłaszania komunikatów czytnikowi ekranu
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Usuń po 1 sekundzie
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Funkcje pomocy i instrukcji
    function initHelpControls() {
        document.getElementById('keyboard-help').addEventListener('click', showKeyboardHelp);
        document.getElementById('read-help').addEventListener('click', readInstructions);
    }

    function showKeyboardHelp() {
        const helpText = `
        Instrukcja nawigacji klawiaturą:
        
        Tab - przechodzenie między elementami
        Shift + Tab - przechodzenie wstecz
        Enter lub Spacja - aktywacja przycisku lub linku
        Escape - zamknięcie panelu dostępności
        Strzałki - nawigacja w menu
        
        Skróty klawiszowe:
        Alt + A - otwórz panel dostępności
        Alt + M - przejdź do menu głównego
        Alt + C - przejdź do treści głównej
        
        Funkcje dostępności:
        - Użyj suwaka lub przycisków A-/A+ do zmiany rozmiaru czcionki
        - Wybierz tryb kontrastu odpowiedni dla Twoich potrzeb
        - Kliknij "Czytaj stronę" aby włączyć czytanie tekstu
        - Kliknij dowolny element na stronie aby go przeczytać
        `;
        
        alert(helpText);
        announceToScreenReader('Wyświetlono instrukcję nawigacji klawiaturą');
    }

    function readInstructions() {
        const instructionText = `
        Witamy w panelu dostępności.
        
        Rozmiar czcionki: Użyj suwaka lub przycisków A minus i A plus aby dostosować rozmiar tekstu od 12 do 24 pikseli.
        
        Kontrast: Wybierz jeden z czterech trybów:
        - Normalny: standardowe kolory strony
        - Wysoki: zwiększony kontrast z jasnymi kolorami na ciemnym tle
        - Monochromatyczny: czarno-biały tryb dla osób z problemami z rozróżnianiem kolorów
        - Ciemny: ciemny motyw łagodny dla oczu
        
        Czytanie tekstu:
        - Czytaj stronę: rozpoczyna czytanie całej strony
        - Pauza: wstrzymuje czytanie
        - Stop: zatrzymuje czytanie
        - Możesz także kliknąć dowolny element na stronie aby go przeczytać
        
        Nawigacja: Użyj przycisków aby szybko przejść do głównej treści lub menu nawigacji.
        
        Wszystkie ustawienia są automatycznie zapisywane i przywracane przy następnej wizycie.
        `;
        
        speakText(instructionText);
        announceToScreenReader('Rozpoczęto czytanie instrukcji obsługi');
    }

    // Funkcja kliknięcia do czytania
    function initClickToRead() {
        // Globalne zmienne dla funkcji
        window.clickToReadEnabled = false;
        window.enableClickToRead = enableClickToRead;
        window.disableClickToRead = disableClickToRead;
        
        // Zmienne do obsługi dwukrotnego kliknięcia w linki
        let linkClickStates = new Map();
        let clickTimeout = null;

        function enableClickToRead() {
            window.clickToReadEnabled = true;
            
            // Dodaj event listener do wszystkich elementów tekstowych
            const readableElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, div:not(.accessibility-widget):not(.accessibility-panel), img');
            
            readableElements.forEach(element => {
                element.addEventListener('click', handleClickToRead, true);
                element.setAttribute('data-readable', 'true');
                element.style.cursor = 'help';
                element.title = 'Kliknij aby przeczytać';
            });
            
            // Dodaj specjalną obsługę dla linków
            const links = document.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', handleLinkClick, true);
                link.setAttribute('data-link-readable', 'true');
                link.style.cursor = 'help';
                link.title = 'Pierwsze kliknięcie czyta tekst, drugie otwiera link';
            });
            
            announceToScreenReader('Włączono tryb czytania kliknięć. Kliknij tekst aby go przeczytać. Pierwsze kliknięcie w link czyta tekst, drugie otwiera link.');
        }

        function disableClickToRead() {
            window.clickToReadEnabled = false;
            
            // Usuń event listenery z elementów tekstowych
            const readableElements = document.querySelectorAll('[data-readable="true"]');
            readableElements.forEach(element => {
                element.removeEventListener('click', handleClickToRead, true);
                element.style.cursor = '';
                element.removeAttribute('data-readable');
                element.removeAttribute('title');
            });
            
            // Usuń event listenery z linków
            const links = document.querySelectorAll('[data-link-readable="true"]');
            links.forEach(link => {
                link.removeEventListener('click', handleLinkClick, true);
                link.style.cursor = '';
                link.removeAttribute('data-link-readable');
                link.removeAttribute('title');
            });
            
            // Wyczyść stany kliknięć
            linkClickStates.clear();
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }
            
            announceToScreenReader('Wyłączono tryb czytania kliknięć.');
        }

        function handleLinkClick(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const link = event.currentTarget;
            const linkId = link.href || link.textContent;
            
            if (linkClickStates.has(linkId)) {
                // Drugie kliknięcie - otwórz link
                linkClickStates.delete(linkId);
                announceToScreenReader('Otwieranie linku');
                
                // Symuluj kliknięcie bez event listenera
                setTimeout(() => {
                    if (link.download) {
                        // Dla linków do pobrania
                        window.open(link.href, '_blank');
                    } else if (link.href.startsWith('#')) {
                        // Dla linków wewnętrznych
                        const target = document.querySelector(link.href);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            target.setAttribute('tabindex', '-1');
                            target.focus();
                        }
                    } else {
                        // Dla linków zewnętrznych
                        window.open(link.href, '_blank');
                    }
                }, 100);
                
            } else {
                // Pierwsze kliknięcie - czytaj tekst
                linkClickStates.set(linkId, true);
                
                let textToRead = link.textContent || link.innerText;
                if (textToRead.trim()) {
                    textToRead += '. Kliknij ponownie, aby otworzyć lub pobrać zawartość.';
                    
                    // Podświetl link podczas czytania
                    removeReadingHighlights();
                    link.classList.add('reading-highlight');
                    
                    speakText(textToRead);
                    
                    // Usuń podświetlenie po zakończeniu czytania
                    setTimeout(() => {
                        link.classList.remove('reading-highlight');
                    }, 5000);
                }
                
                // Usuń stan po 3 sekundach jeśli nie ma drugiego kliknięcia
                setTimeout(() => {
                    linkClickStates.delete(linkId);
                }, 3000);
            }
        }

        function handleClickToRead(event) {
            const element = event.currentTarget;
            
            // Sprawdź czy to obraz
            if (element.tagName === 'IMG') {
                event.preventDefault();
                event.stopPropagation();
                
                let textToRead = element.alt || 'Obraz bez opisu';
                
                // Podświetl obraz podczas czytania
                removeReadingHighlights();
                element.classList.add('reading-highlight');
                
                speakText(textToRead);
                
                // Usuń podświetlenie po zakończeniu czytania
                setTimeout(() => {
                    element.classList.remove('reading-highlight');
                }, 5000);
                
                return;
            }
            
            // Sprawdź czy kliknięto w link lub przycisk (ale nie obsługuj ich tutaj)
            if (event.target.tagName === 'A' || event.target.tagName === 'BUTTON' ||
                event.target.closest('a') || event.target.closest('button')) {
                return; // Linki są obsługiwane przez handleLinkClick
            }
            
            event.preventDefault();
            event.stopPropagation();
            
            let textToRead = '';
            
            // Jeśli to paragraf, czytaj od miejsca kliknięcia do końca
            if (element.tagName === 'P') {
                const selection = window.getSelection();
                const range = document.createRange();
                
                // Znajdź pozycję kliknięcia w tekście
                try {
                    if (selection.rangeCount > 0) {
                        const clickRange = selection.getRangeAt(0);
                        if (clickRange.startContainer.nodeType === Node.TEXT_NODE) {
                            range.setStart(clickRange.startContainer, clickRange.startOffset);
                            range.setEnd(element, element.childNodes.length);
                            textToRead = range.toString();
                        }
                    }
                } catch (e) {
                    // Fallback do czytania całego paragrafu
                    textToRead = element.textContent;
                }
                
                // Jeśli nie udało się określić pozycji, czytaj cały paragraf
                if (!textToRead.trim()) {
                    textToRead = element.textContent;
                }
            } else {
                // Dla innych elementów czytaj całą zawartość
                textToRead = element.textContent || element.innerText;
            }
            
            if (textToRead.trim()) {
                // Podświetl czytany element
                removeReadingHighlights();
                element.classList.add('reading-highlight');
                
                speakText(textToRead.trim());
                
                // Usuń podświetlenie po zakończeniu czytania
                setTimeout(() => {
                    element.classList.remove('reading-highlight');
                }, 5000);
            }
        }
    }

    // Ulepszona funkcja speakText (globalna)
    function speakText(text) {
        // Zatrzymaj poprzednie czytanie
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pl-PL';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Dodaj obsługę błędów
        utterance.onerror = function(event) {
            console.error('Błąd czytania tekstu:', event.error);
            announceToScreenReader('Wystąpił błąd podczas czytania tekstu');
        };
        
        speechSynthesis.speak(utterance);
    }

    // Dodaj skróty klawiszowe
    document.addEventListener('keydown', function(e) {
        // Alt + A - otwórz panel dostępności
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            const toggle = document.getElementById('accessibility-toggle');
            if (toggle) toggle.click();
        }
        
        // Alt + M - przejdź do menu
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            const nav = document.querySelector('nav a');
            if (nav) nav.focus();
        }
        
        // Alt + C - przejdź do treści
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            const main = document.getElementById('main-content');
            if (main) {
                main.setAttribute('tabindex', '-1');
                main.focus();
            }
        }
    });
});

// Funkcje globalne dla kompatybilności wstecznej
function toggleHighContrast() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'high' ? 'normal' : 'high';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}