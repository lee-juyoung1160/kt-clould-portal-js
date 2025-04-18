document.addEventListener('DOMContentLoaded', function() {
    // 오버레이 요소가 없으면 생성
    if (!document.querySelector('.overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const nav = document.querySelector('nav');
    
    // 햄버거 메뉴
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // 닫기 버튼
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // 오버레이
    if (overlay) {
        overlay.addEventListener('click', function() {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // 서브메뉴 토글 - 단순화된 방식
    document.querySelectorAll('.main-menu > li > a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 1079) {
                const subMenu = this.nextElementSibling;
                
                if (subMenu && subMenu.classList.contains('sub-menu')) {
                    e.preventDefault();
                    console.log('서브메뉴 토글 시도:', this.textContent);
                    
                    // 모든 서브메뉴 닫기
                    document.querySelectorAll('.sub-menu').forEach(function(menu) {
                        menu.classList.remove('active');
                    });
                    
                    // 현재 서브메뉴만 토글
                    subMenu.classList.add('active');
                }
            }
        });
    });
});