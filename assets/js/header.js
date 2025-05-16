document.addEventListener('DOMContentLoaded', function () {
    // DOM이 로드된 후 요소 선택
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const nav = document.querySelector('nav');
    const mainMenuItems = document.querySelectorAll('.main-menu > li > a');
    
    // 모바일 닫기 버튼 함수
    function moNavClose() {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        const activeSubMenus = document.querySelectorAll('.sub-menu.active');
        activeSubMenus.forEach(function (menu) {
            menu.classList.remove('active');
        });
        const activeIcons = document.querySelectorAll('.toggle-open-icon.active');
        activeIcons.forEach(function (icon) {
            icon.classList.remove('active');
        });
    }
    
    // 모바일 메뉴 이벤트 핸들러 설정 함수
    function setupMobileMenu() {
        if (window.innerWidth <= 1079) {
            // 햄버거 메뉴 토글
            if (menuToggle) {
                // 이벤트 리스너가 중복 등록되지 않도록 먼저 제거
                menuToggle.removeEventListener('click', menuToggleHandler);
                // 새로 등록
                menuToggle.addEventListener('click', menuToggleHandler);
            }
            
            // 닫기 버튼
            if (closeBtn) {
                closeBtn.removeEventListener('click', moNavClose);
                closeBtn.addEventListener('click', moNavClose);
            }
            
            // 오버레이 클릭 시 메뉴 닫기
            if (overlay) {
                overlay.removeEventListener('click', moNavClose);
                overlay.addEventListener('click', moNavClose);
            }
        } else {
            // 데스크톱 모드에서는 이벤트 리스너 제거
            if (menuToggle) menuToggle.removeEventListener('click', menuToggleHandler);
            if (closeBtn) closeBtn.removeEventListener('click', moNavClose);
            if (overlay) overlay.removeEventListener('click', moNavClose);
        }
    }
    
    // 햄버거 메뉴 토글 핸들러
    function menuToggleHandler() {
        console.log('메뉴 토글 클릭됨'); // 디버깅용
        nav.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 모바일에서 메인 메뉴 클릭 시 서브메뉴 토글
    mainMenuItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
            if (window.innerWidth <= 1079) {
                const subMenu = this.nextElementSibling;
                
                // 서브메뉴가 있는 경우에만 기본 동작 막기
                if (subMenu && subMenu.classList.contains('sub-menu')) {
                    e.preventDefault();
                    const toggleIcon = this.querySelector('.toggle-open-icon');
                    
                    // 현재 활성화된 다른 서브메뉴 닫기
                    const activeSubMenus = document.querySelectorAll('.sub-menu.active');
                    const activeIcons = document.querySelectorAll('.toggle-open-icon.active');
                    
                    activeSubMenus.forEach(function (menu) {
                        if (menu !== subMenu) {
                            menu.classList.remove('active');
                        }
                    });
                    
                    activeIcons.forEach(function (icon) {
                        if (icon !== toggleIcon) {
                            icon.classList.remove('active');
                        }
                    });
                    
                    // 현재 서브메뉴 토글
                    subMenu.classList.toggle('active');
                    if (toggleIcon) toggleIcon.classList.toggle('active');
                }
                // 서브메뉴가 없는 경우 기본 동작 유지 (href 이동)
            }
        });
    });
    
    // 스크롤 핸들러 함수
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');
        const article = document.querySelector('article');
        
        if (header && article) {
            // 헤더 높이 가져오기
            const headerHeight = header.offsetHeight;
            
            // 스크롤이 1이라도 있으면 .fixed 클래스 추가
            if (scrollTop > 0) {
                header.classList.add('fixed');
                // article의 margin-top을 header의 높이로 설정
                article.style.marginTop = headerHeight + 'px';
            } else {
                // 스크롤이 0이면 .fixed 클래스 제거
                header.classList.remove('fixed');
                // article의 margin-top을 0으로 설정
                article.style.marginTop = '0px';
            }
        }
    }
    
    // 화면 크기 변경 시 모바일 메뉴 상태 초기화 및 margin 조정
    window.addEventListener('resize', function() {
        setupMobileMenu();
        handleScroll();
    });
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', handleScroll);
    
    // 초기 설정 실행
    setupMobileMenu();
    handleScroll();
});