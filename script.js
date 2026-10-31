
/* background spotlight follows the pointer */
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer:coarse)').matches) return;
    var r = document.documentElement, t = 0, x = 0, y = 0;
    window.addEventListener('pointermove', function (e) { x = e.clientX; y = e.clientY; if (t) return; t = requestAnimationFrame(function () { t = 0; r.style.setProperty('--px', x + 'px'); r.style.setProperty('--py', y + 'px'); }); }, { passive: true });
})();



try {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // stagger children of containers
    document.querySelectorAll('[data-child]').forEach(function (c) {
        var step = +c.getAttribute('data-stagger') || 60, base = +c.getAttribute('data-base') || 0;
        Array.prototype.forEach.call(c.children, function (ch, i) {
            ch.setAttribute('data-anim', c.getAttribute('data-child'));
            ch.style.setProperty('--d', (base + i * step) + 'ms');
        });
    });

    // split hero heading into words for a masked reveal
    document.querySelectorAll('[data-split]').forEach(function (h) {
        var text = h.textContent.trim(), words = text.split(/\s+/);
        h.setAttribute('aria-label', text);
        h.textContent = '';
        words.forEach(function (w, i) {
            var o = document.createElement('span'); o.className = 'w'; o.setAttribute('aria-hidden', 'true');
            var s = document.createElement('span'); s.className = 'wi'; s.textContent = w;
            s.style.transitionDelay = (150 + i * 110) + 'ms';
            o.appendChild(s); h.appendChild(o);
            if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
        });
    });

    // reveal on scroll
    var targets = document.querySelectorAll('[data-anim],[data-split]');
    if (!('IntersectionObserver' in window)) {
        targets.forEach(function (e) { e.classList.add('in', 'done'); });
    } else {
        var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) {
                if (!e.isIntersecting) return;
                var el = e.target; el.classList.add('in'); io.unobserve(el);
                el.addEventListener('transitionend', function (ev) {
                    if (ev.target === el && ev.propertyName === 'transform') el.classList.add('done');
                });
            });
        }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
        targets.forEach(function (e) { io.observe(e); });
    }

    // typewriter for the role label
    var t = document.getElementById('typed');
    if (t && !reduce) {
        var full = t.textContent, i = 0; t.textContent = ''; t.classList.add('typing');
        var tick = function () {
            t.textContent = full.slice(0, ++i);
            if (i < full.length) setTimeout(tick, 75); else setTimeout(function () { t.classList.remove('typing'); }, 1400);
        };
        setTimeout(tick, 400);
    }

    // scroll progress bar
    var bar = document.getElementById('bar'), queued = false;
    function upd() {
        var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
        var p = max > 0 ? h.scrollTop / max : 0; bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)) + ')'; queued = false;
    }
    window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();

    // active nav link
    var links = document.querySelectorAll('nav div a');
    if ('IntersectionObserver' in window) {
        var so = new IntersectionObserver(function (es) {
            es.forEach(function (e) {
                if (!e.isIntersecting) return;
                links.forEach(function (a) {
                    var on = a.getAttribute('href') === '#' + e.target.id; a.classList.toggle('active', on);
                    if (on) { var st = a.parentNode; if (st.scrollWidth > st.clientWidth + 2) { st.scrollTo({ left: Math.max(0, a.offsetLeft - (st.clientWidth - a.offsetWidth) / 2), behavior: reduce ? 'auto' : 'smooth' }); } }
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        document.querySelectorAll('main section').forEach(function (s) { so.observe(s); });
    }

    // card spotlight + 3D tilt
    document.querySelectorAll('.card').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
            if (e.pointerType !== 'mouse' || reduce) return;
            var r = card.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
            card.style.setProperty('--mx', x + 'px'); card.style.setProperty('--my', y + 'px');
            if (card.hasAttribute('data-anim') && !card.classList.contains('done')) return;
            var rx = ((y / r.height) - .5) * -8, ry = ((x / r.width) - .5) * 8;
            card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
        });
        card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });

    // magnetic buttons + click ripple
    document.querySelectorAll('.btn').forEach(function (b) {
        b.addEventListener('pointermove', function (e) {
            if (e.pointerType !== 'mouse' || reduce) return;
            if (b.hasAttribute('data-anim') && !b.classList.contains('done')) return;
            var r = b.getBoundingClientRect();
            b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .25) + 'px,' + ((e.clientY - r.top - r.height / 2) * .35) + 'px)';
        });
        b.addEventListener('pointerleave', function () { b.style.transform = ''; });
        b.addEventListener('click', function (e) {
            if (reduce) return;
            var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, s = document.createElement('span');
            s.className = 'ripple';
            s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
            b.appendChild(s); setTimeout(function () { s.remove(); }, 650);
        });
    });
} catch (err) { document.documentElement.classList.remove('js'); }



