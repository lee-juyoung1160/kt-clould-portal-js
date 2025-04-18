document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const nav = document.querySelector('nav');
    const mainMenuItems = document.querySelectorAll('.main-menu > li > a');
    
    // 모바일 환경에서 서브메뉴가 있는 메인 메뉴의 href 처리
    function updateMenuLinks() {
        if (window.innerWidth <= 1079) {
            // 서브메뉴가 있는 메인 메뉴 아이템 찾기
            document.querySelectorAll('.main-menu > li').forEach(function(item) {
                const menuLink = item.querySelector('a');
                const subMenu = item.querySelector('.sub-menu');
                
                // 서브메뉴가 있는 경우에만 href 수정
                if (menuLink && subMenu) {
                    // 원래 링크를 데이터 속성에 저장 (나중에 복원할 수 있도록)
                    if (!menuLink.getAttribute('data-original-href')) {
                        menuLink.setAttribute('data-original-href', menuLink.getAttribute('href'));
                    }
                    menuLink.setAttribute('href', 'javascript:void(0)');
                }
            });
        } else {
            // PC 환경에서는 원래 링크 복원
            document.querySelectorAll('.main-menu > li > a[data-original-href]').forEach(function(menuLink) {
                menuLink.setAttribute('href', menuLink.getAttribute('data-original-href'));
            });
        }
    }
    
    // 초기 로드 시 실행
    updateMenuLinks();
    
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
                const parent = this.parentElement;
                const subMenu = parent.querySelector('.sub-menu');
                
                // 서브메뉴가 있는 경우에만 처리
                if (subMenu) {
                    e.preventDefault(); // 링크 이동 방지
                    
                    const toggleIcon = this.querySelector('.toggle-open-icon');
                    
                    // 다른 모든 서브메뉴 닫기
                    document.querySelectorAll('.main-menu > li > .sub-menu').forEach(function(menu) {
                        if (menu !== subMenu) {
                            menu.classList.remove('active');
                            const menuParent = menu.parentElement;
                            const menuToggleIcon = menuParent.querySelector('.toggle-open-icon');
                            if (menuToggleIcon) {
                                menuToggleIcon.classList.remove('active');
                            }
                        }
                    });
                    
                    // 현재 서브메뉴 토글
                    subMenu.classList.toggle('active');
                    
                    if (toggleIcon) {
                        toggleIcon.classList.toggle('active');
                    }
                }
            }
        });
    });     
    
    // 화면 크기 변경 시 모바일 메뉴 상태 초기화
    window.addEventListener('resize', function() {
        updateMenuLinks(); // 화면 크기 변경 시 링크 업데이트
        
        if (window.innerWidth > 1079) {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // 서브메뉴 초기화
            const activeSubMenus = document.querySelectorAll('.sub-menu.active');
            activeSubMenus.forEach(function(menu) {
                menu.classList.remove('active');
            });
            
            // 아이콘 초기화
            const activeIcons = document.querySelectorAll('.toggle-open-icon.active');
            activeIcons.forEach(function(icon) {
                icon.classList.remove('active');
            });
        }
    });
});