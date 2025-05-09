
// 페이지 로딩 시작 시간 저장
const startTime = performance.now();
// 페이지 로딩 시작 시 스피너 표시
document.addEventListener('DOMContentLoaded', function () {
    // 스피너 초기화 (필요한 경우)
    if (typeof LoadingSpinner.init === 'function' && !LoadingSpinner.initialized) {
        LoadingSpinner.init();
    }
    // 스피너 표시
    LoadingSpinner.show();
});
// 페이지 로드 완료 시 스피너 숨기기 및 로드 시간 계산
window.addEventListener('load', function () {
    // 로드 완료 시간 
    const endTime = performance.now();
    // 로드 시간 계산 (밀리초)
    const loadTime = endTime - startTime;
    // 로드 시간을 초 단위로 변환 (소수점 둘째 자리까지)
    const loadTimeSeconds = (loadTime / 1000).toFixed(2);
    // 로드 시간 콘솔에 출력
    console.log(`페이지 로드 시간: ${loadTimeSeconds}초 (${loadTime.toFixed(0)}ms)`);
    // 로드 시간을 스피너에 표시
    //LoadingSpinner.updateText(`페이지 로드 완료! (${loadTimeSeconds}초)`);
    // 잠시 후 스피너 숨기기 (로드 시간을 잠깐 표시)
    setTimeout(function () {
        LoadingSpinner.hide();
    }, 100);
});



const menuToggle = document.querySelector('.menu-toggle');
const closeBtn = document.querySelector('.close-btn');
const overlay = document.querySelector('.overlay');
const nav = document.querySelector('nav');
const mainMenuItems = document.querySelectorAll('.main-menu > li > a');
document.addEventListener('DOMContentLoaded', function () {

    // 햄버거 메뉴 토글

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            nav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // 닫기 버튼
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
                    toggleIcon.classList.toggle('active');
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
});

// 모바일 닫기 버튼
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

// 스크롤 핸들러 함수
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('header');
    const article = document.querySelector('article');

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
        // article의 margin-top을 header의 높이로 설정
        article.style.marginTop = 0 + 'px';
    }


}

// 스크롤 이벤트 리스너
window.addEventListener('scroll', handleScroll);

// 화면 크기 변경 시에도 margin 조정
window.addEventListener('resize', handleScroll);

// 페이지 로드 시 초기 실행
document.addEventListener('DOMContentLoaded', function () {
    handleScroll();
});