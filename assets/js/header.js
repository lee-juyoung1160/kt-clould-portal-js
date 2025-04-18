document.addEventListener('DOMContentLoaded', function() {
    // 기본 요소 참조
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const nav = document.querySelector('nav');
    const mainMenuLinks = document.querySelectorAll('.main-menu > li > a');
    
    // 클릭 핸들러를 직접 각 링크에 연결 (직접적인 방식)
    mainMenuLinks.forEach(function(link) {
        // 이미 등록된 이벤트 리스너 제거 (중요!)
        link.removeEventListener('click', handleMobileMenuClick);
        
        // 링크에 클릭 이벤트 등록 - 직접 연결 방식
        link.addEventListener('click', handleMobileMenuClick);
    });
    
    // 모바일 메뉴 클릭 핸들러 - 간소화된 버전
    function handleMobileMenuClick(e) {
        // 현재 모바일 환경인지 확인
        if (window.innerWidth <= 1079) {
            // 서브메뉴가 있는지 확인
            const menuItem = this.parentElement;
            const subMenu = menuItem.querySelector('.sub-menu');
            
            if (subMenu) {
                // 중요: 기본 동작 중지
                e.preventDefault();
                
                // 디버깅 정보
                console.log('메뉴 클릭됨:', this.textContent);
                console.log('서브메뉴 존재:', subMenu !== null);
                console.log('현재 active 상태:', subMenu.classList.contains('active'));
                
                // 다른 열린 서브메뉴 닫기
                document.querySelectorAll('.main-menu > li > .sub-menu.active').forEach(function(menu) {
                    if (menu !== subMenu) {
                        menu.classList.remove('active');
                        
                        // 해당 메뉴의 아이콘도 초기화
                        const parentItem = menu.parentElement;
                        const parentLink = parentItem.querySelector('a');
                        const toggleIcon = parentLink.querySelector('.toggle-open-icon');
                        
                        if (toggleIcon) {
                            toggleIcon.classList.remove('active');
                        }
                    }
                });
                
                // 현재 서브메뉴 토글 - 직접 클래스 관리 방식
                const isActive = subMenu.classList.contains('active');
                if (!isActive) {
                    // 첫 클릭 시 active 클래스 추가
                    subMenu.classList.add('active');
                } else {
                    // 두 번째 클릭 시 active 클래스 제거
                    subMenu.classList.remove('active');
                }
                
                // 토글 아이콘 업데이트
                const toggleIcon = this.querySelector('.toggle-open-icon');
                if (toggleIcon) {
                    if (!isActive) {
                        toggleIcon.classList.add('active');
                    } else {
                        toggleIcon.classList.remove('active');
                    }
                }
                
                // 변경 후 상태 로깅
                console.log('변경 후 active 상태:', subMenu.classList.contains('active'));
            }
        }
    }
    
    // 모바일 링크의 href 속성 관리
    function updateMobileLinkHrefs() {
        if (window.innerWidth <= 1079) {
            // 모바일 모드: 서브메뉴가 있는 링크의 href를 # 으로 변경
            mainMenuLinks.forEach(function(link) {
                const subMenu = link.parentElement.querySelector('.sub-menu');
                if (subMenu) {
                    // 원래 href 저장 (아직 저장되지 않은 경우)
                    if (!link.hasAttribute('data-original-href')) {
                        link.setAttribute('data-original-href', link.getAttribute('href') || '#');
                    }
                    // href 변경
                    link.setAttribute('href', '#');
                }
            });
        } else {
            // PC 모드: 원래 href 복원
            mainMenuLinks.forEach(function(link) {
                if (link.hasAttribute('data-original-href')) {
                    const originalHref = link.getAttribute('data-original-href');
                    link.setAttribute('href', originalHref);
                }
            });
        }
    }
    
    // 초기화 즉시 모바일 링크 href 업데이트
    updateMobileLinkHrefs();
    
    // 햄버거 메뉴 클릭
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // 닫기 버튼 클릭
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // 오버레이 클릭
    if (overlay) {
        overlay.addEventListener('click', function() {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // 화면 크기 변경 시 대응
    window.addEventListener('resize', function() {
        // 모바일/PC 모드에 따라 링크 href 업데이트
        updateMobileLinkHrefs();
        
        // PC 모드로 전환 시 모바일 메뉴 닫기
        if (window.innerWidth > 1079) {
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // 모든 서브메뉴 닫기
            document.querySelectorAll('.sub-menu.active').forEach(function(menu) {
                menu.classList.remove('active');
            });
            
            // 모든 토글 아이콘 초기화
            document.querySelectorAll('.toggle-open-icon.active').forEach(function(icon) {
                icon.classList.remove('active');
            });
        }
    });
});