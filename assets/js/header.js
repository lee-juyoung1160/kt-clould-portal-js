document.addEventListener('DOMContentLoaded', function () {
    // 요소 선택
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const nav = document.querySelector('nav');
    const mainMenuItems = document.querySelectorAll('.main-menu > li > a');
    
    // 모바일 메뉴 닫기 함수
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
    
    // 햄버거 메뉴 클릭 이벤트
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            console.log('메뉴 토글 클릭됨'); // 디버깅용
            nav.classList.add('active');
            overlay.classList.add('active');
            //document.body.style.overflow = 'hidden';
        });
    }
    
    // 닫기 버튼 클릭 이벤트
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            moNavClose();
        });
    }
    
    // 오버레이 클릭 시 메뉴 닫기
    if (overlay) {
        overlay.addEventListener('click', function () {
            moNavClose();
        });
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
    
    // 화면 크기 변경 시 모바일 메뉴 상태 초기화
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1079) {
            moNavClose();
        }
    });
    
   // 스크롤 핸들러 함수
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');
        const article = document.querySelector('article');
        
        if (header && article) {
            // 헤더 높이 가져오기
            const headerHeight = header.offsetHeight;
            
            // 테블릿 모드에서는 항상 fixed 클래스 유지
            if (window.innerWidth <= 1079) {
                // 태블릿/모바일에서는 스크롤 위치와 상관없이 항상 fixed 클래스 유지
                header.classList.add('fixed');
                article.style.marginTop = headerHeight + 'px';
               // nav.style.position = 'fixed';
            } else {
                // PC 모드에서만 스크롤 위치에 따라 fixed 클래스 추가/제거
                if (scrollTop > 0) {
                    header.classList.add('fixed');
                    article.style.marginTop = headerHeight + 'px';
                } else {
                    header.classList.remove('fixed');
                    article.style.marginTop = '0px';
                }
            }
        }
    }
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', handleScroll);
    
    // 화면 크기 변경 시에도 margin 조정
    window.addEventListener('resize', handleScroll);
    
    // 초기 실행
    handleScroll();
});




