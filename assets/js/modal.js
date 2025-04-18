



// 팝업 열기 함수
function openModal(modalClass) {

    const modal = document.querySelector(`.${modalClass}`);

    if (modal) {
        modal.classList.add('show');
    }
    // 팝업 표시
    modal.classList.remove('closing');

}

// 팝업 닫기 함수
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    
    // 닫힘 애니메이션 추가
    modal.classList.add('closing');
    
    // 애니메이션 완료 후 클래스 제거
    setTimeout(() => {
        modal.classList.remove('show', 'closing');
    }, 300); // CSS 트랜지션 시간과 동일하게
}


// 모달 열기 버튼 클릭 이벤트
const openButtons = document.querySelectorAll('[data-modal-target]');
openButtons.forEach(button => {
    button.addEventListener('click', function() {
        const modalClass = this.getAttribute('data-modal-target');
        openModal(modalClass);
    });
});


// 닫기 버튼 클릭 시 팝업 닫기
const modalClose = document.getElementById('modalClose');

modalClose.addEventListener('click', () =>  {
    closeModal();
});
// 외부 클릭 시 팝업 닫기
document.getElementById('modalOverlay').addEventListener('click', function(event) {
    if (event.target === this) {
        closeModal();
    }
});

//

const modalConfirm = document.getElementById('modalConfirm');
