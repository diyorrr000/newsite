// ===== ASOSIY O'ZGARUVCHILAR =====
let audioEnabled = true;
let currentSection = 'home';
let terminalCommands = {};
let particles = [];
let floatingElements = [];

// ===== SAYT YUKLANISHI =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 3D Portfolio Yuklanmoqda...');
    
    // 1. Yuklanish ekrani animatsiyasi
    initLoadingScreen();
    
    // 2. 3D Canvas fonini ishga tushirish
    init3DCanvas();
    
    // 3. Ovo z kontrollerini ishga tushirish
    initAudioSystem();
    
    // 4. Navigatsiyani sozlash
    initNavigation();
    
    // 5. Terminalni ishga tushirish
    initTerminal();
    
    // 6. 3D elementlarni yaratish
    create3DElements();
    
    // 7. Zarrachalarni yaratish
    createParticles();
    
    // 8. Aloqa formasini sozlash
    initContactForm();
    
    // 9. Scroll effektlari
    initScrollEffects();
    
    console.log('✅ 3D Portfolio Muvaffaqiyatli Yuklandi!');
});

// ===== 1. YUKLANISH EKRANI =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressFill = document.querySelector('.progressFill');
    
    // Progress bar animatsiyasi
    setTimeout(() => {
        progressFill.style.width = '30%';
    }, 500);
    
    setTimeout(() => {
        progressFill.style.width = '60%';
    }, 1000);
    
    setTimeout(() => {
        progressFill.style.width = '80%';
    }, 1500);
    
    setTimeout(() => {
        progressFill.style.width = '100%';
    }, 2000);
    
    // Yuklanishni yakunlash
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            
            // Sayt yuklangandan keyin 3D animatsiyalarni boshlash
            start3DAnimations();
            
            // Ovozni yoqish (agar ruxsat berilgan bo'lsa)
            if (audioEnabled) {
                document.getElementById('ambientSound').play().catch(e => {
                    console.log('Ovozni avtomatik ijro etish bloklangan');
                });
            }
        }, 500);
    }, 2500);
}

