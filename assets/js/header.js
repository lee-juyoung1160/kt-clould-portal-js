document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const nav = document.querySelector('nav');
    
    // 모바일 메뉴의 모든 링크 초기화 (직접 클릭 이벤트 추가)
    function setupMobileMenu() {
        // 모바일 환경인지 확인
        const isMobile = window.innerWidth <= 1079;
        
        // 모든 메인 메뉴 항목 가져오기
        const menuItems = document.querySelectorAll('.main-menu > li');
        
        // 모든 이벤트 리스너 제거 및 재설정
        menuItems.forEach(function(item) {
            const link = item.querySelector('a');
            const subMenu = item.querySelector('.sub-menu');
            const toggleIcon = link?.querySelector('.toggle-open-icon');
            
            // 이미 있는 이벤트 리스너 제거 (중요!)
            if (link) {
                const clone = link.cloneNode(true);
                link.parentNode.replaceChild(clone, link);
                
                // 새 참조 업데이트
                const newLink = item.querySelector('a');
                
                // 서브메뉴가 있는 경우에만 처리
                if (subMenu) {
                    if (isMobile) {
                        // 모바일: 클릭 시 서브메뉴 토글
                        newLink.addEventListener('click', function(e) {
                            e.preventDefault(); // 기본 동작 중지
                            
                            // 다른 열린 서브메뉴 닫기
                            document.querySelectorAll('.sub-menu.active').forEach(function(menu) {
                                if (menu !== subMenu) {
                                    menu.classList.remove('active');
                                    const otherIcon = menu.parentElement.querySelector('.toggle-open-icon');
                                    if (otherIcon) otherIcon.classList.remove('active');
                                }
                            });
                            
                            // 현재 서브메뉴 토글
                            subMenu.classList.toggle('active');
                            
                            // 아이콘 토글 (있는 경우)
                            const newToggleIcon = this.querySelector('.toggle-open-icon');
                            if (newToggleIcon) {
                                newToggleIcon.classList.toggle('active');
                            }
                        });
                        
                        // href 속성 임시 변경
                        if (newLink.getAttribute('href') !== 'javascript:void(0)') {
                            newLink.setAttribute('data-original-href', newLink.getAttribute('href'));
                            newLink.setAttribute('href', 'javascript:void(0)');
                        }
                    } else {
                        // PC 모드: 원래 링크 복원
                        const originalHref = newLink.getAttribute('data-original-href');
                        if (originalHref) {
                            newLink.setAttribute('href', originalHref);
                        }
                    }
                }
            }
        });
    }
    
    // 초기 설정 실행
    setupMobileMenu();
    
    // 햄버거 메뉴 클릭 처리
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // 닫기 버튼 처리
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // 오버레이 클릭 처리
    if (overlay) {
        overlay.addEventListener('click', function() {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // 화면 크기 변경 시 메뉴 재설정
    window.addEventListener('resize', function() {
        setupMobileMenu();
        
        // PC 모드로 전환 시 모바일 메뉴 닫기
        if (window.innerWidth > 1079) {
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // 모든 서브메뉴 닫기
            document.querySelectorAll('.sub-menu.active').forEach(function(menu) {
                menu.classList.remove('active');
            });
        }
    });
});