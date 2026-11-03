/**
 * Animations & Effects
 * Scroll reveal, hero particles, typewriter, parallax, 3D tilt, magnetic buttons,
 * ripple, logo marquee, navbar scrollspy, scroll progress and back-to-top.
 */
(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const PRIMARY_RGB = '124, 197, 118';

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // ------------------------------------------------------------------
    // Scroll reveal
    // ------------------------------------------------------------------
    const initReveal = () => {
        const elements = document.querySelectorAll('[data-reveal]');
        if (!elements.length) return;

        document.querySelectorAll('[data-reveal-stagger]').forEach((parent) => {
            const step = Number(parent.dataset.revealStagger) || 120;
            parent.querySelectorAll(':scope > [data-reveal], :scope > * > [data-reveal]').forEach((child, index) => {
                child.style.setProperty('--reveal-delay', `${index * step}ms`);
            });
        });

        const settle = (element) => {
            const finish = () => element.classList.add('is-settled');
            element.addEventListener('transitionend', (event) => {
                if (event.target === element && event.propertyName === 'opacity') finish();
            }, { once: true });
            setTimeout(finish, 2000);
        };

        const reveal = (element) => {
            element.classList.add('is-visible');
            settle(element);
        };

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            elements.forEach(reveal);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                reveal(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

        elements.forEach((element) => observer.observe(element));
    };

    // ------------------------------------------------------------------
    // Hero title: split into letters for the staggered 3D entrance
    // ------------------------------------------------------------------
    const initHeroTitle = () => {
        const title = document.querySelector('.hero-title');
        if (!title) return;

        const text = title.textContent.trim();
        title.setAttribute('aria-label', text);
        title.textContent = '';

        [...text].forEach((char, index) => {
            const letter = document.createElement('span');
            letter.className = 'letter';
            letter.textContent = char === ' ' ? '\u00a0' : char;
            letter.style.setProperty('--i', index);
            letter.setAttribute('aria-hidden', 'true');
            title.appendChild(letter);
        });
    };

    // ------------------------------------------------------------------
    // Typewriter (phrases come from data-typewriter="a|b|c")
    // ------------------------------------------------------------------
    const initTypewriter = () => {
        const element = document.querySelector('[data-typewriter]');
        if (!element) return;

        const phrases = element.dataset.typewriter.split('|').map((p) => p.trim()).filter(Boolean);
        if (!phrases.length) return;

        element.classList.add('typewriter');
        element.setAttribute('aria-label', phrases[0]);

        if (prefersReducedMotion || phrases.length === 1) {
            element.textContent = phrases[0];
            return;
        }

        const TYPE_MS = 55;
        const DELETE_MS = 28;
        const HOLD_MS = 2200;
        const START_DELAY_MS = 1500;

        const run = async () => {
            await wait(START_DELAY_MS);
            let index = 0;
            for (;;) {
                const phrase = phrases[index];
                for (let i = 1; i <= phrase.length; i++) {
                    element.textContent = phrase.slice(0, i);
                    await wait(TYPE_MS);
                }
                await wait(HOLD_MS);
                for (let i = phrase.length - 1; i >= 0; i--) {
                    element.textContent = phrase.slice(0, i);
                    await wait(DELETE_MS);
                }
                index = (index + 1) % phrases.length;
            }
        };

        element.textContent = '';
        run();
    };

    // ------------------------------------------------------------------
    // Hero particles (connected dots that react to the cursor)
    // ------------------------------------------------------------------
    const initParticles = () => {
        const canvas = document.querySelector('.hero-particles');
        const host = canvas && canvas.parentElement;
        if (!canvas || !host || prefersReducedMotion) return;

        const ctx = canvas.getContext('2d');
        const LINK_DISTANCE = 130;
        const MOUSE_RADIUS = 140;
        const SPEED = 0.35;
        const DENSITY_MULTIPLIER = 1.4;

        let width = 0;
        let height = 0;
        let particles = [];
        let frameId = null;
        let isVisible = true;
        const mouse = { x: null, y: null };

        const createParticle = () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * SPEED,
            vy: (Math.random() - 0.5) * SPEED,
            radius: 1 + Math.random() * 1.8,
        });

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = host.clientWidth;
            height = host.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const baseCount = clamp(Math.round((width * height) / 14000), 30, 110);
            const count = Math.round(baseCount * DENSITY_MULTIPLIER);
            particles = Array.from({ length: count }, createParticle);
        };

        const update = (p) => {
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.hypot(dx, dy);
                if (distance < MOUSE_RADIUS && distance > 0) {
                    const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
                    p.vx += (dx / distance) * force * 0.25;
                    p.vy += (dy / distance) * force * 0.25;
                }
            }
            p.vx = clamp(p.vx * 0.985, -1.2, 1.2);
            p.vy = clamp(p.vy * 0.985, -1.2, 1.2);
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const distance = Math.hypot(a.x - b.x, a.y - b.y);
                    if (distance > LINK_DISTANCE) continue;
                    ctx.strokeStyle = `rgba(${PRIMARY_RGB}, ${(1 - distance / LINK_DISTANCE) * 0.35})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            particles.forEach((p) => {
                ctx.fillStyle = `rgba(${PRIMARY_RGB}, 0.85)`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const loop = () => {
            particles.forEach(update);
            draw();
            frameId = requestAnimationFrame(loop);
        };

        const start = () => { if (frameId === null && isVisible && !document.hidden) loop(); };
        const stop = () => { if (frameId !== null) { cancelAnimationFrame(frameId); frameId = null; } };

        host.addEventListener('mousemove', (event) => {
            const rect = host.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        });
        host.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

        new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible) start(); else stop();
        }).observe(host);

        document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
        window.addEventListener('resize', resize);

        resize();
        start();
    };

    // ------------------------------------------------------------------
    // Hero mouse parallax (depth comes from data-depth)
    // ------------------------------------------------------------------
    const initHeroParallax = () => {
        const hero = document.querySelector('.header');
        const layers = hero ? hero.querySelectorAll('.hero-parallax') : [];
        if (!layers.length || !canHover || prefersReducedMotion) return;

        const MAX_SHIFT_PX = 40;

        hero.addEventListener('mousemove', (event) => {
            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            layers.forEach((layer) => {
                const depth = Number(layer.dataset.depth) || 0.5;
                layer.style.transform = `translate3d(${x * depth * MAX_SHIFT_PX}px, ${y * depth * MAX_SHIFT_PX}px, 0)`;
            });
        });

        hero.addEventListener('mouseleave', () => {
            layers.forEach((layer) => { layer.style.transform = ''; });
        });
    };

    // ------------------------------------------------------------------
    // 3D tilt cards
    // ------------------------------------------------------------------
    const initTilt = () => {
        if (!canHover || prefersReducedMotion) return;
        const MAX_TILT_DEG = 7;

        document.querySelectorAll('[data-tilt]').forEach((card) => {
            card.addEventListener('mousemove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(800px) rotateX(${-y * MAX_TILT_DEG}deg) rotateY(${x * MAX_TILT_DEG}deg) translateZ(6px)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    };

    // ------------------------------------------------------------------
    // Magnetic buttons
    // ------------------------------------------------------------------
    const initMagnetic = () => {
        if (!canHover || prefersReducedMotion) return;
        const STRENGTH = 0.3;

        document.querySelectorAll('[data-magnetic]').forEach((button) => {
            button.addEventListener('mousemove', (event) => {
                const rect = button.getBoundingClientRect();
                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;
                button.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
            });
            button.addEventListener('mouseleave', () => { button.style.transform = ''; });
        });
    };

    // ------------------------------------------------------------------
    // Click ripple
    // ------------------------------------------------------------------
    const initRipple = () => {
        if (prefersReducedMotion) return;

        document.querySelectorAll('[data-ripple]').forEach((element) => {
            element.addEventListener('click', (event) => {
                const rect = element.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = `${event.clientX - rect.left}px`;
                ripple.style.top = `${event.clientY - rect.top}px`;
                ripple.addEventListener('animationend', () => ripple.remove());
                element.appendChild(ripple);
            });
        });
    };

    // ------------------------------------------------------------------
    // Infinite logo marquee (duplicates the list so -50% loops seamlessly)
    // ------------------------------------------------------------------
    const initMarquee = () => {
        const list = document.querySelector('.c-logo-part ul');
        if (!list) return;

        [...list.children].forEach((item) => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            list.appendChild(clone);
        });
    };

    // ------------------------------------------------------------------
    // Word-by-word reveal (each word slides up from a clipped container)
    // ------------------------------------------------------------------
    const initWordReveal = () => {
        document.querySelectorAll('[data-reveal="words"]').forEach((element) => {
            const text = element.textContent.trim();
            element.setAttribute('aria-label', text);
            element.textContent = '';

            text.split(/\s+/).forEach((word, index) => {
                const wrapper = document.createElement('span');
                wrapper.className = 'word';
                wrapper.setAttribute('aria-hidden', 'true');
                const inner = document.createElement('span');
                inner.textContent = word;
                inner.style.setProperty('--i', index);
                wrapper.appendChild(inner);
                element.appendChild(wrapper);
            });
        });
    };

    // ------------------------------------------------------------------
    // Scroll-driven UI: progress bar, back-to-top, navbar scrollspy
    // ------------------------------------------------------------------
    const initScrollEffects = () => {
        const root = document.documentElement;
        const backToTop = document.querySelector('.back-to-top');
        const navLinks = [...document.querySelectorAll('.main-nav li:not(.small-logo) a[href^="#"]')];
        const sections = [...new Set(navLinks.map((link) => link.getAttribute('href')))]
            .map((href) => ({ href, section: document.querySelector(href) }))
            .filter(({ section }) => section);

        const BACK_TO_TOP_THRESHOLD_PX = 600;
        const SPY_OFFSET_RATIO = 0.35;
        let ticking = false;

        const updateActiveLink = (scrollY) => {
            const probe = scrollY + window.innerHeight * SPY_OFFSET_RATIO;
            const atBottom = scrollY + window.innerHeight >= root.scrollHeight - 2;
            let active = sections[0];
            sections.forEach((entry) => {
                if (entry.section.offsetTop <= probe) active = entry;
            });
            if (atBottom) active = sections[sections.length - 1];
            navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === active.href));
        };

        const update = () => {
            const scrollY = window.scrollY;
            const maxScroll = root.scrollHeight - window.innerHeight;
            root.style.setProperty('--scroll-progress', maxScroll > 0 ? (scrollY / maxScroll).toFixed(4) : 0);
            if (backToTop) backToTop.classList.toggle('is-visible', scrollY > BACK_TO_TOP_THRESHOLD_PX);
            if (sections.length) updateActiveLink(scrollY);
            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            });
        }

        update();
    };

    document.addEventListener('DOMContentLoaded', () => {
        initHeroTitle();
        initTypewriter();
        initWordReveal();
        initMarquee();
        initReveal();
        initParticles();
        initHeroParallax();
        initTilt();
        initMagnetic();
        initRipple();
        initScrollEffects();
    });
})();