// ===== 2. 3D CANVAS FON =====
function init3DCanvas() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    
    // Canvas o'lchamini sozlash
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 3D Nuqtalar (Particles)
    const dots = [];
    const dotCount = 150;
    
    // Nuqtalarni yaratish
    class Dot {
        constructor() {
            this.reset();
            this.z = Math.random() * 1000;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 1000;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, 
                             ${Math.floor(Math.random() * 100 + 155)}, 
                             255, ${Math.random() * 0.5 + 0.1})`;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.z -= 1;
            
            // Agar chegaradan chiqsa, qayta yarat
            if (this.x < 0 || this.x > canvas.width || 
                this.y < 0 || this.y > canvas.height ||
                this.z < 0) {
                this.reset();
                this.z = 1000;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
        }
        
        draw() {
            const scale = 1000 / (1000 + this.z);
            const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
            const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
            const r2d = this.radius * scale;
            
            ctx.beginPath();
            ctx.arc(x2d, y2d, r2d, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Chiziqlar
            dots.forEach(dot => {
                const dx = x2d - dot.x2d;
                const dy = y2d - dot.y2d;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(x2d, y2d);
                    ctx.lineTo(dot.x2d, dot.y2d);
                    ctx.strokeStyle = `rgba(0, 219, 222, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
            
            this.x2d = x2d;
            this.y2d = y2d;
        }
    }
    
    // Nuqtalarni massivga qo'shish
    for (let i = 0; i < dotCount; i++) {
        dots.push(new Dot());
    }
    
    // Animatsiya funksiyasi
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Gradient fon
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
        gradient.addColorStop(0, 'rgba(10, 10, 10, 0.1)');
        gradient.addColorStop(1, 'rgba(5, 5, 5, 0.8)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 3D Chiziqlar
        ctx.beginPath();
        for (let i = 0; i < 20; i++) {
            const x = (canvas.width / 20) * i;
            ctx.moveTo(x, 0);
            ctx.lineTo(x + 100, canvas.height);
            ctx.strokeStyle = `rgba(0, 219, 222, ${0.05 + Math.sin(Date.now() / 1000 + i) * 0.05})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Nuqtalarni yangilash va chizish
        dots.forEach(dot => {
            dot.update();
            dot.draw();
        });
        
        // 3D To'lqin effekti
        ctx.beginPath();
        for (let i = 0; i < canvas.width; i += 10) {
            const y = canvas.height / 2 + Math.sin(Date.now() / 1000 + i / 100) * 50;
            if (i === 0) {
                ctx.moveTo(i, y);
            } else {
                ctx.lineTo(i, y);
            }
        }
        ctx.strokeStyle = 'rgba(0, 219, 222, 0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ===== 3. OVOZ TIZIMI =====
function initAudioSystem() {
    const audioToggle = document.getElementById('audioToggle');
    const ambientSound = document.getElementById('ambientSound');
    const clickSound = document.getElementById('clickSound');
    const hoverSound = document.getElementById('hoverSound');
    const visualizerBars = document.querySelectorAll('.audioVisualizer .bar');
    
    // Ovoz tugmasi
    audioToggle.addEventListener('click', function() {
        playSound(clickSound);
        audioEnabled = !audioEnabled;
        
        if (audioEnabled) {
            this.classList.remove('muted');
            ambientSound.play();
            updateVisualizer(true);
        } else {
            this.classList.add('muted');
            ambientSound.pause();
            updateVisualizer(false);
        }
    });
    
    // Havola va tugmalarga hover ovozini qo'shish
    document.querySelectorAll('a, button, .navItem, .socialLink, .ctaBtn').forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (audioEnabled) {
                playSound(hoverSound);
            }
        });
        
        element.addEventListener('click', function(e) {
            if (!this.href || this.getAttribute('type') === 'submit') {
                if (audioEnabled) {
                    playSound(clickSound);
                }
            }
        });
    });
    
    // Vizualizatorni yangilash
    function updateVisualizer(active) {
        if (active) {
            visualizerBars.forEach((bar, index) => {
                bar.style.animation = `visualize 1s infinite ease-in-out ${index * 0.1}s`;
            });
        } else {
            visualizerBars.forEach(bar => {
                bar.style.animation = 'none';
                bar.style.height = '10px';
            });
        }
    }
    
    // Ovozni ijro etish funksiyasi
    function playSound(soundElement) {
        if (!audioEnabled) return;
        
        soundElement.currentTime = 0;
        soundElement.play().catch(e => {
            console.log('Ovozni ijro etishda xatolik:', e);
        });
    }
    
    // Vizualizatorni boshlash
    updateVisualizer(audioEnabled);
}

// ===== 4. NAVIGATSIYA =====
function initNavigation() {
    const navItems = document.querySelectorAll('.navItem');
    const mobileMenuBtn = document.querySelector('.mobileMenuBtn');
    const mobileMenu = document.querySelector('.mobileMenu');
    const mobileMenuItems = document.querySelectorAll('.mobileMenuItem');
    const sectionLinks = document.querySelectorAll('[data-section]');
    
    // Bo'limlarni ko'rsatish
    function showSection(sectionId) {
        // Hozirgi bo'limni yashirish
        document.querySelectorAll('.contentSection.active').forEach(section => {
            section.classList.remove('active');
        });
        
        // Yangi bo'limni ko'rsatish
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            currentSection = sectionId;
            
            // 3D effektni yangilash
            update3DEffects(sectionId);
            
            // Navigatsiyani yangilash
            updateNavigation(sectionId);
            
            // Mobil menyuni yopish
            mobileMenu.classList.remove('active');
        }
    }
    
    // Navigatsiyani yangilash
    function updateNavigation(activeSection) {
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === activeSection);
        });
        
        mobileMenuItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === activeSection);
        });
    }
    
    // Navigatsiya itemlariga hodisa qo'shish
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            showSection(this.dataset.section);
        });
    });
    
    // Mobil menyu tugmasi
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        playSound(document.getElementById('clickSound'));
    });
    
    // Mobil menyu itemlari
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            showSection(this.dataset.section);
        });
    });
    
    // Barcha section linklariga hodisa qo'shish
    sectionLinks.forEach(link => {
        if (link.dataset.section) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showSection(this.dataset.section);
            });
        }
    });
    
    // Scroll orqali bo'limlarni almashtirish
    let isScrolling = false;
    
    window.addEventListener('wheel', function(e) {
        if (isScrolling) return;
        
        const sections = ['home', 'about', 'skills', 'terminal', 'projects', 'contact'];
        const currentIndex = sections.indexOf(currentSection);
        
        if (e.deltaY > 0 && currentIndex < sections.length - 1) {
            // Pastga scroll
            isScrolling = true;
            showSection(sections[currentIndex + 1]);
            setTimeout(() => { isScrolling = false; }, 1000);
        } else if (e.deltaY < 0 && currentIndex > 0) {
            // Yuqoriga scroll
            isScrolling = true;
            showSection(sections[currentIndex - 1]);
            setTimeout(() => { isScrolling = false; }, 1000);
        }
    });
    
    // Dastlabki bo'limni ko'rsatish
    showSection('home');
}

// ===== 5. TERMINAL TIZIMI =====
function initTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const executeButton = document.getElementById('executeCommand');
    const terminalOutput = document.getElementById('terminalOutput');
    const commandHistory = document.getElementById('commandHistory');
    const quickCommands = document.querySelectorAll('.quickCmd');
    const copyCodeButton = document.querySelector('.copyCode');
    
    // Terminal buyruqlarini aniqlash
    terminalCommands = {
        'yordam': {
            response: [
                '📋 <strong>Mavjud buyruqlar:</strong>',
                '├─ <span class="cmd">holat</span> - Tizim holati',
                '├─ <span class="cmd">loyihalar</span> - Loyihalar ro\'yxati',
                '├─ <span class="cmd">ko\'nikmalar</span> - Ko\'nikmalar',
                '├─ <span class="cmd">aloqa</span> - Aloqa ma\'lumotlari',
                '├─ <span class="cmd">tozalash</span> - Ekranni tozalash',
                '└─ <span class="cmd">github</span> - GitHub profilim',
                '',
                '💡 <em>Tez buyruqlar uchun pastdagi tugmalardan foydalaning</em>'
            ],
            type: 'info'
        },
        'holat': {
            response: [
                '✅ <strong>Tizim Holati:</strong>',
                '├─ 🤖 Faol Botlar: <span class="highlight">15</span>',
                '├─ 🚀 Ish vaqti: <span class="highlight">99.8%</span>',
                '├─ 💾 Xotira: <span class="highlight">2.4/4GB</span>',
                '├─ 🌡️ CPU: <span class="highlight">42°C</span>',
                '└─ 📊 Bandlik: <span class="highlight">68%</span>',
                '',
                '🟢 Barcha tizimlar normal ishlamoqda'
            ],
            type: 'success'
        },
        'loyihalar': {
            response: [
                '🚀 <strong>So\'nggi Loyihalar:</strong>',
                '1. <span class="highlight">Telegram Do\'kon Boti</span>',
                '   └─ Python, aiogram, PostgreSQL',
                '',
                '2. <span class="highlight">AI Yordamchi Bot</span>',
                '   └─ OpenAI GPT-4, NLP',
                '',
                '3. <span class="highlight">Kripto Savdo Boti</span>',
                '   └─ Binance API, WebSocket',
                '',
                '4. <span class="highlight">3D O\'yin Boti</span>',
                '   └─ Three.js, WebGL',
                '',
                '📈 Jami: <span class="highlight">50+</span> muvaffaqiyatli loyiha'
            ],
            type: 'info'
        },
        'ko\'nikmalar': {
            response: [
                '💪 <strong>Asosiy Ko\'nikmalar:</strong>',
                '├─ 🐍 <span class="highlight">Python</span> - 95%',
                '├─ 🤖 <span class="highlight">Telegram Bot API</span> - 90%',
                '├─ ⚛️ <span class="highlight">Three.js/WebGL</span> - 85%',
                '├─ 🗄️ <span class="highlight">PostgreSQL/MongoDB</span> - 80%',
                '└-- 🐳 <span class="highlight">Docker/Linux</span> - 75%',
                '',
                '📚 Batafsil ma\'lumot uchun "Ko\'nikmalar" bo\'limiga o\'ting'
            ],
            type: 'info'
        },
        'aloqa': {
            response: [
                '📞 <strong>Aloqa Ma\'lumotlari:</strong>',
                '├─ 📱 Telegram: <a href="https://t.me/zafarvcd" target="_blank">@zafarvcd</a>',
                '├─ 📧 Email: <a href="mailto:zafar@dev.uz">zafar@dev.uz</a>',
                '├-- 📸 Instagram: <a href="https://instagram.com/zafarvcd" target="_blank">@zafarvcd</a>',
                '└-- 💻 GitHub: <a href="https://github.com/diyorrr000" target="_blank">diyorrr000</a>',
                '',
                '⏰ Ish vaqti: Dushanba-Juma 9:00-18:00'
            ],
            type: 'info'
        },
        'github': {
            response: [
                '🔗 GitHub profiliga yo\'naltirilmoqda...',
                '👉 <a href="https://github.com/diyorrr000" target="_blank">github.com/diyorrr000</a>'
            ],
            type: 'link',
            action: () => {
                setTimeout(() => {
                    window.open('https://github.com/diyorrr000', '_blank');
                }, 1000);
            }
        },
        'tozalash': {
            response: [],
            type: 'clear',
            action: () => {
                terminalOutput.innerHTML = '';
                commandHistory.innerHTML = '';
            }
        },
        'salom': {
            response: [
                '👋 Salom! Men ZAFARVCD terminaliman!',
                'Yordam kerak bo\'lsa "yordam" buyrug\'ini yozing.'
            ],
            type: 'welcome'
        }
    };
    
    // Terminalga xabar qo'shish
    function addToTerminal(message, type = 'output') {
        const line = document.createElement('div');
        line.className = `outputLine ${type}`;
        
        if (type === 'input') {
            line.innerHTML = `<span class="prompt">$</span> ${message}`;
            commandHistory.appendChild(line.cloneNode(true));
        } else {
            line.innerHTML = message;
        }
        
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        
        // Animatsiya effekti
        line.style.opacity = '0';
        line.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            line.style.transition = 'all 0.3s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Buyruqni bajarish
    function executeCommand(command) {
        if (!command.trim()) return;
        
        // Kirishni terminalga yozish
        addToTerminal(command, 'input');
        
        // Buyruqni kichik harflarga o'tkazish
        const cmd = command.toLowerCase().trim();
        
        // Maxsus effektlar
        if (cmd === 'matrix') {
            matrixEffect();
            return;
        }
        
        if (cmd === '3d') {
            activate3DEffect();
            return;
        }
        
        // Buyruqni tekshirish
        if (terminalCommands[cmd]) {
            const cmdData = terminalCommands[cmd];
            
            // Javoblarni chiqarish
            cmdData.response.forEach(line => {
                addToTerminal(line);
            });
            
            // Qo'shimcha harakat
            if (cmdData.action) {
                cmdData.action();
            }
        } else {
            // Noma'lum buyruq
            addToTerminal(`❌ Noma'lum buyruq: <span class="error">${command}</span>`);
            addToTerminal(`💡 Mavjud buyruqlarni ko'rish uchun "<span class="cmd">yordam</span>" ni yozing`);
        }
        
        // Inputni tozalash
        terminalInput.value = '';
    }
    
    // Enter tugmasi bilan bajarish
    terminalInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            executeCommand(this.value);
        }
    });
    
    // Tugma bilan bajarish
    executeButton.addEventListener('click', function() {
        executeCommand(terminalInput.value);
    });
    
    // Tez buyruqlar
    quickCommands.forEach(button => {
        button.addEventListener('click', function() {
            executeCommand(this.dataset.cmd);
        });
    });
    
    // Kodni nusxalash
    if (copyCodeButton) {
        copyCodeButton.addEventListener('click', function() {
            const codeElement = document.querySelector('.demoCode');
            const codeText = codeElement.textContent;
            
            navigator.clipboard.writeText(codeText).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Nusxalandi!';
                this.style.background = 'var(--accent)';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = '';
                }, 2000);
            });
        });
    }
    
    // Terminalni boshlang'ich holatga keltirish
    addToTerminal('🌟 Python Bot Terminaliga xush kelibsiz v3.0', 'welcome');
    addToTerminal('🚀 Python Telegram Bot Development Environment');
    addToTerminal('📟 Mavjud buyruqlarni ko\'rish uchun "yordam" ni yozing');
    addToTerminal('> Tizim muvaffaqiyatli ishga tushirildi...');
    
    // Fokusni inputga o'tkazish
    terminalInput.focus();
}

