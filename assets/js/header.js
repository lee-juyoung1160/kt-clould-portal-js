document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const nav = document.querySelector('nav');
    const mainMenuItems = document.querySelectorAll('.main-menu > li > a');
    
    // 햄버거 메뉴 토글

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
    
    // 오버레이 클릭 시 메뉴 닫기
    if (overlay) {
    overlay.addEventListener('click', function() {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    }
    
    // 모바일에서 메인 메뉴 클릭 시 서브메뉴 토글
mainMenuItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
        if (window.innerWidth <= 1079) {
            // 이벤트 버블링 중지
            e.stopPropagation();
            e.preventDefault();
            
            const subMenu = this.nextElementSibling;
            if (!subMenu || !subMenu.classList.contains('sub-menu')) {
                return; // 서브메뉴가 없으면 동작하지 않음
            }
            
            const toggleIcon = this.querySelector('.toggle-open-icon');
            
            // 현재 활성화된 다른 서브메뉴 닫기
            const activeSubMenus = document.querySelectorAll('.sub-menu.active');
            const activeIcons = document.querySelectorAll('.toggle-open-icon.active');
            
            activeSubMenus.forEach(function(menu) {
                if (menu !== subMenu) {
                    menu.classList.remove('active');
                }
            });
            
            activeIcons.forEach(function(icon) {
                if (icon !== toggleIcon) {
                    icon.classList.remove('active');
                }
            });
            
            // 현재 서브메뉴 토글
            subMenu.classList.toggle('active');
            if (toggleIcon) {
                toggleIcon.classList.toggle('active');
            }
        }
    });
});  
    
    // 화면 크기 변경 시 모바일 메뉴 상태 초기화
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1079) {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // 서브메뉴 초기화
            const activeSubMenus = document.querySelectorAll('.sub-menu.active');
            activeSubMenus.forEach(function(menu) {
                menu.classList.remove('active');
            });
        }
    });
});