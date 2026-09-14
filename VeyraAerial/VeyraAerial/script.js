/**
 * VEYRA AERIAL — Cinematic Drone Production Interaction Engine
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. PRECISION CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor-target');
    const hoverTargets = document.querySelectorAll('.hover-target, button, a, input, select, textarea');

    if (cursor) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.22;
            cursorY += (mouseY - cursorY) * 0.22;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                if (target.classList.contains('work-card') || target.classList.contains('price-card')) {
                    cursor.classList.add('active-card');
                } else {
                    cursor.classList.add('active-box');
                }
            });
            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('active-box', 'active-card');
            });
        });
    }

    // --- 2. 60FPS LERP MOUSE PARALLAX DEPTH ---
    const parallaxContainers = document.querySelectorAll('.mouse-parallax-container');
    if (parallaxContainers.length && window.innerWidth > 992) {
        let targetBgX = 0, targetBgY = 0, currentBgX = 0, currentBgY = 0;
        let targetFgX = 0, targetFgY = 0, currentFgX = 0, currentFgY = 0;
        const lerpFactor = 0.08;

        window.addEventListener('mousemove', (e) => {
            const relX = (e.clientX / window.innerWidth) - 0.5;
            const relY = (e.clientY / window.innerHeight) - 0.5;
            targetBgX = relX * -18;
            targetBgY = relY * -14;
            targetFgX = relX * 12;
            targetFgY = relY * 9;
        }, { passive: true });

        const updateParallax = () => {
            currentBgX += (targetBgX - currentBgX) * lerpFactor;
            currentBgY += (targetBgY - currentBgY) * lerpFactor;
            currentFgX += (targetFgX - currentFgX) * lerpFactor;
            currentFgY += (targetFgY - currentFgY) * lerpFactor;

            parallaxContainers.forEach(container => {
                container.style.setProperty('--mouse-px-bg-x', `${currentBgX.toFixed(2)}px`);
                container.style.setProperty('--mouse-px-bg-y', `${currentBgY.toFixed(2)}px`);
                container.style.setProperty('--mouse-px-fg-x', `${currentFgX.toFixed(2)}px`);
                container.style.setProperty('--mouse-px-fg-y', `${currentFgY.toFixed(2)}px`);
            });
            requestAnimationFrame(updateParallax);
        };
        requestAnimationFrame(updateParallax);
    }

    // --- 3. NAVBAR SCROLL BLUR TRANSITION ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // --- 4. NUMERIC STATS COUNTER ---
    const counters = document.querySelectorAll('.counter');
    let counted = false;
    const statsSection = document.querySelector('.stats-container');

    const runCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const step = Math.max(1, Math.ceil(target / 45));
            const timer = setInterval(() => {
                count += step;
                if (count >= target) {
                    counter.innerText = target;
                    clearInterval(timer);
                } else {
                    counter.innerText = count;
                }
            }, 30);
        });
    };

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counted) {
                runCounters();
                counted = true;
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // --- 5. CINEMATIC DRONE FLIGHT TIMELINE SCROLL ENGINE ---
    const timelineRoot = document.getElementById('drone-timeline-root');
    const desktopFlightLine = document.getElementById('desktop-flight-line');
    const desktopBeacon = document.getElementById('desktop-drone-beacon');
    const mobileFlightLine = document.getElementById('mobile-flight-line');
    const mobileBeacon = document.getElementById('mobile-drone-beacon');
    const stepNodes = document.querySelectorAll('.timeline-step-node');
    const progressReadout = document.getElementById('timeline-progress-readout');

    if (timelineRoot) {
        const updateDroneFlight = () => {
            const rect = timelineRoot.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const startY = viewportHeight * 0.85;
            const endY = viewportHeight * 0.15;
            const totalTravel = startY - endY;
            const currentPosition = startY - rect.top;
            
            let progress = currentPosition / (rect.height + totalTravel * 0.6);
            progress = Math.max(0, Math.min(1, progress));
            const percent = Math.round(progress * 100);

            if (progressReadout) {
                progressReadout.innerText = `PROGRESS: ${percent}%`;
            }

            if (window.innerWidth > 992) {
                if (desktopFlightLine) desktopFlightLine.style.width = `${percent}%`;
                if (desktopBeacon) {
                    desktopBeacon.style.left = `${percent}%`;
                    if (progress > 0.02) desktopBeacon.classList.add('is-active');
                    else desktopBeacon.classList.remove('is-active');
                }
            } else {
                if (mobileFlightLine) mobileFlightLine.style.height = `${percent}%`;
                if (mobileBeacon) {
                    mobileBeacon.style.top = `${percent}%`;
                    if (progress > 0.02) mobileBeacon.classList.add('is-active');
                    else mobileBeacon.classList.remove('is-active');
                }
            }

            const stepThresholds = [0.08, 0.33, 0.62, 0.88];
            stepNodes.forEach((node, index) => {
                const threshold = stepThresholds[index];
                if (progress >= threshold) {
                    node.classList.add('is-active');
                } else {
                    node.classList.remove('is-active');
                }
                if (progress > threshold + 0.22) {
                    node.classList.add('is-passed');
                } else {
                    node.classList.remove('is-passed');
                }
            });
        };

        window.addEventListener('scroll', updateDroneFlight, { passive: true });
        window.addEventListener('resize', updateDroneFlight, { passive: true });
        updateDroneFlight();
    }

    // --- 6. SCROLL REVEAL OBSERVERS ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.12 });
    revealElements.forEach(el => revealObserver.observe(el));

    // Curtain reveals for portfolio
    const revealWrappers = document.querySelectorAll('.cinematic-reveal-wrapper');
    const curtainObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
            }
        });
    }, { threshold: 0.18 });
    revealWrappers.forEach(el => curtainObserver.observe(el));

    // Directional pricing card reveals
    const priceCards = document.querySelectorAll('.scroll-reveal-card');
    const pricingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-revealed');
                }, parseInt(delay, 10));
            }
        });
    }, { threshold: 0.15 });
    priceCards.forEach(card => pricingObserver.observe(card));

    // --- 7. PORTFOLIO FILTERING ---
    const filterTabs = document.querySelectorAll('.tab-btn');
    const workCards = document.querySelectorAll('.work-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filterValue = tab.getAttribute('data-filter');

            workCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350);
                }
            });
        });
    });

    // --- 8. 3D CARD PERSPECTIVE TILT ---
    workCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 992) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // --- 9. VIDEO MODAL ---
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('modal-video-iframe');
    const modalClose = document.querySelector('.modal-close');

    workCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.view-project-cue')) return;
            const videoUrl = card.getAttribute('data-video');
            if (videoUrl && videoModal && videoIframe) {
                videoIframe.src = `${videoUrl}?autoplay=1`;
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeVideo = () => {
        if (!videoModal) return;
        videoModal.classList.remove('active');
        if (videoIframe) videoIframe.src = '';
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeVideo);
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideo();
        });
    }

    // --- 10. INQUIRY & CONSULTATION POPUP FORM ---
    const inquiryModal = document.getElementById('inquiry-modal');
    const inquiryClose = document.querySelector('.inquiry-close');
    const openInquiryButtons = document.querySelectorAll('.open-inquiry-modal');
    const packageSelector = document.getElementById('package-selector-modal');
    const hiddenPackageInput = document.getElementById('selected-package-hidden');
    const inquiryForm = document.getElementById('project-inquiry-form');
    const formWrap = document.getElementById('inquiry-form-wrap');
    const successState = document.getElementById('inquiry-success-state');
    const successWhatsApp = document.getElementById('success-whatsapp-link');

    openInquiryButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const chosenPackage = btn.getAttribute('data-package');
            if (chosenPackage && packageSelector && hiddenPackageInput) {
                packageSelector.value = chosenPackage;
                hiddenPackageInput.value = chosenPackage;
            }
            if (inquiryModal) {
                inquiryModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeInquiry = () => {
        if (!inquiryModal) return;
        inquiryModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (inquiryClose) inquiryClose.addEventListener('click', closeInquiry);
    if (inquiryModal) {
        inquiryModal.addEventListener('click', (e) => {
            if (e.target === inquiryModal) closeInquiry();
        });
    }

    if (packageSelector && hiddenPackageInput) {
        packageSelector.addEventListener('change', () => {
            hiddenPackageInput.value = packageSelector.value;
        });
    }

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('btn-submit-text');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Submitting Brief...';
            }

            const formData = new FormData(inquiryForm);
            try {
                const response = await fetch(inquiryForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok || response.status === 200) {
                    if (formWrap) formWrap.style.display = 'none';
                    if (successState) successState.classList.add('is-active');
                    const clientName = formData.get('Client Name') || 'Client';
                    const pack = formData.get('Package Selection') || 'Custom Project';
                    if (successWhatsApp) {
                        const msg = encodeURIComponent(`Hello Luka, I submitted a consultation brief on VEYRA AERIAL for ${pack}. Name: ${clientName}`);
                        successWhatsApp.href = `https://wa.me/38267117291?text=${msg}`;
                    }
                } else {
                    inquiryForm.submit();
                }
            } catch (err) {
                inquiryForm.submit();
            }
        });
    }

    // --- 11. ESCAPE KEY ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideo();
            closeInquiry();
        }
    });

    // --- 12. CANVAS DUST PARTICLES ---
    const canvas = document.getElementById('spotlight-dust-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.parentElement.offsetWidth;
        let height = canvas.height = canvas.parentElement.offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        });

        const particles = [];
        const particleCount = 45;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.55 + 0.15,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.3 - 0.15
            });
        }

        const renderDust = () => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(226, 194, 141, ${p.alpha})`;
                ctx.fill();
            }
            requestAnimationFrame(renderDust);
        };
        requestAnimationFrame(renderDust);
    }
});/**
 * VEYRA AERIAL — Cinematic Drone Production Interaction Engine
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. PRECISION CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor-target');
    const hoverTargets = document.querySelectorAll('.hover-target, button, a, input, select, textarea');

    if (cursor) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.22;
            cursorY += (mouseY - cursorY) * 0.22;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                if (target.classList.contains('work-card') || target.classList.contains('price-card')) {
                    cursor.classList.add('active-card');
                } else {
                    cursor.classList.add('active-box');
                }
            });
            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('active-box', 'active-card');
            });
        });
    }

    // --- 2. 60FPS LERP MOUSE PARALLAX DEPTH ---
    const parallaxContainers = document.querySelectorAll('.mouse-parallax-container');
    if (parallaxContainers.length && window.innerWidth > 992) {
        let targetBgX = 0, targetBgY = 0, currentBgX = 0, currentBgY = 0;
        let targetFgX = 0, targetFgY = 0, currentFgX = 0, currentFgY = 0;
        const lerpFactor = 0.08;

        window.addEventListener('mousemove', (e) => {
            const relX = (e.clientX / window.innerWidth) - 0.5;
            const relY = (e.clientY / window.innerHeight) - 0.5;
            targetBgX = relX * -18;
            targetBgY = relY * -14;
            targetFgX = relX * 12;
            targetFgY = relY * 9;
        }, { passive: true });

        const updateParallax = () => {
            currentBgX += (targetBgX - currentBgX) * lerpFactor;
            currentBgY += (targetBgY - currentBgY) * lerpFactor;
            currentFgX += (targetFgX - currentFgX) * lerpFactor;
            currentFgY += (targetFgY - currentFgY) * lerpFactor;

            parallaxContainers.forEach(container => {
                container.style.setProperty('--mouse-px-bg-x', `${currentBgX.toFixed(2)}px`);
                container.style.setProperty('--mouse-px-bg-y', `${currentBgY.toFixed(2)}px`);
                container.style.setProperty('--mouse-px-fg-x', `${currentFgX.toFixed(2)}px`);
                container.style.setProperty('--mouse-px-fg-y', `${currentFgY.toFixed(2)}px`);
            });
            requestAnimationFrame(updateParallax);
        };
        requestAnimationFrame(updateParallax);
    }

    // --- 3. NAVBAR SCROLL BLUR TRANSITION ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // --- 4. NUMERIC STATS COUNTER ---
    const counters = document.querySelectorAll('.counter');
    let counted = false;
    const statsSection = document.querySelector('.stats-container');

    const runCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const step = Math.max(1, Math.ceil(target / 45));
            const timer = setInterval(() => {
                count += step;
                if (count >= target) {
                    counter.innerText = target;
                    clearInterval(timer);
                } else {
                    counter.innerText = count;
                }
            }, 30);
        });
    };

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counted) {
                runCounters();
                counted = true;
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // --- 5. CINEMATIC DRONE FLIGHT TIMELINE SCROLL ENGINE ---
    const timelineRoot = document.getElementById('drone-timeline-root');
    const desktopFlightLine = document.getElementById('desktop-flight-line');
    const desktopBeacon = document.getElementById('desktop-drone-beacon');
    const mobileFlightLine = document.getElementById('mobile-flight-line');
    const mobileBeacon = document.getElementById('mobile-drone-beacon');
    const stepNodes = document.querySelectorAll('.timeline-step-node');
    const progressReadout = document.getElementById('timeline-progress-readout');

    if (timelineRoot) {
        const updateDroneFlight = () => {
            const rect = timelineRoot.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const startY = viewportHeight * 0.85;
            const endY = viewportHeight * 0.15;
            const totalTravel = startY - endY;
            const currentPosition = startY - rect.top;
            
            let progress = currentPosition / (rect.height + totalTravel * 0.6);
            progress = Math.max(0, Math.min(1, progress));
            const percent = Math.round(progress * 100);

            if (progressReadout) {
                progressReadout.innerText = `PROGRESS: ${percent}%`;
            }

            if (window.innerWidth > 992) {
                if (desktopFlightLine) desktopFlightLine.style.width = `${percent}%`;
                if (desktopBeacon) {
                    desktopBeacon.style.left = `${percent}%`;
                    if (progress > 0.02) desktopBeacon.classList.add('is-active');
                    else desktopBeacon.classList.remove('is-active');
                }
            } else {
                if (mobileFlightLine) mobileFlightLine.style.height = `${percent}%`;
                if (mobileBeacon) {
                    mobileBeacon.style.top = `${percent}%`;
                    if (progress > 0.02) mobileBeacon.classList.add('is-active');
                    else mobileBeacon.classList.remove('is-active');
                }
            }

            const stepThresholds = [0.08, 0.33, 0.62, 0.88];
            stepNodes.forEach((node, index) => {
                const threshold = stepThresholds[index];
                if (progress >= threshold) {
                    node.classList.add('is-active');
                } else {
                    node.classList.remove('is-active');
                }
                if (progress > threshold + 0.22) {
                    node.classList.add('is-passed');
                } else {
                    node.classList.remove('is-passed');
                }
            });
        };

        window.addEventListener('scroll', updateDroneFlight, { passive: true });
        window.addEventListener('resize', updateDroneFlight, { passive: true });
        updateDroneFlight();
    }

    // --- 6. SCROLL REVEAL OBSERVERS ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.12 });
    revealElements.forEach(el => revealObserver.observe(el));

    // Curtain reveals for portfolio
    const revealWrappers = document.querySelectorAll('.cinematic-reveal-wrapper');
    const curtainObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
            }
        });
    }, { threshold: 0.18 });
    revealWrappers.forEach(el => curtainObserver.observe(el));

    // Directional pricing card reveals
    const priceCards = document.querySelectorAll('.scroll-reveal-card');
    const pricingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-revealed');
                }, parseInt(delay, 10));
            }
        });
    }, { threshold: 0.15 });
    priceCards.forEach(card => pricingObserver.observe(card));

    // --- 7. PORTFOLIO FILTERING ---
    const filterTabs = document.querySelectorAll('.tab-btn');
    const workCards = document.querySelectorAll('.work-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filterValue = tab.getAttribute('data-filter');

            workCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350);
                }
            });
        });
    });

    // --- 8. 3D CARD PERSPECTIVE TILT ---
    workCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 992) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // --- 9. VIDEO MODAL ---
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('modal-video-iframe');
    const modalClose = document.querySelector('.modal-close');

    workCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.view-project-cue')) return;
            const videoUrl = card.getAttribute('data-video');
            if (videoUrl && videoModal && videoIframe) {
                videoIframe.src = `${videoUrl}?autoplay=1`;
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeVideo = () => {
        if (!videoModal) return;
        videoModal.classList.remove('active');
        if (videoIframe) videoIframe.src = '';
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeVideo);
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideo();
        });
    }

    // --- 10. INQUIRY & CONSULTATION POPUP FORM ---
    const inquiryModal = document.getElementById('inquiry-modal');
    const inquiryClose = document.querySelector('.inquiry-close');
    const openInquiryButtons = document.querySelectorAll('.open-inquiry-modal');
    const packageSelector = document.getElementById('package-selector-modal');
    const hiddenPackageInput = document.getElementById('selected-package-hidden');
    const inquiryForm = document.getElementById('project-inquiry-form');
    const formWrap = document.getElementById('inquiry-form-wrap');
    const successState = document.getElementById('inquiry-success-state');
    const successWhatsApp = document.getElementById('success-whatsapp-link');

    openInquiryButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const chosenPackage = btn.getAttribute('data-package');
            if (chosenPackage && packageSelector && hiddenPackageInput) {
                packageSelector.value = chosenPackage;
                hiddenPackageInput.value = chosenPackage;
            }
            if (inquiryModal) {
                inquiryModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeInquiry = () => {
        if (!inquiryModal) return;
        inquiryModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (inquiryClose) inquiryClose.addEventListener('click', closeInquiry);
    if (inquiryModal) {
        inquiryModal.addEventListener('click', (e) => {
            if (e.target === inquiryModal) closeInquiry();
        });
    }

    if (packageSelector && hiddenPackageInput) {
        packageSelector.addEventListener('change', () => {
            hiddenPackageInput.value = packageSelector.value;
        });
    }

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('btn-submit-text');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Submitting Brief...';
            }

            const formData = new FormData(inquiryForm);
            try {
                const response = await fetch(inquiryForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok || response.status === 200) {
                    if (formWrap) formWrap.style.display = 'none';
                    if (successState) successState.classList.add('is-active');
                    const clientName = formData.get('Client Name') || 'Client';
                    const pack = formData.get('Package Selection') || 'Custom Project';
                    if (successWhatsApp) {
                        const msg = encodeURIComponent(`Hello Luka, I submitted a consultation brief on VEYRA AERIAL for ${pack}. Name: ${clientName}`);
                        successWhatsApp.href = `https://wa.me/38267117291?text=${msg}`;
                    }
                } else {
                    inquiryForm.submit();
                }
            } catch (err) {
                inquiryForm.submit();
            }
        });
    }

    // --- 11. ESCAPE KEY ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideo();
            closeInquiry();
        }
    });

    // --- 12. CANVAS DUST PARTICLES ---
    const canvas = document.getElementById('spotlight-dust-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.parentElement.offsetWidth;
        let height = canvas.height = canvas.parentElement.offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        });

        const particles = [];
        const particleCount = 45;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.55 + 0.15,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.3 - 0.15
            });
        }

        const renderDust = () => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(226, 194, 141, ${p.alpha})`;
                ctx.fill();
            }
            requestAnimationFrame(renderDust);
        };
        requestAnimationFrame(renderDust);
    }
});