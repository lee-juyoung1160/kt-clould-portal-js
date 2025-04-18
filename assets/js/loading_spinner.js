/**
 * 로딩 스피너 모듈
 * - 사용법: 
 *   1. 스크립트 태그로 이 파일을 로드
 *   2. LoadingSpinner.init() 으로 초기화
 *   3. LoadingSpinner.show() / LoadingSpinner.hide() 로 표시/숨김 제어
 */
const LoadingSpinner = (function() {
    // 비공개 변수
    let spinnerElement = null;
    let initialized = false;
  
    /**
     * 스피너 요소 생성
     */
    function createSpinnerElement() {
      // 로딩 오버레이 요소 생성
      const loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-overlay';
      
      // 스피너 요소 생성
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      
      // 오버레이에 스피너 추가
      loadingOverlay.appendChild(spinner);
      
      // 기본적으로 숨김 상태로 설정
      loadingOverlay.style.display = 'none';
      
      // body에 오버레이 추가
      document.body.appendChild(loadingOverlay);
      
      return loadingOverlay;
    }
  
    // 공개 API
    return {
      /**
       * 스피너 초기화 함수
       * @param {Object} options - 설정 옵션 (선택적)
       * @param {string} options.backgroundColor - 배경색 (기본값: 'rgba(0, 0, 0, 0.5)')
       * @param {string} options.spinnerColor - 스피너 색상 (기본값: '#3498db')
       */
      init: function(options = {}) {
        if (initialized) {
          console.warn('LoadingSpinner is already initialized.');
          return;
        }
        
        spinnerElement = createSpinnerElement();
        
        // 옵션 적용
        if (options.backgroundColor) {
          spinnerElement.style.backgroundColor = options.backgroundColor;
        }
        
        if (options.spinnerColor) {
          const spinnerObj = spinnerElement.querySelector('.spinner');
          if (spinnerObj) {
            spinnerObj.style.borderTop = `5px solid ${options.spinnerColor}`;
          }
        }
        
        initialized = true;
      },
      
      /**
       * 스피너 표시
       */
      show: function() {
        if (!initialized) {
          this.init();
        }
        spinnerElement.style.display = 'flex';
      },
      
      /**
       * 스피너 숨기기
       */
      hide: function() {
        if (!initialized) {
          return;
        }
        spinnerElement.style.display = 'none';
      },
      
      /**
       * 제거
       */
      destroy: function() {
        if (!initialized) {
          return;
        }
        if (spinnerElement && spinnerElement.parentNode) {
          spinnerElement.parentNode.removeChild(spinnerElement);
        }
        initialized = false;
        spinnerElement = null;
      }
    };
  })();