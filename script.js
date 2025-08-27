  // Helper: select elements
        const $ = (sel, ctx = document) => ctx.querySelector(sel);

        // 1) Mobile menu toggle with accessible attributes
        const menuBtn = $('#menuToggle');
        const drawer = $('#mobileMenu');
        menuBtn.addEventListener('click', () => {
            const isOpen = drawer.classList.toggle('open');
            drawer.hidden = !isOpen; // Hide from AT + remove from tab order when closed
            menuBtn.setAttribute('aria-expanded', String(isOpen));
        });
        // Close drawer when clicking a link (mobile UX)
        drawer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                drawer.classList.remove('open');
                drawer.hidden = true;
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // 2) Theme toggle (persisted in localStorage)
        const themeBtn = $('#themeToggle');
        const THEME_KEY = 'preferred-theme';
        const applyTheme = (mode) => {
            document.documentElement.classList.toggle('light', mode === 'light');
            localStorage.setItem(THEME_KEY, mode);
        };
        // Load stored theme or respect system preference
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) applyTheme(stored); else if (matchMedia('(prefers-color-scheme: light)').matches) applyTheme('light');

        themeBtn.addEventListener('click', () => {
            const isLight = document.documentElement.classList.toggle('light');
            localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
        });

        // 3) Reveal on scroll (intersection observer)
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        document.querySelectorAll('.reveal').forEach((el) => io.observe(el));


        // 4) Contact form validation (client-side demo only)
        const form = $('#contactForm');
        const status = $('#formStatus');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('#name').value.trim();
            const email = $('#email').value.trim();
            const message = $('#message').value.trim();

            // Simple validations
            if (!name) return showStatus('Please enter your name.', true);
            if (!/^\S+@\S+\.\S+$/.test(email)) return showStatus('Please provide a valid email.', true);
            if (message.length < 10) return showStatus('Message should be at least 10 characters.', true);

            // ...existing code...
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = $('#name').value.trim();
                const email = $('#email').value.trim();
                const message = $('#message').value.trim();

                // Simple validations
                if (!name) return showStatus('Please enter your name.', true);
                if (!/^\S+@\S+\.\S+$/.test(email)) return showStatus('Please provide a valid email.', true);
                if (message.length < 10) return showStatus('Message should be at least 10 characters.', true);

                // Real request to your backend (formsubmit.co)
                try {
                    const res = await fetch(form.action, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ name, email, message })
                    });
                    if (res.ok) {
                        showStatus('Thanks! Your message has been sent.', false);
                        form.reset();
                    } else {
                        showStatus('Sorry, there was a problem sending your message.', true);
                    }
                } catch {
                    showStatus('Network error. Please try again later.', true);
                }
            });
            // ...existing code...
        });
        function showStatus(msg, isError) {
            status.textContent = msg;
            status.style.color = isError ? '#ef4444' : '#22c55e';
        }

        // 5) Current year in footer
        $('#year').textContent = new Date().getFullYear();