document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.site-header');
    const heroTextContainer = document.querySelector('.hero-text-container');
    const recruitLabel = document.querySelector('.recruit-label');
    const cards = document.querySelectorAll('.floating-card');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    
    let lastScrollY = 0;
    let ticking = false;

    // 移动端菜单切换
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // 点击覆盖层关闭菜单
    mobileNavOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            mobileMenuToggle.classList.remove('active');
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // 点击菜单链接后关闭菜单
    mobileNavOverlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

function updateOnScroll() {
    const scrollY = window.scrollY;

    // --- 在这里微调消失的时机和过程 ---
    const startFade = 400;
    const fadeDuration = 1200;


    // --- 下面的代码会自动根据上面的两个变量进行计算，无需修改 ---
    // 1. 计算当前滚动位置在“消失区段”内的进度
    const scrollInFadeZone = Math.max(0, scrollY - startFade);
    
    // 2. 根据进度计算透明度（0.0 ~ 1.0）
    const progress = Math.min(1, scrollInFadeZone / fadeDuration);
    const opacity = 1 - progress;

    // 设置整个 header 元素的透明度
    header.style.opacity = opacity;

    // 当 header 完全透明时，让它可以被“点击穿透”
    if (opacity <= 0) {
        header.style.pointerEvents = 'none';
    } else {
        header.style.pointerEvents = 'auto';
    }
    

    // --- 保留页面其他部分的滚动动画 ---
    const isMobile = window.innerWidth <= 768;
    
    if(heroTextContainer && scrollY < window.innerHeight && !isMobile) {
        const heroProgress = scrollY / (window.innerHeight * 0.5);
        const heroOpacity = Math.max(0, 1 - heroProgress);
        const heroTranslateY = scrollY * 0.3;
        heroTextContainer.style.opacity = heroOpacity;
        heroTextContainer.style.transform = `translateY(${heroTranslateY}px)`;
    }

    if(recruitLabel && scrollY < window.innerHeight && !isMobile) {
        const labelProgress = scrollY / (window.innerHeight * 0.5);
        const labelOpacity = Math.max(0, 1 - labelProgress);
        const labelTranslateY = scrollY * 0.25;
        recruitLabel.style.opacity = labelOpacity;
        recruitLabel.style.transform = `translateY(${labelTranslateY}px)`;
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, 100);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });

    // 窗口大小变化时重新检查
    window.addEventListener('resize', function() {
        if (window.innerWidth > 900) {
            mobileMenuToggle.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    updateOnScroll();
});