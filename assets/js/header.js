document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const nav = document.querySelector('nav');
    
    // 모바일 환경에서 서브메뉴가 있는 메인 메뉴의 href 변경
    function updateMenuLinks() {
        document.querySelectorAll('.main-menu > li > a').forEach(function(link) {
            const subMenu = link.nextElementSibling;
            // 서브메뉴가 있고 모바일 환경인 경우
            if (subMenu && subMenu.classList.contains('sub-menu') && window.innerWidth <= 1079) {
                // 원래 링크를 저장
                if (!link.getAttribute('data-original-href')) {
                    link.setAttribute('data-original-href', link.getAttribute('href'));
                }
                // href 변경
                link.setAttribute('href', 'javascript:void(0)');
            } else if (link.getAttribute('data-original-href') && window.innerWidth > 1079) {
                // PC 환경일 때 원래 링크 복원
                link.setAttribute('href', link.getAttribute('data-original-href'));
            }
        });
    }
    
    // 초기 실행
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
    
    // 모바일에서 li > a 클릭 시 서브메뉴 토글
    document.querySelectorAll('.main-menu > li > a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 1079) {
                const subMenu = this.nextElementSibling;
                
                // 서브메뉴가 있는 경우에만 처리
                if (subMenu && subMenu.classList.contains('sub-menu')) {
                    e.preventDefault(); // 링크 이동 방지
                    
                    // 현재 토글 아이콘
                    const toggleIcon = this.querySelector('.toggle-open-icon');
                    
                    // 다른 모든 서브메뉴 닫기
                    document.querySelectorAll('.sub-menu.active').forEach(function(menu) {
                        if (menu !== subMenu) {
                            menu.classList.remove('active');
                            // 관련 아이콘도 비활성화
                            const parentA = menu.previousElementSibling;
                            if (parentA) {
                                const icon = parentA.querySelector('.toggle-open-icon');
                                if (icon) icon.classList.remove('active');
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
        updateMenuLinks(); // 링크 업데이트
        
        if (window.innerWidth > 1079) {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // 서브메뉴 초기화
            document.querySelectorAll('.sub-menu.active').forEach(function(menu) {
                menu.classList.remove('active');
            });
            
            // 아이콘 초기화
            document.querySelectorAll('.toggle-open-icon.active').forEach(function(icon) {
                icon.classList.remove('active');
            });
        }
    });
});