(function () {
    try {
        var root = document.documentElement;
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var EMAIL = 'ray434575@gmail.com';
        function $(s, c) { return (c || document).querySelector(s); }
        function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
        function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

        /* toast */
        var toastEl = $('#toast'), toastT = null;
        function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2400); }

        /* theme switch */
        var themeBtn = $('#theme-btn');
        function isDark() { var t = root.getAttribute('data-theme'); if (t) return t === 'dark'; return window.matchMedia('(prefers-color-scheme: dark)').matches; }
        function syncTheme() { var d = isDark(); themeBtn.classList.toggle('is-dark', d); themeBtn.setAttribute('aria-label', d ? 'Switch to light theme' : 'Switch to dark theme'); }
        function toggleTheme() { var t = isDark() ? 'light' : 'dark'; root.setAttribute('data-theme', t); try { localStorage.setItem('ar-theme', t); } catch (e) { } syncTheme(); return t; }
        try { var st = localStorage.getItem('ar-theme'); if (st === 'dark' || st === 'light') root.setAttribute('data-theme', st); } catch (e) { }
        syncTheme();
        themeBtn.addEventListener('click', toggleTheme);

        /* copy email */
        function copyEmail() {
            function fb() {
                var ta = el('textarea'); ta.value = EMAIL; ta.setAttribute('readonly', '');
                ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
                document.body.appendChild(ta); ta.select();
                var ok = false; try { ok = document.execCommand('copy'); } catch (e) { }
                ta.remove(); toast(ok ? 'Email copied' : 'Copy this address: ' + EMAIL);
            }
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(EMAIL).then(function () { toast('Email copied'); }, fb); return;
                }
            } catch (e) { }
            fb();
        }
        $('#copy-email').addEventListener('click', copyEmail);

        /* project filter */
        var fbtns = $$('.fbtn'), pcards = $$('#projects .grid .card'), fcount = $('#fcount');
        fbtns.forEach(function (b) {
            b.addEventListener('click', function () {
                var f = b.getAttribute('data-f'), n = 0;
                fbtns.forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
                pcards.forEach(function (c) {
                    var m = f === 'all' || (' ' + c.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') > -1;
                    c.classList.toggle('dim', !m); c.inert = !m; if (m) n++;
                });
                fcount.textContent = 'Showing ' + n + ' of ' + pcards.length;
            });
        });

        /* request flow */
        var FLOW = {
            gemini: {
                nodes: [['Browser', 'HTML · CSS · JavaScript'], ['Express.js server', 'Node.js · dotenv'], ['Google Gemini API', 'AI-generated responses']],
                steps: [
                    { t: 'Ask', d: 'You submit a question in the browser.', n: [0], c: [] },
                    { t: 'Request', d: 'The browser sends the question to my Express.js server.', n: [0, 1], c: [0], dir: 1 },
                    { t: 'AI call', d: 'The server passes it to the Google Gemini API.', n: [1, 2], c: [1], dir: 1 },
                    { t: 'Response', d: 'The AI-generated answer travels back and appears on the page.', n: [2, 1, 0], c: [1, 0], dir: -1 }]
            },
            journal: {
                nodes: [['Browser', 'HTML · CSS · JavaScript'], ['Express.js server', 'Node.js · dotenv'], ['Google Gemini API', 'AI-generated suggestions']],
                steps: [
                    { t: 'Mood', d: 'You tell the app how you feel in the browser.', n: [0], c: [] },
                    { t: 'Request', d: 'The browser sends your mood to my Express.js server.', n: [0, 1], c: [0], dir: 1 },
                    { t: 'AI call', d: 'The server asks the Google Gemini API for a journaling prompt.', n: [1, 2], c: [1], dir: 1 },
                    { t: 'Prompt', d: 'The journaling prompt travels back and appears on the page.', n: [2, 1, 0], c: [1, 0], dir: -1 }]
            },
            shopsy: {
                nodes: [['Browser UI', 'HTML · CSS · JavaScript'], ['React app', 'React.js · Vite'], ['DummyJSON API', 'Product data']],
                steps: [
                    { t: 'Load', d: 'You open the shop and the React app starts in your browser.', n: [0, 1], c: [0], dir: 1 },
                    { t: 'Fetch', d: 'The app requests products from the DummyJSON API.', n: [1, 2], c: [1], dir: 1 },
                    { t: 'Display', d: 'The products come back and are displayed on the page.', n: [2, 1, 0], c: [1, 0], dir: -1 },
                    { t: 'Cart', d: 'useReducer manages the cart state and React Hook Form validates the checkout form.', n: [1], c: [] }]
            },
            feedback: {
                nodes: [['Client', 'Sends REST requests'], ['Express.js server', 'Node.js · Mongoose'], ['MongoDB', 'Persistent storage']],
                steps: [
                    { t: 'Request', d: 'A request to create, read, update or delete feedback reaches my REST API endpoints.', n: [0, 1], c: [0], dir: 1 },
                    { t: 'Validate', d: 'The Mongoose data model checks the feedback data before it is saved.', n: [1], c: [] },
                    { t: 'Store', d: 'MongoDB stores or updates the feedback records.', n: [1, 2], c: [1], dir: 1 },
                    { t: 'Response', d: 'The result travels back to the client as the API response.', n: [2, 1, 0], c: [1, 0], dir: -1 }]
            }
        };
        var fkey = 'gemini', fi = 0, fuser = false, fvis = false, ftimer = null;
        var fWrap = $('#fnodes'), fSteps = $('#fsteps'), fCap = $('#fcap');
        function setStep(i) {
            fi = i; var s = FLOW[fkey].steps[i];
            $$('.fnode', fWrap).forEach(function (n, k) { n.classList.toggle('on', s.n.indexOf(k) > -1); n.classList.toggle('now', s.n[s.n.length - 1] === k); });
            $$('.conn', fWrap).forEach(function (c, k) { var on = s.c.indexOf(k) > -1; c.classList.toggle('on', on); c.classList.toggle('rev', on && s.dir === -1); });
            $$('.fstep', fSteps).forEach(function (b, k) { b.classList.toggle('on', k === i); if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
            fCap.textContent = s.d;
        }
        function stopFlow() { clearInterval(ftimer); ftimer = null; }
        function startFlow() { if (reduce || fuser || ftimer || !fvis) return; ftimer = setInterval(function () { setStep((fi + 1) % FLOW[fkey].steps.length); }, 2800); }
        function buildFlow() {
            var f = FLOW[fkey]; fWrap.textContent = ''; fSteps.textContent = '';
            f.nodes.forEach(function (n, i) {
                if (i > 0) { var c = el('div', 'conn'); c.appendChild(el('i')); c.setAttribute('aria-hidden', 'true'); fWrap.appendChild(c); }
                var nd = el('div', 'fnode'); nd.appendChild(el('b', null, n[0])); nd.appendChild(el('span', null, n[1])); fWrap.appendChild(nd);
            });
            f.steps.forEach(function (s, i) {
                var li = el('li'), b = el('button', 'fstep'); b.type = 'button';
                b.appendChild(el('span', 'num', String(i + 1))); b.appendChild(el('span', null, s.t));
                b.addEventListener('click', function () { fuser = true; stopFlow(); setStep(i); });
                li.appendChild(b); fSteps.appendChild(li);
            });
            setStep(0);
        }
        $$('.ftab').forEach(function (t) {
            t.addEventListener('click', function () {
                fkey = t.getAttribute('data-p'); fuser = false; stopFlow();
                $$('.ftab').forEach(function (x) { var on = x === t; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
                buildFlow(); startFlow();
            });
        });
        buildFlow();
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (es) { fvis = es[0].isIntersecting; if (fvis) startFlow(); else stopFlow(); }, { threshold: .25 }).observe($('#flow'));
        }

        /* terminal */
        var tb = $('#tbody'), tf = $('#tform'), ti = $('#tin'), dn = 0, hist = [], hp = 0;
        function L(parts, cls) {
            var d = el('div', 'ln' + (cls ? ' ' + cls : ''));
            d.style.animationDelay = (Math.min(dn++, 14) * 30) + 'ms';
            (Array.isArray(parts) ? parts : [parts]).forEach(function (p) {
                if (typeof p === 'string') { d.appendChild(document.createTextNode(p)); }
                else if (p.href) { var a = el('a', null, p.t || p.href); a.href = p.href; a.target = '_blank'; a.rel = 'noopener'; d.appendChild(a); }
                else { d.appendChild(el('span', p.c, p.t)); }
            });
            tb.appendChild(d); return d;
        }
        var C = {};
        C.help = function () {
            L('Commands:');
            [['about', 'who I am'], ['skills', 'what I work with'], ['projects', 'what I have built'], ['education', 'where I study and train'], ['resume', 'languages, certifications, PDF'], ['objective', 'what I am looking for'], ['contact', 'how to reach me'], ['theme', 'switch light and dark'], ['clear', 'empty the screen']].forEach(function (r) { L([{ c: 'k', t: r[0] }, { c: 'dim', t: r[1] }]); });
            L('Up and down arrows recall history. Tab completes. One command is hidden.', 'dim');
        };
        C.about = function () { L("I'm Apurna Ray, a Computer Science student and Full-Stack Developer. I build responsive and user-friendly web applications using HTML, CSS, JavaScript, React, Node.js, and Express.js. I enjoy developing practical projects, learning new technologies, and solving real-world problems."); };
        C.whoami = function () { L('Apurna Ray, Full-Stack Developer, India'); };
        C.skills = function () { $$('#skills .group').forEach(function (g) { L([{ c: 'ps', t: $('h3', g).textContent }]); L($$('.skills span:not([data-clone])', g).map(function (s) { return s.textContent; }).join(', '), 'dim'); }); };
        C.projects = function () {
            $$('#projects .grid .card').forEach(function (c) {
                L([{ c: 'ps', t: $('h3', c).textContent }]); L($('p', c).textContent, 'dim');
                var parts = []; $$('.links a', c).forEach(function (a, i) { if (i) parts.push('   '); parts.push({ href: a.href, t: a.textContent.replace(/\s*→\s*$/, '') }); }); L(parts);
            });
        };
        C.education = function () {
            $$('#education .card').forEach(function (c) {
                L([{ c: 'ps', t: $('h3', c).textContent }]); L($('p', c).textContent, 'dim'); var w = $('.when', c); if (w) L(w.textContent);
            });
        };
        C.objective = function () { L('Career Objective: To grow as a Full-Stack Developer by applying my technical skills, building useful web applications, learning from experienced developers, and contributing to real-world projects.'); };
        C.resume = function () {
            L([{ c: 'ps', t: 'Full-Stack Developer | AI-Integration' }]);
            L([{ c: 'k', t: 'languages' }, 'English, Hindi']);
            L([{ c: 'k', t: 'certified' }, 'CodeChef Certification, IT Certifications, MongoDB Certifications']);
            L([{ c: 'k', t: 'pdf' }, { href: 'https://drive.google.com/file/d/1piVjzEJk8FgkHsmeIv-L6_Sirxlpy4mT/view?usp=sharing', t: 'Open the full resume' }]);
        };
        C.contact = function () {
            L([{ c: 'k', t: 'email' }, EMAIL]);
            L([{ c: 'k', t: 'github' }, { href: 'https://github.com/aparnaray06', t: 'github.com/aparnaray06' }]);
            L([{ c: 'k', t: 'linkedin' }, { href: 'https://www.linkedin.com/in/apurna-ray-747257377/', t: 'linkedin.com/in/apurna-ray-747257377' }]);
        };
        C.theme = function () { var t = toggleTheme(); L('Theme set to ' + t + '.'); };
        C.clear = function () { tb.textContent = ''; };
        C.sudo = function (args) {
            if (/hire/i.test(args.join(' '))) { L('[sudo] permission granted.'); L('Open to internships, junior roles, and collaborations.'); L([{ c: 'k', t: 'email' }, EMAIL]); }
            else { L('Nice try. No sudo access here, but "sudo hire apurna" might work.', 'dim'); }
        };
        function run(raw) {
            var cmd = raw.trim(); dn = 0;
            L([{ c: 'ps', t: '$ ' }, cmd], 'cmd');
            if (cmd) {
                hist.push(cmd); hp = hist.length;
                var parts = cmd.split(/\s+/), name = parts[0].toLowerCase();
                if (Object.prototype.hasOwnProperty.call(C, name)) C[name](parts.slice(1));
                else L('command not found: ' + name + '. Type help for the list.', 'err');
            }
            tb.scrollTop = tb.scrollHeight;
        }
        tf.addEventListener('submit', function (e) { e.preventDefault(); var v = ti.value; ti.value = ''; run(v); });
        ti.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowUp') { e.preventDefault(); if (hp > 0) { hp--; ti.value = hist[hp]; } }
            else if (e.key === 'ArrowDown') { e.preventDefault(); if (hp < hist.length - 1) { hp++; ti.value = hist[hp]; } else { hp = hist.length; ti.value = ''; } }
            else if (e.key === 'Tab') {
                var v = ti.value.trim().toLowerCase();
                if (v && v.indexOf(' ') < 0) {
                    var m = Object.keys(C).filter(function (k) { return k.indexOf(v) === 0; });
                    if (m.length === 1) { e.preventDefault(); ti.value = m[0]; }
                    else if (m.length > 1) { e.preventDefault(); dn = 0; L(m.join('   '), 'dim'); tb.scrollTop = tb.scrollHeight; }
                }
            }
        });
        $('.term').addEventListener('click', function (e) {
            if (e.target.closest('a')) return;
            if (String(window.getSelection && window.getSelection())) return;
            if (window.matchMedia('(pointer: fine)').matches) ti.focus({ preventScroll: true });
        });
        ['help', 'about', 'skills', 'projects', 'education', 'resume', 'contact', 'clear'].forEach(function (n) {
            var b = el('button', 'cchip', n); b.type = 'button'; b.addEventListener('click', function () { run(n); }); $('#tchips').appendChild(b);
        });
        L('Welcome. This terminal answers questions about me.');
        run('help');

        /* skills: every skill gets its own colour */
        (function () {
            var C = {
                'HTML5': '#e8590c', 'CSS3': '#1c7ed6', 'JavaScript (ES6+)': '#d19a00', 'React.js': '#0fa5c9', 'Responsive Web Design': '#4263eb', 'Vite': '#8b5cf6',
                'Node.js': '#2f9e44', 'Express.js': '#5c6b7a', 'REST APIs': '#1098ad', 'API Integration': '#f08c00', 'MongoDB': '#3d9a4a', 'Mongoose': '#c92a2a', 'SQL': '#1971c2', 'JWT': '#d6336c', 'bcrypt.js': '#0b7285', 'dotenv': '#8a9a00',
                'Git': '#f03e3e', 'GitHub': '#6741d9', 'Postman': '#ff6c37', 'npm': '#cb3837', 'Visual Studio Code': '#1c7ed6', 'Vercel': '#7b8794', 'Render': '#12b886', 'Netlify': '#15aabf', 'MongoDB Atlas': '#2f9e44',
                'Google Gemini API': '#4c6ef5', 'AI-powered application development': '#be4bdb'
            };
            var A = { 'HTML5': 'H5', 'CSS3': 'C3', 'JavaScript (ES6+)': 'JS', 'React.js': 'Re', 'Node.js': 'N', 'Express.js': 'Ex', 'REST APIs': 'API', 'MongoDB': 'Mo', 'Mongoose': 'Mg', 'SQL': 'SQL', 'JWT': 'JWT', 'bcrypt.js': 'Bc', 'dotenv': '.env', 'Git': 'Git', 'GitHub': 'GH', 'Postman': 'Pm', 'npm': 'npm', 'Visual Studio Code': 'VS', 'Vercel': 'V', 'Render': 'R', 'Netlify': 'Nt', 'MongoDB Atlas': 'At', 'Vite': 'Vi', 'Google Gemini API': 'Gm' };
            $$('#skills .skills span').forEach(function (sp) {
                var k = sp.textContent.trim(), c = C[k]; if (c) sp.style.setProperty('--accent', c);
                var a = A[k], old = $('.si', sp);
                if (a && old) { var b = document.createElement('b'); b.className = 'si bd'; b.setAttribute('aria-hidden', 'true'); b.textContent = a; if (a.length > 2) b.classList.add('long'); if (k === 'JavaScript (ES6+)') b.style.color = '#1b1b18'; old.replaceWith(b); }
            });
        })();

        /* skills: build the scrolling rows */
        (function () {
            var rows = $$('#skills .sk-groups .group .skills');
            function build() {
                rows.forEach(function (sk) {
                    if (!sk.parentNode.classList.contains('mq')) { var w = document.createElement('div'); w.className = 'mq'; sk.parentNode.insertBefore(w, sk); w.appendChild(sk); }
                    $$('[data-clone]', sk).forEach(function (c) { c.remove(); });
                    sk.style.animation = 'none';
                    var orig = Array.prototype.slice.call(sk.children), box = sk.parentNode.clientWidth || 900, one = sk.scrollWidth + 14, reps = Math.max(1, Math.ceil((box * 1.15) / one));
                    for (var r = 0; r < reps * 2 - 1; r++) { orig.forEach(function (n) { var c = n.cloneNode(true); c.setAttribute('data-clone', ''); c.setAttribute('aria-hidden', 'true'); sk.appendChild(c); }); }
                    sk.style.setProperty('--dur', Math.round(one * reps / (box < 600 ? 38 : 46)) + 's');
                    sk.style.animation = '';
                });
            }
            if (reduce) return;
            var t; build();
            window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 250); });
        })();

        /* skills: pointer spotlight on chips */
        (function () {
            if (reduce) return;
            var sec = $('#skills'), sk = null;
            sec.addEventListener('pointermove', function (e) {
                var sp = e.target.closest ? e.target.closest('.skills span') : null; if (!sp) return;
                var r = sp.getBoundingClientRect(); sp.style.setProperty('--mx', (e.clientX - r.left) + 'px'); sp.style.setProperty('--my', (e.clientY - r.top) + 'px');
            }, { passive: true });
        })();

        /* projects: 3D tilt that follows the pointer */
        (function () {
            if (reduce || window.matchMedia('(pointer:coarse)').matches) return;
            var g = $('.grid.four'); if (!g) return;
            g.addEventListener('pointermove', function (e) {
                var c = e.target.closest ? e.target.closest('.card') : null; if (!c) return;
                var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
                c.style.setProperty('--ry', ((x - .5) * 8).toFixed(2) + 'deg'); c.style.setProperty('--rx', ((.5 - y) * 6).toFixed(2) + 'deg');
                c.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
            }, { passive: true });
            g.addEventListener('pointerout', function (e) { var c = e.target.closest ? e.target.closest('.card') : null; if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); } });
        })();

        /* contact form: opens a prefilled Gmail compose window */
        $('#ct-form').addEventListener('submit', function (e) {
            e.preventDefault();
            var n = $('#cf-name').value.trim(), m = $('#cf-msg').value.trim(), t = $('#cf-topic').value, note = $('#cf-note');
            if (!n || !m) { note.textContent = 'Please add your name and a message first.'; (n ? $('#cf-msg') : $('#cf-name')).focus(); return; }
            note.textContent = '';
            var body = m + '\n\n' + n;
            var url = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(EMAIL) + '&su=' + encodeURIComponent(t + ' - ' + n) + '&body=' + encodeURIComponent(body);
            var a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.style.display = 'none';
            document.body.appendChild(a); a.click(); a.remove();
            note.textContent = '';
            var l = document.createElement('a'); l.href = url; l.target = '_blank'; l.rel = 'noopener'; l.textContent = 'Gmail did not open? Click here';
            note.appendChild(l); toast('Opening Gmail');
        });

        /* skills: count-up tiles that also filter the groups */
        (function () {
            var sec = document.getElementById('skills'); if (!sec) return;
            var wrap = $('.sk-stats', sec), tiles = $$('.sk-stat', sec), groups = $$('#skills .group'), live = $('#sk-live');
            if (!wrap || !tiles.length) return;
            function count(b) {
                var n = +b.getAttribute('data-n');
                if (reduce || !window.requestAnimationFrame) { b.textContent = n; return; }
                var t0 = null, d = 1000; b.textContent = '0';
                (function f(ts) { if (t0 === null) t0 = ts; var k = Math.min(1, (ts - t0) / d); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(performance.now());
            }
            if ('IntersectionObserver' in window) {
                var io = new IntersectionObserver(function (es) {
                    if (!es[0].isIntersecting) return; io.disconnect();
                    $$('b', wrap).forEach(count);
                }, { threshold: .4 });
                io.observe(wrap);
            }
            function apply(key) {
                var shown = 0, names = [];
                tiles.forEach(function (t) { var on = t.getAttribute('data-f') === key; t.classList.toggle('on', on); t.setAttribute('aria-pressed', on ? 'true' : 'false'); });
                groups.forEach(function (g) {
                    var show = key === 'all' || g.getAttribute('data-g') === key, was = g.hidden;
                    g.hidden = !show;
                    if (show) { shown++; if (was && !reduce) { g.classList.remove('show'); void g.offsetWidth; g.classList.add('show'); } }
                });
                var t = tiles.filter(function (x) { return x.classList.contains('on'); })[0];
                if (live) live.textContent = key === 'all' ? 'Showing all skills' : 'Showing ' + t.querySelector('span').textContent + ' skills';
            }
            tiles.forEach(function (t) {
                t.addEventListener('click', function () {
                    var key = t.getAttribute('data-f');
                    apply(t.classList.contains('on') && key !== 'all' ? 'all' : key);
                });
            });
        })();

        /* command menu */
        var pal = $('#pal'), pin = $('#pal-in'), plist = $('#pal-list'), lastFocus = null, sel = 0;
        var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
        $('#kbd').textContent = mac ? '⌘ K' : 'Ctrl K';
        function ext(g, t, h) { return { g: g, t: t, h: h, x: 1 }; }
        var ITEMS = [
            { g: 'Go to', t: 'About', h: '#about' }, { g: 'Go to', t: 'Projects', h: '#projects' }, { g: 'Go to', t: 'How my apps work', h: '#flow' },
            { g: 'Go to', t: 'Skills', h: '#skills' }, { g: 'Go to', t: 'Terminal', h: '#terminal' }, { g: 'Go to', t: 'Education', h: '#education' }, { g: 'Go to', t: 'Resume', h: '#resume' }, { g: 'Go to', t: 'Contact', h: '#contact' },
            ext('Projects', 'Smart Shopping: live demo', 'https://assesment-black-iota.vercel.app/'),
            ext('Projects', 'Smart Shopping: GitHub', 'https://github.com/aparnaray06/Assesment'),
            ext('Projects', 'Ask Gemini: live demo', 'https://ask-gemini-phase5-i412.onrender.com/'),
            ext('Projects', 'Ask Gemini: GitHub', 'https://github.com/aparnaray06/Ask-Gemini-Phase5-'),
            ext('Projects', 'AI Daily Journal Prompt Generator: live demo', 'https://journal-promt-generator.onrender.com/'),
            ext('Projects', 'AI Daily Journal Prompt Generator: GitHub', 'https://github.com/aparnaray06/Promt-Generator'),
            ext('Projects', 'Feedback Management System: live demo', 'https://phase6-feedback-form.onrender.com/'),
            ext('Projects', 'Feedback Management System: GitHub', 'https://github.com/aparnaray06/phase6-feedback-form'),
            ext('Links', 'GitHub profile', 'https://github.com/aparnaray06'),
            ext('Links', 'LinkedIn', 'https://www.linkedin.com/in/apurna-ray-747257377/'),
            ext('Links', 'View resume', 'https://drive.google.com/file/d/1piVjzEJk8FgkHsmeIv-L6_Sirxlpy4mT/view?usp=sharing'),
            ext('Links', 'Download resume', 'Apurna_Ray_Resume.pdf'),
            { g: 'Actions', t: 'Copy email address', a: copyEmail },
            { g: 'Actions', t: 'Switch light / dark theme', a: toggleTheme },
            { g: 'Actions', t: 'Scroll to top', a: function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); } }
        ];
        function setSel(i) {
            var nodes = $$('.pal-i', plist);
            if (!nodes.length) { sel = 0; pin.removeAttribute('aria-activedescendant'); return; }
            sel = (i + nodes.length) % nodes.length;
            nodes.forEach(function (n, k) { n.classList.toggle('sel', k === sel); });
            pin.setAttribute('aria-activedescendant', nodes[sel].id);
            nodes[sel].scrollIntoView({ block: 'nearest' });
        }
        function renderPal(q) {
            q = (q || '').trim().toLowerCase();
            var shown = ITEMS.filter(function (i) { return !q || (i.t + ' ' + i.g).toLowerCase().indexOf(q) > -1; });
            plist.textContent = '';
            var lastG = '';
            shown.forEach(function (it, idx) {
                if (it.g !== lastG) { lastG = it.g; var gh = el('li', 'pal-g', it.g); gh.setAttribute('role', 'presentation'); plist.appendChild(gh); }
                var li = el('li'), n; li.setAttribute('role', 'presentation');
                if (it.h) { n = el('a', 'pal-i'); n.href = it.h; if (it.x) { n.target = '_blank'; n.rel = 'noopener'; } }
                else { n = el('button', 'pal-i'); n.type = 'button'; }
                n.setAttribute('role', 'option'); n.id = 'pal-o' + idx;
                n.appendChild(el('span', 'pal-t', it.t));
                n.appendChild(el('span', 'pal-h', it.x ? 'new tab' : it.h ? 'section' : 'action'));
                n.addEventListener('click', function (e) { closePal(true); if (it.a) { e.preventDefault(); it.a(); } });
                n.addEventListener('pointermove', function () { if (sel !== idx) setSel(idx); });
                li.appendChild(n); plist.appendChild(li);
            });
            if (!shown.length) plist.appendChild(el('li', 'pal-empty', 'No match. Try "projects" or "email".'));
            setSel(0);
        }
        function openPal() {
            if (!pal.hidden) return;
            lastFocus = document.activeElement; pal.hidden = false; document.body.classList.add('lock');
            pin.value = ''; renderPal(''); pin.focus();
        }
        function closePal(restore) {
            if (pal.hidden) return;
            pal.hidden = true; document.body.classList.remove('lock');
            if (restore && lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { } }
        }
        $('#pal-open').addEventListener('click', openPal);
        pin.addEventListener('input', function () { renderPal(pin.value); });
        pin.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); setSel(sel + 1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(sel - 1); }
            else if (e.key === 'Enter') { e.preventDefault(); var n = $$('.pal-i', plist)[sel]; if (n) n.click(); }
            else if (e.key === 'Tab') { e.preventDefault(); }
        });
        pal.addEventListener('mousedown', function (e) { if (e.target === pal) closePal(true); });
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'k') { e.preventDefault(); if (pal.hidden) openPal(); else closePal(true); }
            else if (e.key === 'Escape' && !pal.hidden) { closePal(true); }
        });
    } catch (err) { if (window.console) console.error(err); }
})();