// ===== 6. 3D ELEMENTLAR =====
function create3DElements() {
    const container = document.querySelector('.floating3dElements');
    
    // 3D elementlarni yaratish
    const elements = [
        { type: 'cube', color: '#00dbde', size: 30, x: 10, y: 20 },
        { type: 'sphere', color: '#fc00ff', size: 25, x: 90, y: 40 },
        { type: 'pyramid', color: '#00ff41', size: 35, x: 15, y: 70 },
        { type: 'torus', color: '#ffa502', size: 20, x: 85, y: 80 }
    ];
    
    elements.forEach((element, index) => {
        const el = document.createElement('div');
        el.className = `floating3d ${element.type}`;
        el.style.cssText = `
            position: absolute;
            width: ${element.size}px;
            height: ${element.size}px;
            left: ${element.x}%;
            top: ${element.y}%;
            background: ${element.color};
            opacity: 0.1;
            pointer-events: none;
            z-index: -1;
        `;
        
        container.appendChild(el);
        floatingElements.push({
            element: el,
            x: element.x,
            y: element.y,
            type: element.type,
            speed: 0.5 + Math.random() * 1
        });
    });
}

// ===== 7. ZARRACHALAR =====
function createParticles() {
    const containers = document.querySelectorAll('.particles');
    
    containers.forEach(container => {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 5 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = 3 + Math.random() * 7;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${Math.random() > 0.5 ? 'var(--primary)' : 'var(--secondary)'};
                border-radius: 50%;
                left: ${posX}%;
                top: ${posY}%;
                opacity: ${Math.random() * 0.3 + 0.1};
                pointer-events: none;
                animation: floatParticle ${duration}s infinite ease-in-out ${delay}s;
            `;
            
            container.appendChild(particle);
            particles.push(particle);
        }
    });
    
    // CSS animatsiyasini qo'shish
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0%, 100% {
                transform: translate(0, 0) scale(1);
                opacity: 0.1;
            }
            25% {
                transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.2);
                opacity: 0.3;
            }
            50% {
                transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(0.8);
                opacity: 0.2;
            }
            75% {
                transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.1);
                opacity: 0.4;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== 8. ALOQA FORMASI =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form ma'lumotlarini olish
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                projectType: document.getElementById('projectType').value,
                message: document.getElementById('message').value
            };
            
            // Validatsiya
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Iltimos, barcha maydonlarni to\'ldiring!', 'error');
                return;
            }
            
            // Yuborish tugmasini bloklash
            const submitBtn = this.querySelector('.submitBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';
            submitBtn.disabled = true;
            
            // Simulyatsiya: Formani yuborish
            setTimeout(() => {
                // Bu yerda haqiqiy backend API ga so'rov yuboriladi
                console.log('Form ma\'lumotlari:', formData);
                
                // Muvaffaqiyatli xabar
                showNotification('Xabaringiz muvaffaqiyatli yuborildi! Tez orada aloqaga chiqaman.', 'success');
                
                // Formani tozalash
                contactForm.reset();
                
                // Tugmani qayta tiklash
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // 3D effekt
                createFormConfetti();
                
            }, 2000);
        });
    }
}

// ===== 9. SCROLL EFFEKT =====
function initScrollEffects() {
    // Parallax effekt
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // 3D elementlarni harakatlantirish
        floatingElements.forEach(item => {
            const newY = item.y + (scrolled * 0.01 * item.speed);
            item.element.style.top = `${newY}%`;
        });
        
        // Sektions uchun parallax
        document.querySelectorAll('.contentSection').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
                const depth = section.dataset.depth || 0.5;
                const movement = (scrolled - sectionTop) * depth;
                section.style.transform = `translateY(${movement}px)`;
            }
        });
    });
}

// ===== 3D ANIMATSIYALAR =====
function start3DAnimations() {
    // Suzuvchi elementlarni animatsiya qilish
    function animateFloatingElements() {
        floatingElements.forEach(item => {
            const time = Date.now() * 0.001;
            const x = item.x + Math.sin(time * item.speed) * 2;
            const y = item.y + Math.cos(time * item.speed) * 2;
            
            item.element.style.left = `${x}%`;
            item.element.style.top = `${y}%`;
            
            // Aylanish
            if (item.type === 'cube') {
                item.element.style.transform = `rotateX(${time * 30}deg) rotateY(${time * 45}deg)`;
            } else if (item.type === 'sphere') {
                item.element.style.borderRadius = '50%';
                item.element.style.boxShadow = `0 0 ${Math.sin(time) * 10 + 20}px ${item.element.style.background}`;
            }
        });
        
        requestAnimationFrame(animateFloatingElements);
    }
    
    animateFloatingElements();
    
    // 3D kub animatsiyalari
    document.querySelectorAll('.cube').forEach(cube => {
        if (!cube.classList.contains('no-animate')) {
            setInterval(() => {
                cube.style.transform = `rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg)`;
            }, 3000);
        }
    });
}

// ===== QO'SHIMCHA FUNKSIYALAR =====

// 3D effektlarni yangilash
function update3DEffects(sectionId) {
    // Har bir bo'lim uchun alohida 3D effektlar
    switch(sectionId) {
        case 'home':
            document.body.style.background = 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)';
            break;
        case 'terminal':
            document.body.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #001a1a 100%)';
            break;
        case 'projects':
            document.body.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a001a 100%)';
            break;
        default:
            document.body.style.background = '';
    }
}

// Xabarnoma ko'rsatish
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 255, 65, 0.1)' : 'rgba(255, 71, 87, 0.1)'};
        border: 1px solid ${type === 'success' ? 'var(--accent)' : '#ff4757'};
        color: var(--light);
        padding: 15px 20px;
        border-radius: var(--border-radius);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Konfetti effekti
function createFormConfetti() {
    const colors = ['#00dbde', '#fc00ff', '#00ff41', '#ffa502', '#ff4757'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = 1 + Math.random() * 2;
        
        confetti.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            left: ${left}%;
            top: -20px;
            pointer-events: none;
            z-index: 10000;
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${duration}s ease-in forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
    
    // CSS animatsiyasini qo'shish
    const style = document.createElement('style');
    if (!document.querySelector('#confetti-style')) {
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(${Math.random() * 720}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Matrix effekti (terminal uchun)
function matrixEffect() {
    const terminalOutput = document.getElementById('terminalOutput');
    const originalContent = terminalOutput.innerHTML;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    let matrixText = '';
    
    for (let i = 0; i < 50; i++) {
        matrixText += chars[Math.floor(Math.random() * chars.length)];
    }
    
    terminalOutput.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const line = document.createElement('div');
        line.className = 'outputLine matrix';
        line.textContent = matrixText.split('').map(() => 
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        line.style.color = '#00ff41';
        terminalOutput.appendChild(line);
    }
    
    setTimeout(() => {
        terminalOutput.innerHTML = originalContent;
    }, 3000);
}

// 3D effektni faollashtirish
function activate3DEffect() {
    document.querySelectorAll('.contentSection').forEach(section => {
        section.style.transform = 'perspective(1000px) rotateX(10deg)';
        section.style.transition = 'transform 1s ease';
    });
    
    setTimeout(() => {
        document.querySelectorAll('.contentSection').forEach(section => {
            section.style.transform = '';
        });
    }, 2000);
}

// ===== SAYT TAYYOR =====
console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║  🚀 ZAFARVCD 3D PORTFOLIO - MUVAFFAQIYATLI YUKLANDI!    ║
║                                                          ║
║  📊 Stats:                                               ║
║    • HTML: 3000+ qator                                   ║
║    • CSS: 1500+ qator                                    ║
║    • JavaScript: 500+ qator                              ║
║    • 3D Effects: 15+                                     ║
║    • Animations: 25+                                     ║
║                                                          ║
║  🌐 Open: http://zafarvcd.portfolio                      ║
║  📞 Contact: @zafarvcd                                   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);

// Qo'shimcha CSS animatsiyalari
const extraStyles = document.createElement('style');
extraStyles.textContent = `
    .cmd { color: var(--primary); font-weight: bold; }
    .error { color: #ff4757; }
    .highlight { color: var(--accent); }
    .success { color: #2ed573; }
    .info { color: #00d2ff; }
    
    .matrix {
        font-family: 'Courier New', monospace;
        animation: matrixFlow 0.1s infinite;
    }
    
    @keyframes matrixFlow {
        0% { opacity: 0.8; }
        50% { opacity: 0.3; }
        100% { opacity: 0.8; }
    }
    
    /* Terminal scrollbar */
    .commandHistory::-webkit-scrollbar {
        width: 6px;
    }
    
    .commandHistory::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.3);
    }
    
    .commandHistory::-webkit-scrollbar-thumb {
        background: var(--primary);
        border-radius: 3px;
    }
    
    /* Loading animation for stats */
    @keyframes fillCircle {
        to {
            background: conic-gradient(var(--primary) var(--fill-percent), 
                         rgba(0, 219, 222, 0.1) 0%);
        }
    }
    
    /* Hover effects for cards */
    .skillCard:hover .skillLevel {
        transform: scaleY(1.1);
    }
    
    /* Pulse animation for CTA buttons */
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 219, 222, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(0, 219, 222, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 219, 222, 0); }
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
    
    /* Typewriter cursor */
    .typewriter::after {
        content: '|';
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;

document.head.appendChild(extraStyles);

// Stats circles animation
document.querySelectorAll('.statCircle').forEach(circle => {
    const percent = circle.dataset.percent;
    circle.style.setProperty('--fill-percent', `${percent}%`);
});

// Auto-typing for hero subtitle
const typewriterElement = document.querySelector('.typewriter');
if (typewriterElement) {
    const texts = [
        "Python, Sun'iy Intellekt va 3D texnologiyalari bilan kelajakdagi raqam tajribalar yarataman",
        "Telegram bot dasturlash bo'yicha mutaxassis",
        "Full-stack dasturchi va 3D veb dizayner",
        "Innovatsion texnologik yechimlar yarataman"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    
    setTimeout(type, 1000);
}