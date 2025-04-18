document.addEventListener('DOMContentLoaded', function() {
    // 초기화 시도
    initDatepicker();
    
    // DOM 변경 감지 설정
    setupMutationObserver();
    
    // 셀렉트박스 변경 감지 설정 (필요한 경우)
    setupSelectboxListener();
  });
  
  /**
   * 데이트피커 초기화 함수
   * @returns {boolean} 초기화 성공 여부
   */

function initDatepicker() {
    const dateRanges = document.querySelectorAll('.date-range');
  
    dateRanges.forEach(dateRange => {
      const startInput = dateRange.querySelector('.start-date');
      const endInput = dateRange.querySelector('.end-date');
  
      if (!startInput || !endInput) return;
  
      if (
        startInput.getAttribute('data-datepicker-initialized') === 'true' &&
        endInput.getAttribute('data-datepicker-initialized') === 'true'
      ) {
        return; // 이미 초기화된 경우 스킵
      }
  
      setupDatepicker(startInput, endInput);
      setupDatepicker(endInput, startInput, true);
  
      startInput.setAttribute('data-datepicker-initialized', 'true');
      endInput.setAttribute('data-datepicker-initialized', 'true');
    });
  
    console.log('✅ 모든 date-range 데이트피커 초기화 완료');
  }
  
  
  
  /**
   * 데이트피커 설정 함수
   * @param {HTMLElement} input - 데이트피커를 적용할 입력 요소
   * @param {HTMLElement} pairInput - 쌍이 되는 입력 요소 (시작일/종료일)
   * @param {boolean} isEndDate - 종료일 여부
   */
  function setupDatepicker(input, pairInput, isEndDate = false) {
    if (!input) return;
    
    // 캘린더 아이콘 클릭 이벤트
    const calendarIcon = input.parentNode.querySelector('.calendar-icon');
    if (calendarIcon) {
      calendarIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleCalendar(input, pairInput, isEndDate);
      });
    }
    
    // 입력란 클릭 이벤트
    input.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleCalendar(this, pairInput, isEndDate);
    });
  }
  
  /**
   * 캘린더 토글 함수
   * @param {HTMLElement} input - 데이트피커를 적용할 입력 요소
   * @param {HTMLElement} pairInput - 쌍이 되는 입력 요소
   * @param {boolean} isEndDate - 종료일 여부
   */
  function toggleCalendar(input, pairInput, isEndDate) {
    // 이미 열린 캘린더가 있으면 닫기
    const existingCalendar = document.querySelector('.simple-calendar');
    if (existingCalendar) {
      existingCalendar.remove();
    }
    
    // 새 캘린더 생성
    createCalendar(input, pairInput, isEndDate);
  }
  
  /**
   * 캘린더 생성 함수
   * @param {HTMLElement} input - 데이트피커를 적용할 입력 요소
   * @param {HTMLElement} pairInput - 쌍이 되는 입력 요소
   * @param {boolean} isEndDate - 종료일 여부
   */
  function createCalendar(input, pairInput, isEndDate) {
    // 현재 날짜 설정
    let currentDate = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 입력란에 날짜가 있으면 해당 날짜로 설정
    if (input.value) {
      const parts = input.value.split(' / ');
      if (parts.length === 3) {
        currentDate = new Date(parts[0], parseInt(parts[1]) - 1, parts[2]);
      }
    }
    
    // 쌍이 되는 입력란의 날짜 (제한사항 설정용)
    let pairDate = null;
    if (pairInput && pairInput.value) {
      const parts = pairInput.value.split(' / ');
      if (parts.length === 3) {
        pairDate = new Date(parts[0], parseInt(parts[1]) - 1, parts[2]);
        pairDate.setHours(0, 0, 0, 0);
      }
    }
    
    // 캘린더 컨테이너 생성
    const calendar = document.createElement('div');
    calendar.className = 'simple-calendar';
    
    // 인라인 스타일 대신 클래스 추가 (CSS는 별도로 유지)
    // 기본 위치 설정만 인라인으로 적용
    const inputRect = input.getBoundingClientRect();
    calendar.style.position = 'absolute';
    calendar.style.zIndex = '1000';
    calendar.style.top = (inputRect.bottom + window.scrollY) + 'px';
    calendar.style.left = (inputRect.left + window.scrollX) + 'px';
    
    // 캘린더 헤더 생성
    const header = document.createElement('div');
    header.className = 'calendar-header';
    
    // 이전 달 버튼
    const prevMonth = document.createElement('button');
    prevMonth.innerHTML = '&lt;';
    prevMonth.className = 'calendar-nav-btn prev-month';
    prevMonth.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendarBody(calendar, currentDate, input, pairInput, pairDate, isEndDate);
    });
    
    // 다음 달 버튼
    const nextMonth = document.createElement('button');
    nextMonth.innerHTML = '&gt;';
    nextMonth.className = 'calendar-nav-btn next-month';
    nextMonth.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendarBody(calendar, currentDate, input, pairInput, pairDate, isEndDate);
    });
    
    // 현재 월/년 표시
    const monthYear = document.createElement('div');
    monthYear.className = 'month-year';
    monthYear.textContent = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;
    
    // 헤더에 요소 추가
    header.appendChild(prevMonth);
    header.appendChild(monthYear);
    header.appendChild(nextMonth);
    
    // 캘린더에 헤더 추가
    calendar.appendChild(header);
    
    // 캘린더 요일 표시 행 생성
    const weekdaysRow = document.createElement('div');
    weekdaysRow.className = 'weekdays';
    
    // 요일 추가
    ['일', '월', '화', '수', '목', '금', '토'].forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.className = 'weekday';
      dayElement.textContent = day;
      weekdaysRow.appendChild(dayElement);
    });
    
    // 캘린더에 요일 행 추가
    calendar.appendChild(weekdaysRow);
    
    // 날짜 그리드 컨테이너 생성
    const daysGrid = document.createElement('div');
    daysGrid.className = 'days-grid';
    
    // 캘린더에 날짜 그리드 추가
    calendar.appendChild(daysGrid);
    
    // 날짜 그리드 업데이트
    updateCalendarBody(calendar, currentDate, input, pairInput, pairDate, isEndDate);
    
    // 문서에 캘린더 추가
    document.body.appendChild(calendar);
    
    // 문서 클릭 시 캘린더 닫기
    setTimeout(() => {
      document.addEventListener('click', function closeCalendar(e) {
        if (!calendar.contains(e.target) && e.target !== input && 
            !input.parentNode.contains(e.target)) {
          calendar.remove();
          document.removeEventListener('click', closeCalendar);
        }
      });
    }, 100);
  }
  
  /**
   * 캘린더 날짜 그리드 업데이트 함수
   * @param {HTMLElement} calendar - 캘린더 요소
   * @param {Date} currentDate - 현재 표시 중인 날짜
   * @param {HTMLElement} input - 날짜 입력 요소
   * @param {HTMLElement} pairInput - 쌍이 되는 입력 요소
   * @param {Date|null} pairDate - 쌍이 되는 날짜 (제한사항용)
   * @param {boolean} isEndDate - 종료일 여부
   */
  function updateCalendarBody(calendar, currentDate, input, pairInput, pairDate, isEndDate) {
    const daysGrid = calendar.querySelector('.days-grid');
    const monthYear = calendar.querySelector('.month-year');
    
    // 월/년 텍스트 업데이트
    monthYear.textContent = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;
    
    // 날짜 그리드 초기화
    daysGrid.innerHTML = '';
    
    // 현재 월의 첫 날
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    // 현재 월의 마지막 날
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // 첫 날의 요일 (0: 일요일, 6: 토요일)
    const firstDayOfWeek = firstDay.getDay();
    
    // 이전 달 날짜 표시
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDay = new Date(firstDay);
      prevMonthDay.setDate(prevMonthDay.getDate() - (firstDayOfWeek - i));
      
      const dayElement = createDayElement(
        prevMonthDay, 
        input, 
        pairInput,
        pairDate, 
        isEndDate, 
        true
      );
      daysGrid.appendChild(dayElement);
    }
    
    // 현재 달 날짜 표시
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      
      const dayElement = createDayElement(
        day, 
        input, 
        pairInput,
        pairDate, 
        isEndDate, 
        false
      );
      daysGrid.appendChild(dayElement);
    }
    
    // 다음 달 날짜로 나머지 채우기 (6주 채우기)
    const totalDays = firstDayOfWeek + lastDay.getDate();
    const remainingDays = 42 - totalDays; // 7일 x 6주 = 42
    
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(lastDay);
      nextMonthDay.setDate(nextMonthDay.getDate() + i);
      
      const dayElement = createDayElement(
        nextMonthDay, 
        input, 
        pairInput,
        pairDate, 
        isEndDate, 
        true
      );
      daysGrid.appendChild(dayElement);
    }
  }
  
  /**
   * 날짜 요소 생성 함수
   * @param {Date} day - 표시할 날짜
   * @param {HTMLElement} input - 날짜 입력 요소
   * @param {HTMLElement} pairInput - 쌍이 되는 입력 요소
   * @param {Date|null} pairDate - 쌍이 되는 날짜 (제한사항용)
   * @param {boolean} isEndDate - 종료일 여부
   * @param {boolean} isOtherMonth - 이전/다음 달 여부
   * @returns {HTMLElement} 날짜 요소
   */
  function createDayElement(day, input, pairInput, pairDate, isEndDate, isOtherMonth) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    day.setHours(0, 0, 0, 0);
    
    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    dayElement.textContent = day.getDate();
    
    // 추가 클래스 적용
    if (isOtherMonth) {
      dayElement.classList.add('other-month');
    }
    
    if (day.getTime() === today.getTime()) {
      dayElement.classList.add('today');
    }
    
    // 선택된 날짜 표시
    if (input.value) {
      const parts = input.value.split(' / ');
      if (parts.length === 3) {
        const selectedDate = new Date(parts[0], parseInt(parts[1]) - 1, parts[2]);
        selectedDate.setHours(0, 0, 0, 0);
        if (day.getTime() === selectedDate.getTime()) {
          dayElement.classList.add('selected');
        }
      }
    }
    
    // 쌍이 되는 날짜에 따른 비활성화 처리
    let disabled = false;
    
    if (pairDate) {
      if (isEndDate && day.getTime() < pairDate.getTime()) {
        // 종료일이 시작일보다 이전인 경우
        disabled = true;
      } else if (!isEndDate && day.getTime() > pairDate.getTime()) {
        // 시작일이 종료일보다 이후인 경우
        disabled = true;
      }
    }
    
    if (disabled) {
      dayElement.classList.add('disabled');
    } else {
      // 날짜 선택 이벤트
      dayElement.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const year = day.getFullYear();
        const month = String(day.getMonth() + 1).padStart(2, '0');
        const date = String(day.getDate()).padStart(2, '0');
        
        input.value = `${year} / ${month} / ${date}`;
        
        // 콘솔에 선택된 날짜 출력
        console.log('선택된 날짜:', input.value);
        
        // change 이벤트 발생
        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
        
        // 캘린더 닫기
        const calendar = document.querySelector('.simple-calendar');
        if (calendar) {
          calendar.remove();
        }
      });
    }
    
    return dayElement;
  }
  
  /**
   * 셀렉트박스 변경 감지 함수
   */
  function setupSelectboxListener() {
    // 셀렉트박스를 찾음 (실제 셀렉트박스의 선택자로 변경 필요)
    const selectElements = document.querySelectorAll('select');
    
    selectElements.forEach(select => {
      select.addEventListener('change', function() {
        // 약간의 지연 후 데이트피커 초기화 시도
        setTimeout(() => {
          if (document.querySelector('.date-range')) {
            initDatepicker();
          }
        }, 200);
      });
    });
  }
  
  /**
   * DOM 변경 감지 설정
   */
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          // 데이트피커 요소가 추가되었는지 확인
          const dateRange = document.querySelector('.date-range');
          if (dateRange && dateRange.querySelector('.start-date') && 
              !dateRange.querySelector('.start-date').hasAttribute('data-datepicker-initialized')) {
            initDatepicker();
          }
        }
      });
    });
    
    // 문서 전체의 변경사항 관찰
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 수동으로 데이트피커 초기화할 수 있는 함수 내보내기
  window.initDatepicker = initDatepicker;
  
