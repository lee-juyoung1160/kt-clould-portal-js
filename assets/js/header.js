document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const nav = document.querySelector('nav');
    
    // 해결책: 페이지 로드 즉시 모든 메뉴 항목을 초기화
    function initializeMenuItems() {
        const menuItems = document.querySelectorAll('.main-menu > li');
        
        menuItems.forEach(function(item) {
            const link = item.querySelector('a');
            const subMenu = item.querySelector('.sub-menu');
            
            if (link && subMenu) {
                // 기존 이벤트 리스너 제거 (중복 방지)
                link.removeEventListener('click', handleMenuClick);
                
                // 새 이벤트 리스너 추가
                link.addEventListener('click', handleMenuClick);
                
                // 모바일 모드에서는 링크 동작을 방지 (바로 실행되도록 수정)
                if (window.innerWidth <= 1079) {
                    // 원래 href를 저장
                    if (!link.hasAttribute('data-original-href')) {
                        link.setAttribute('data-original-href', link.getAttribute('href') || '#');
                    }
                    // href 속성 변경
                    link.setAttribute('href', 'javascript:void(0)');
                }
            }
        });
    }
    
    // 메뉴 클릭 핸들러 - 별도의 함수로 분리
    function handleMenuClick(e) {
        // 모바일 모드에서만 특별 처리
        if (window.innerWidth <= 1079) {
            const link = this;
            const menuItem = link.parentElement;
            const subMenu = menuItem.querySelector('.sub-menu');
            
            if (subMenu) {
                // 기본 동작 방지 (중요!)
                e.preventDefault();
                e.stopPropagation();
                
                // 모든 서브메뉴 닫기
                document.querySelectorAll('.main-menu > li > .sub-menu').forEach(function(menu) {
                    if (menu !== subMenu) {
                        menu.classList.remove('active');
                        
                        const parentItem = menu.parentElement;
                        const parentLink = parentItem.querySelector('a');
                        const toggleIcon = parentLink.querySelector('.toggle-open-icon');
                        
                        if (toggleIcon) {
                            toggleIcon.classList.remove('active');
                        }
                    }
                });
                
                // 현재 서브메뉴 토글
                subMenu.classList.toggle('active');
                
                // 토글 아이콘 업데이트
                const toggleIcon = link.querySelector('.toggle-open-icon');
                if (toggleIcon) {
                    toggleIcon.classList.toggle('active');
                }
            }
        }
    }
    
    // 초기화 즉시 실행
    initializeMenuItems();
    
    // 햄버거 메뉴
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // 중요: 모바일 메뉴가 열릴 때 메뉴 항목 다시 초기화
            setTimeout(initializeMenuItems, 100);
        });
    }
    
    // 닫기 버튼
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
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
    
    // 화면 크기 변경 시 메뉴 초기화
    window.addEventListener('resize', function() {
        // 메뉴 항목 다시 초기화
        initializeMenuItems();
        
        if (window.innerWidth > 1079) {
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // PC 모드로 전환 시 원래 링크 복원
            document.querySelectorAll('.main-menu > li > a[data-original-href]').forEach(function(link) {
                link.setAttribute('href', link.getAttribute('data-original-href'));
            });
            
            // 모든 서브메뉴 닫기
            document.querySelectorAll('.sub-menu.active').forEach(function(menu) {
                menu.classList.remove('active');
            });
        } else {
            // 모바일 모드로 전환 시 모든 링크의 href를 변경
            document.querySelectorAll('.main-menu > li > a').forEach(function(link) {
                const subMenu = link.parentElement.querySelector('.sub-menu');
                if (subMenu) {
                    if (!link.hasAttribute('data-original-href')) {
                        link.setAttribute('data-original-href', link.getAttribute('href') || '#');
                    }
                    link.setAttribute('href', 'javascript:void(0)');
                }
            });
        }
    });

    // 페이지 로드 시 추가 초기화 - 모바일 상태 확인 및 적용
    if (window.innerWidth <= 1079) {
        document.querySelectorAll('.main-menu > li > a').forEach(function(link) {
            const subMenu = link.parentElement.querySelector('.sub-menu');
            if (subMenu) {
                if (!link.hasAttribute('data-original-href')) {
                    link.setAttribute('data-original-href', link.getAttribute('href') || '#');
                }
                link.setAttribute('href', 'javascript:void(0)');
            }
        });
    }
});