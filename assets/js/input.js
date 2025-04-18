document.addEventListener('DOMContentLoaded', () => {

    const inputContainers = document.querySelectorAll('.input-item');

    inputContainers.forEach(container => {
        const input = container.querySelector('.custom-input');
        const clearBtn = container.querySelector('.clear-btn');
        const togglePasswordBtn = container.querySelector('.toggle-password');

        
        

        // 클리어 버튼 클릭 이벤트 (텍스트 인풋에만 존재)
        if (clearBtn) {
            // 입력 이벤트 핸들러
            input.addEventListener('input', () => {
                clearBtn.style.display = input.value ? 'block' : 'none';
            });
                clearBtn.addEventListener('click', () => {
                if (input.type === 'text' || input.type === 'email') {
                input.value = '';
                clearBtn.style.display = 'none';
                input.focus();
                }
            });
        }
 
        // 비밀번호 토글 버튼 (패스워드 인풋에만 존재)
        if (togglePasswordBtn) {
            togglePasswordBtn.addEventListener('click', () => {
                if (input.type === 'password') {
                    inpㄴut.type = 'text';
                    document.querySelector('.eyes-on').style.display = 'block';
                    document.querySelector('.eyes-off').style.display = 'none';
                } else {
                    input.type = 'password';
                    document.querySelector('.eyes-on').style.display = 'none';
                    document.querySelector('.eyes-off').style.display = 'block';
                    
                }
            });
        }

    });

});