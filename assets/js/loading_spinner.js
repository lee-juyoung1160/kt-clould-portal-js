/**
 * 로딩 스피너 모듈
 * - 사용법: 
 *   1. 스크립트 태그로 이 파일을 로드
 *   2. LoadingSpinner.init() 으로 초기화
 *   3. LoadingSpinner.show('텍스트 메시지') / LoadingSpinner.hide() 로 표시/숨김 제어
 */
const LoadingSpinner = (function() {
  // 비공개 변수
  let spinnerElement = null;
  let textElement = null;
  let initialized = false;

  /**
   * 스피너 요소 생성
   */
  function createSpinnerElement() {
    // 로딩 오버레이 요소 생성
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    
    // 스피너 컨테이너 (스피너와 텍스트를 함께 담는 컨테이너)
    const spinnerContainer = document.createElement('div');
    spinnerContainer.className = 'spinner-container';
    
    // 스피너 요소 생성
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    
    // 텍스트 요소 생성
    const text = document.createElement('div');
    text.className = 'spinner-text';
    
    // 컨테이너에 스피너와 텍스트 추가
    spinnerContainer.appendChild(spinner);
    spinnerContainer.appendChild(text);
    
    // 오버레이에 컨테이너 추가
    loadingOverlay.appendChild(spinnerContainer);
    
    // 기본적으로 숨김 상태로 설정
    loadingOverlay.style.display = 'none';
    
    // body에 오버레이 추가
    document.body.appendChild(loadingOverlay);
    
    return {
      overlay: loadingOverlay,
      textElement: text
    };
  }

  // 공개 API
  return {
    /**
     * 스피너 초기화 함수
     * @param {Object} options - 설정 옵션 (선택적)
     * @param {string} options.backgroundColor - 배경색 (기본값: 'rgba(0, 0, 0, 0.5)')
     * @param {string} options.spinnerColor - 스피너 색상 (기본값: '#3498db')
     * @param {string} options.textColor - 텍스트 색상 (기본값: '#ffffff')
     * @param {string} options.defaultText - 기본 텍스트 (기본값: '')
     */
    init: function(options = {}) {
      if (initialized) {
        console.warn('LoadingSpinner is already initialized.');
        return;
      }
      
      const elements = createSpinnerElement();
      spinnerElement = elements.overlay;
      textElement = elements.textElement;
      
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
      
      if (options.textColor) {
        textElement.style.color = options.textColor;
      }
      
      if (options.defaultText) {
        textElement.textContent = options.defaultText;
      }
      
      // 기본 스타일 추가
      const style = document.createElement('style');
      style.textContent = `
        .spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `;
      document.head.appendChild(style);
      
      initialized = true;
    },
    
    /**
     * 스피너 표시
     * @param {string} text - 표시할 텍스트 (선택적)
     */
    show: function(text) {
      if (!initialized) {
        this.init();
      }
      
      // 텍스트 설정 (제공된 경우)
      if (text !== undefined && textElement) {
        textElement.textContent = text;
        textElement.style.display = 'block';
      } else if (textElement) {
        // 텍스트가 없으면 텍스트 영역 숨김
        textElement.style.display = text === '' ? 'none' : 'block';
      }
      
      spinnerElement.style.display = 'flex';
    },
    
    /**
     * 텍스트 업데이트
     * @param {string} text - 업데이트할 텍스트
     */
    updateText: function(text) {
      if (!initialized || !textElement) {
        return;
      }
      
      textElement.textContent = text;
      textElement.style.display = text === '' ? 'none' : 'block';
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
      textElement = null;
    }
  };
})();