/* background: connected particle network that reacts to the mouse */
(function () {
    var host = document.querySelector('.ambient'); if (!host) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cv = document.createElement('canvas'), cx = cv.getContext('2d'); host.appendChild(cv);
    var W = 0, H = 0, dpr = 1, P = [], mx = -9999, my = -9999, col = '47,111,94', tick = 0, raf = 0;
    function readColor() {
        var v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        var m = /^#([0-9a-f]{6})$/i.exec(v);
        if (m) { var n = parseInt(m[1], 16); col = ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255); }
    }
    function size() {
        dpr = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight;
        cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var n = Math.max(28, Math.min(85, Math.round(W * H / 16000)));
        P = []; for (var i = 0; i < n; i++)P.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + 1 });
    }
    function draw() {
        if (++tick % 90 === 1) readColor();
        cx.clearRect(0, 0, W, H);
        var L = 130;
        for (var i = 0; i < P.length; i++) {
            var a = P[i];
            if (!reduce) {
                a.x += a.vx; a.y += a.vy;
                if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
                var dx = a.x - mx, dy = a.y - my, d = Math.sqrt(dx * dx + dy * dy);
                if (d < 110 && d > 0) { a.x += dx / d * .8; a.y += dy / d * .8; }
            }
            cx.beginPath(); cx.arc(a.x, a.y, a.r, 0, 6.2832); cx.fillStyle = 'rgba(' + col + ',.55)'; cx.fill();
            for (var j = i + 1; j < P.length; j++) {
                var b = P[j], ex = a.x - b.x, ey = a.y - b.y, e = ex * ex + ey * ey;
                if (e < L * L) { cx.strokeStyle = 'rgba(' + col + ',' + (.22 * (1 - Math.sqrt(e) / L)).toFixed(3) + ')'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); }
            }
            var mdx = a.x - mx, mdy = a.y - my, md = Math.sqrt(mdx * mdx + mdy * mdy);
            if (md < 170) { cx.strokeStyle = 'rgba(' + col + ',' + (.5 * (1 - md / 170)).toFixed(3) + ')'; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(mx, my); cx.stroke(); }
        }
        if (!reduce) raf = requestAnimationFrame(draw);
    }
    window.addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    window.addEventListener('pointerleave', function () { mx = my = -9999; });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); if (reduce) draw(); }, 200); });
    document.addEventListener('visibilitychange', function () { cancelAnimationFrame(raf); if (!document.hidden && !reduce) raf = requestAnimationFrame(draw); });
    readColor(); size(); draw();
})();