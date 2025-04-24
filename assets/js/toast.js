// 토스트 메시지 정의
const toastMessages = {
    toastUnlockSuccess: {
        text: '잠금 해제가 완료되었습니다.',
        icon: '../assets/images/ic_check_fill.svg',
        redirect: './login/lonin.html' // 이동할 경로 지정
    },
};
// 토스트 관리 객체
const ToastManager = (function() {
    let toastOverlay;
    let toastContainer;
    let isToastShown = false;

    // 초기화 함수
    function init() {
        // 오버레이 생성
        toastOverlay = document.createElement('div');
        toastOverlay.id = 'toast-overlay';
        document.body.appendChild(toastOverlay);

        // 토스트 컨테이너 생성
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // 토스트 표시 함수
    function showToast(messageKey) {
        // 이미 토스트가 표시되었다면 더 이상 진행하지 않음
        if (isToastShown) return;

        // 오버레이 표시
        toastOverlay.style.display = 'block';

        // 토스트 요소 생성
        const toast = document.createElement('div');
        toast.classList.add('toast');
        
        // 메시지 키에 해당하는 메시지 설정 (존재하지 않으면 기본 에러 메시지)
        const messageObj = toastMessages[messageKey] || toastMessages.error;
        
        // 아이콘 추가 (이미지)
        if (messageObj.icon) {
            const icon = document.createElement('img');
            icon.src = messageObj.icon;
            icon.classList.add('toast-icon');
            icon.onerror = function() {
                console.error('이미지 로딩 실패:', this.src);
                this.style.display = 'none';
            };
            toast.appendChild(icon);
        }

        // 텍스트 추가
        const textSpan = document.createElement('span');
        textSpan.textContent = messageObj.text;
        toast.appendChild(textSpan);

        // 컨테이너에 토스트 추가
        toastContainer.appendChild(toast);

        // 토스트 표시
        setTimeout(() => {
            toast.classList.add('show');
            isToastShown = true;
        }, 10);

        // 3초 후 토스트 제거 및 리다이렉트
        setTimeout(() => {
            toast.classList.remove('show');
            
            // 페이드 아웃 애니메이션 후 제거
            setTimeout(() => {
                toastContainer.removeChild(toast);
                toastOverlay.style.display = 'none';
                isToastShown = false;

                // 리다이렉트 여부 확인
                if (messageObj.redirect) {
                    // 1초 후 지정된 페이지로 이동
                    setTimeout(() => {
                        window.location.href = messageObj.redirect;
                    }, 500);
                }
            }, 500);
        }, 2000);
    }
    // 공개 메서드
    return {
        init: init,
        showToast: showToast
    };
})();
// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 토스트 매니저 초기화
    ToastManager.init();
});