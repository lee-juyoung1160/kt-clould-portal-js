// 팝업 유형별 설정
const alertTypes = {

    //로그인 페이지 : 프로그램 설치 메세지
    alertInstall: {
        content: `보안 설치 프로그램이 설치되지 않았습니다.\r\n초기 설치파일을 설치 후 로그인을 진행해주세요.`,
        buttons: [
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => closeAlert() 
            }
        ]
    },
    //로그인 페이지 : 로그인 실패
    alertLoginFail: {
        content: `아이디 또는 비밀번호를 잘못 입력했습니다.\r\n입력하신 정보를 다시 확인해주십시오.`,
        buttons: [
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => closeAlert() 
            }
        ]
    },
     //로그인 페이지 : 로그인 3회 이상 실패
     alertLoginFail3: {
        content: `아이디 또는 비밀번호를 잘못 입력했습니다.\r\n입력하신 정보를 다시 확인해주십시오.[실패횟수 : 3회/5회]\r\n5회 이상 로그인에 실패할경우 로그인이 차단됩니다.`,
        buttons: [
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => closeAlert() 
            }
        ]
    },
    //로그인 페이지 : 로그인 3회 이상 실패
    alertLoginFail5: {
        content: `로그인 실패 5회를 초과하여 계정이 잠금 처리되었습니다.\r\n핸드폰 OTP인증을 통해 계정 잠금을 해제하시기 바랍니다.`,
        buttons: [
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => closeAlert() 
            }
        ]
    },
    //로그인 잠금 해제 페이지 : 회원정보 불일치
    alertLoginUserInfoFail: {
        content: `입력하신 정보와 일치하는 회원정보가 없습니다.\r\n회원정보를 다시 입력해주세요.`,
        buttons: [
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => closeAlert() 
            }
        ]
    },

     // 홈화면 : Cloud PC 종료시
     alertPcEnd: {
        content: `Cloud PC를 종료하시겠습니까?\r\n진행중인 작업이 저장되지 않을 수 있습니다.`,
        buttons: [
            { 
                text: '취소', 
                class: 'alert-btn-cancel', 
                action: () => closeAlert() 
            },
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => closeAlert() 
            }
        ]
    },
    // 홈화면 : Cloud PC 전환 시
    alertPcConversion: {
        content: `Cloud PC를 전환하시겠습니까?\r\n진행중인 작업이 저장되지 않을 수 있습니다.`,
        buttons: [
            { 
                text: '취소', 
                class: 'alert-btn-cancel', 
                action: () => closeAlert() 
            },
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => closeAlert() 
            }
        ]
    },
    // 홈화면 : Cloud PC 재부팅 실패시
    alertPcBootFail: {
        content: `Cloud PC 재부팅에 실패했습니다.\r\n잠시 후 다시 시도해주세요.`,
        buttons: [
            { 
                text: '취소', 
                class: 'alert-btn-cancel', 
                action: () => closeAlert() 
            },
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => closeAlert() 
            }
        ]
    },
    // 유효성 검사 안내 메세지 : 인증번호 오 입력
    alertAuthFail: {
        content: `인증번호가 일치하지 않습니다.\r\n다시 입력해주세요.`,
        buttons: [
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => closeAlert() 
            }
        ]
    },
    // 유효성 검사 안내 메세지 : 완료
    alertAuthSuccess: {
        content: `인증이 완료되었습니다.`,
        buttons: [
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => closeAlert() 
            }
        ]
    },

    // Qna 등록 : 취소 버튼
    alertQnAWriteCancel: {
        content: `입력하신 정보가 삭제 됩니다.\r\nQ&A 작성을 중지하시겠습니까?`,
        buttons: [
            { 
                text: '취소', 
                class: 'alert-btn-cancel', 
                action: () => closeAlert() 
            },
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => {
                    closeAlert();
                    setTimeout(() => {
                        window.location.href = './home.html';
                    }, 500);
                }
            }
        ]
    },
    // Qna 등록 : 등록 버튼
    alertQnAWriteCancel: {
        content: `Q&A를 등록하시겠습니까?`,
        buttons: [
            { 
                text: '취소', 
                class: 'alert-btn-cancel', 
                action: () => closeAlert() 
            },
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => {
                    closeAlert();
                    setTimeout(() => {
                        window.location.href = './qna_complete.html';
                    }, 500);
                }
            }
        ]
    },

    // 첨부파일 삭제 시
    alertFailDel: {
        content: `삭제하시겠습니까?`,
        buttons: [
            { 
                text: '취소', 
                class: 'alert-btn-cancel', 
                action: () => closeAlert() 
            },
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => {
                    closeAlert();
                }
            }
        ]
    },

    // 첨부파일 용량 초과 시
    alertFileUploadFail: {
        content: `파일 업로드 가능 용량을 초과하였습니다.`,
        buttons: [
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => {
                    closeAlert();
                }
            }
        ]
    },
    alertInvalidFileType: {
        content: `파일 업로드 가능 확장자가 아닙니다.`,
        buttons: [
            { 
                text: '확인', 
                class: 'alert-btn-confirm', 
                action: () => {
                    closeAlert();
                }
            }
        ]
    },

};

// 팝업 열기 함수
function openAlert(type) {
    const alert = document.getElementById('alertOverlay');
    const body = document.getElementById('alertBodyText');
    const footer = document.getElementById('alertFooter');

    // 팝업 설정
    const config = alertTypes[type];
    body.textContent = config.content;

    // 버튼 동적 생성
    footer.innerHTML = '';
    config.buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.className = `alert-btn ${btn.class}`;
        button.onclick = btn.action;
        footer.appendChild(button);
    });

    // 모든 입력 요소에 readonly 속성 추가
    const allInputs = document.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        // readonly 속성 추가
        if (!input.hasAttribute('readonly')) {
            input.setAttribute('data-original-readonly', 'false');
            input.setAttribute('readonly', 'readonly');
        }
        
        // select 요소는 readonly가 작동하지 않으므로 disabled 속성 추가
        // if (input.tagName.toLowerCase() === 'select' && !input.disabled) {
        //     input.setAttribute('data-original-disabled', 'false');
        //     input.disabled = true;
        // }
    });

    // 팝업 표시
    alert.classList.remove('closing');
    alert.classList.add('show');
}

// 팝업 닫기 함수
function closeAlert() {
    const alert = document.getElementById('alertOverlay');
    
    // 닫힘 애니메이션 추가
    alert.classList.add('closing');
    
    // 애니메이션 완료 후 클래스 제거
    setTimeout(() => {
        alert.classList.remove('show', 'closing');
        
        // 모든 입력 요소에서 readonly 속성 제거
        const allInputs = document.querySelectorAll('input, textarea, select');
        allInputs.forEach(input => {
            // 원래 readonly가 아니었던 요소만 제거
            if (input.getAttribute('data-original-readonly') === 'false') {
                input.removeAttribute('readonly');
                input.removeAttribute('data-original-readonly');
            }
            
            // select 요소의 disabled 속성 복원
            if (input.tagName.toLowerCase() === 'select' && input.getAttribute('data-original-disabled') === 'false') {
                input.disabled = false;
                input.removeAttribute('data-original-disabled');
            }
        });
    }, 300); // CSS 트랜지션 시간과 동일하게
}

// 외부 클릭 시 팝업 닫기
if(document.getElementById('alertOverlay')) {
    document.getElementById('alertOverlay').addEventListener('click', function(event) {
        if (event.target === this) {
            closeAlert();
        }
    });
}