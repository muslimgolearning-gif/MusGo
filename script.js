/**
 * @fileoverview Script Utama Aplikasi MusGo
 * @description Mengatur interaksi UI/UX termasuk navigasi mobile, smooth scrolling, 
 * animasi on-scroll, dan fallback pengamanan gambar.
 * @author Kelompok 4 – Ali Bin Abi Thalib
 * @version 1.0.0
 */

document.addEventListener("DOMContentLoaded", () => {
    'use strict'; // Mengaktifkan mode ketat untuk keamanan dan performa JavaScript

    // ==========================================
    // KONFIGURASI APLIKASI
    // ==========================================
    const APP_CONFIG = {
        animationThreshold: 0.15, // Elemen terlihat 15% sebelum animasi berjalan
        fallbackImage: 'https://via.placeholder.com/600x400/f1f5f9/64748b?text=Gambar+Gagal+Dimuat'
    };

    // ==========================================
    // 1. PENGATURAN HAMBURGER MENU (MOBILE)
    // ==========================================
    /**
     * Mengelola status buka/tutup navigasi mobile dan aksesibilitas (A11y)
     */
    const initNavigation = () => {
        const hamburger = document.querySelector(".hamburger");
        const navLinks = document.querySelector(".nav-links");
        const links = document.querySelectorAll(".nav-links a");

        // Guard clause: Cegah error jika elemen tidak ada di halaman
        if (!hamburger || !navLinks) return; 

        const toggleMenu = () => {
            const isActive = navLinks.classList.toggle("active");
            hamburger.setAttribute("aria-expanded", isActive);
        };

        const closeMenu = () => {
            navLinks.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        };

        // Event Listeners
        hamburger.addEventListener("click", toggleMenu);
        links.forEach(link => link.addEventListener("click", closeMenu));
    };

    // ==========================================
    // 2. SMOOTH SCROLLING (NAVIGASI HALUS)
    // ==========================================
    /**
     * Menerapkan efek gulir halus saat menu navigasi diklik
     */
    const initSmoothScroll = () => {
        // Hanya pilih anchor link yang valid (bukan sekadar href="#")
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault(); 
                    
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Memperbarui URL tanpa memicu reload halaman
                    window.history.pushState(null, null, targetId);
                }
            });
        });
    };

    // ==========================================
    // 3. ANIMASI SAAT DI-SCROLL (INTERSECTION OBSERVER)
    // ==========================================
    /**
     * Memunculkan elemen secara dinamis saat masuk ke dalam viewport layar
     */
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        if (animatedElements.length === 0) return;

        // Pengecekan dukungan fitur modern browser
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: APP_CONFIG.animationThreshold
            };

            const observerCallback = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        // Unobserve untuk menghemat memori setelah animasi selesai
                        observer.unobserve(entry.target);
                    }
                });
            };

            const observer = new IntersectionObserver(observerCallback, observerOptions);
            animatedElements.forEach(el => observer.observe(el));
            
        } else {
            // Fallback elegan untuk browser usang (langsung tampilkan tanpa animasi)
            animatedElements.forEach(el => el.classList.add('show'));
        }
    };

    // ==========================================
    // 4. PENANGANAN GAMBAR GAGAL DIMUAT
    // ==========================================
    /**
     * Mengganti gambar yang rusak (broken link) dengan placeholder secara otomatis
     */
    const initImageFallback = () => {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            img.addEventListener('error', function fallbackHandler() {
                // Mencegah infinite loop jika gambar fallback juga gagal dimuat
                if (this.src !== APP_CONFIG.fallbackImage) {
                    this.src = APP_CONFIG.fallbackImage;
                    this.alt = 'Gambar tidak tersedia saat ini';
                    this.removeEventListener('error', fallbackHandler);
                }
            });
        });
    };

    // ==========================================
    // INISIALISASI UTAMA
    // ==========================================
    const runApp = () => {
        initNavigation();
        initSmoothScroll();
        initScrollAnimations();
        initImageFallback();
    };

    // Jalankan aplikasi
    runApp();
});