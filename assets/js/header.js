document.addEventListener('DOMContentLoaded', function() {
    // 기본 요소 참조
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const nav = document.querySelector('nav');
    const mainMenu = document.querySelector('.main-menu');
    
    // 디버깅 함수 - 이벤트 관련 문제 진단에 도움
    function debug(message) {
        console.log('[메뉴 디버그]', message);
    }
    
    // 모바일 환경인지 확인
    function isMobile() {
        return window.innerWidth <= 1079;
    }
    
    // 모바일 메뉴에서 모든 서브메뉴 항목 초기화
    function setupMobileMenuHandlers() {
        debug('모바일 메뉴 핸들러 설정 시작');
        
        // 메인 메뉴의 모든 1차 링크에 대해
        const menuItems = document.querySelectorAll('.main-menu > li');
        
        // 모든 메뉴 항목에서 이벤트를 제거하고 다시 설정
        menuItems.forEach(function(item) {
            const link = item.querySelector('a');
            const subMenu = item.querySelector('.sub-menu');
            
            if (link && subMenu) {
                // 기존 이벤트 제거 방식 개선 - 이벤트 리스너를 완전히 새로 복제
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                // 이제 모바일 환경에서는 href 속성을 변경
                if (isMobile()) {
                    // 원래 href 저장
                    const originalHref = newLink.getAttribute('href');
                    newLink.setAttribute('data-original-href', originalHref);
                    newLink.setAttribute('href', '#');
                    
                    // 새로운 클릭 이벤트 추가
                    newLink.addEventListener('click', function(e) {
                        debug(`메뉴 클릭: ${this.textContent}`);
                        
                        // 링크 기본 동작 방지 (중요!)
                        e.preventDefault();
                        
                        // 다른 모든 메뉴 닫기
                        document.querySelectorAll('.sub-menu.active').forEach(function(menu) {
                            if (menu !== subMenu) {
                                menu.classList.remove('active');
                                const otherIcon = menu.parentElement.querySelector('.toggle-open-icon');
                                if (otherIcon) otherIcon.classList.remove('active');
                            }
                        });
                        
                        // 이 서브메뉴를 토글 (직접 상태 관리)
                        if (subMenu.classList.contains('active')) {
                            debug('서브메뉴 닫힘');
                            subMenu.classList.remove('active');
                            
                            // 토글 아이콘도 상태 변경
                            const toggleIcon = this.querySelector('.toggle-open-icon');
                            if (toggleIcon) toggleIcon.classList.remove('active');
                        } else {
                            debug('서브메뉴 열림');
                            subMenu.classList.add('active');
                            
                            // 토글 아이콘도 상태 변경
                            const toggleIcon = this.querySelector('.toggle-open-icon');
                            if (toggleIcon) toggleIcon.classList.add('active');
                        }
                    });
                }
            }
        });
        
        debug('모바일 메뉴 핸들러 설정 완료');
    }
    
    // 햄버거 메뉴 클릭 처리
    function setupHamburgerMenu() {
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                debug('햄버거 메뉴 클릭');
                nav.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // 메뉴가 열리고 나서 곧바로 모바일 메뉴 핸들러 설정
                // 약간의 지연을 두어 DOM이 업데이트될 시간을 줌
                setTimeout(function() {
                    setupMobileMenuHandlers();
                    debug('햄버거 메뉴 열림 후 핸들러 재설정 완료');
                }, 50);
            });
        }
    }
    
    // 메뉴 닫기 처리
    function setupCloseMenu() {
        // 닫기 버튼
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                debug('닫기 버튼 클릭');
                closeMenu();
            });
        }
        
        // 오버레이
        if (overlay) {
            overlay.addEventListener('click', function() {
                debug('오버레이 클릭');
                closeMenu();
            });
        }
    }
    
    // 메뉴 닫기 공통 함수
    function closeMenu() {
        nav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 화면 크기 변경 처리
    function setupResizeHandler() {
        window.addEventListener('resize', function() {
            debug('화면 크기 변경 감지');
            
            // 모바일 메뉴 핸들러 재설정
            setupMobileMenuHandlers();
            
            // PC 모드로 전환 시 모바일 메뉴 닫기
            if (!isMobile()) {
                closeMenu();
                
                // PC 모드에서는 모든 서브메뉴 닫기
                document.querySelectorAll('.sub-menu.active').forEach(function(menu) {
                    menu.classList.remove('active');
                });
                
                // 모든 토글 아이콘 초기화
                document.querySelectorAll('.toggle-open-icon.active').forEach(function(icon) {
                    icon.classList.remove('active');
                });
            }
        });
    }
    
    // 초기화 함수
    function init() {
        debug('메뉴 초기화 시작');
        
        // 모바일 메뉴 핸들러 설정
        setupMobileMenuHandlers();
        
        // 햄버거 메뉴 설정
        setupHamburgerMenu();
        
        // 메뉴 닫기 설정
        setupCloseMenu();
        
        // 화면 크기 변경 처리
        setupResizeHandler();
        
        // CSS transition 임시 제거 (클래스 추가/제거 문제 확인용)
        if (isMobile()) {
            // 원래 CSS를 훼손하지 않고 모바일 서브메뉴의 transition만 제거
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 1079px) {
                    .sub-menu {
                        transition: none !important;
                    }
                    .sub-menu.active {
                        transition: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        debug('메뉴 초기화 완료');
    }
    
    // 페이지 로드 시 초기화 실행
    init();
});