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
            // Lightbox functionality with next/prev navigation
            document.addEventListener('DOMContentLoaded', function() {
                const triggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
                const modal = document.getElementById('lightbox-modal');
                const modalImg = document.getElementById('lightbox-img');
                const closeBtn = document.getElementById('lightbox-close');
                const prevBtn = document.getElementById('lightbox-prev');
                const nextBtn = document.getElementById('lightbox-next');
                const caption = document.getElementById('lightbox-caption');
                const count = document.getElementById('lightbox-count');
                let currentIndex = 0;
                let startX = null;

                function showImage(index) {
                    if (index < 0) index = triggers.length - 1;
                    if (index >= triggers.length) index = 0;
                    currentIndex = index;
                    const trigger = triggers[currentIndex];
                    modalImg.src = trigger.getAttribute('href');
                    modalImg.alt = trigger.querySelector('img').alt || '';
                    caption.textContent = trigger.querySelector('img').alt || '';
                    count.textContent = `Image ${currentIndex + 1} of ${triggers.length}`;
                    modal.style.display = 'flex';
                }

                triggers.forEach((trigger, idx) => {
                    trigger.addEventListener('click', function(e) {
                        e.preventDefault();
                        showImage(idx);
                    });
                });

                closeBtn.addEventListener('click', function() {
                    modal.style.display = 'none';
                    modalImg.src = '';
                    caption.textContent = '';
                    count.textContent = '';
                });

                prevBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    showImage(currentIndex - 1);
                });

                nextBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    showImage(currentIndex + 1);
                });

                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                        modalImg.src = '';
                        caption.textContent = '';
                        count.textContent = '';
                    }
                });

                // Keyboard navigation
                document.addEventListener('keydown', function(e) {
                    if (modal.style.display === 'flex') {
                        if (e.key === 'ArrowLeft') {
                            showImage(currentIndex - 1);
                        } else if (e.key === 'ArrowRight') {
                            showImage(currentIndex + 1);
                        } else if (e.key === 'Escape') {
                            modal.style.display = 'none';
                            modalImg.src = '';
                            caption.textContent = '';
                            count.textContent = '';
                        }
                    }
                });

                // Swipe gesture support
                modalImg.addEventListener('touchstart', function(e) {
                    if (e.touches.length === 1) {
                        startX = e.touches[0].clientX;
                    }
                });
                modalImg.addEventListener('touchend', function(e) {
                    if (startX !== null && e.changedTouches.length === 1) {
                        const endX = e.changedTouches[0].clientX;
                        if (endX - startX > 50) {
                            showImage(currentIndex - 1); // swipe right
                        } else if (startX - endX > 50) {
                            showImage(currentIndex + 1); // swipe left
                        }
                        startX = null;
                    }
                });
            });
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