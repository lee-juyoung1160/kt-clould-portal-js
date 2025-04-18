/**
 * 테이블 초기화 및 관리를 위한 공통 JavaScript 모듈
 * 페이지네이션, 정렬, 필터링, 검색 기능 지원
 */

// 테이블 초기화 함수
function initializeTable(options) {
    // 기본 옵션 설정
    const defaultOptions = {
        data: [],                    // 테이블 데이터
        renderCallback: null,        // PC 테이블 렌더링 콜백
        renderMobileCallback: null,  // 모바일 테이블 렌더링 콜백
        tableBodyId: 'tableBody',    // PC 테이블 바디 ID
        moTableBodyId: 'moTableBody', // 모바일 테이블 바디 ID
        totalCountId: 'totalCount',  // 총 항목 수 표시 요소 ID
        pageNumbersId: 'pageNumbers', // 페이지 번호 컨테이너 ID
        itemsPerPage: 10,            // 페이지당 항목 수
        pageRange: 5,                // 페이지 네비게이션에 표시할 페이지 번호 수
        sortConfig: {                // 정렬 설정
            defaultColumn: 'id',
            defaultDirection: 'desc'
        },
        filterProperty: null,        // 필터링 속성 (예: 'status')
        fixedItemsFirst: false,      // 고정 항목(isFixed=true)을 항상 먼저 표시할지 여부
        messages: {                  // 메시지 설정
            emptyData: {             // 데이터가 없을 때 메시지
                pc: '<div class="empty-message">데이터가 없습니다.</div>',
                mobile: '<div class="empty-message">데이터가 없습니다.</div>'
            },
            emptySearch: {           // 검색 결과가 없을 때 메시지
                pc: '<div class="empty-message">검색 결과가 없습니다.</div>',
                mobile: '<div class="empty-message">검색 결과가 없습니다.</div>'
            }
        }
    };

    // 사용자 옵션과 기본 옵션 병합
    const settings = { ...defaultOptions, ...options };

    // 내부 상태 관리
    const state = {
        currentData: [...settings.data],
        originalData: [...settings.data],
        currentPage: 1,
        totalPages: Math.ceil(settings.data.length / settings.itemsPerPage),
        sortColumn: settings.sortConfig.defaultColumn,
        sortDirection: settings.sortConfig.defaultDirection,
        searchType: 'all',
        searchTerm: '',
        activeFilter: 'all'
    };

    // DOM 요소 참조
    const elements = {
        tableBody: document.getElementById(settings.tableBodyId),
        moTableBody: document.getElementById(settings.moTableBodyId),
        totalCount: document.getElementById(settings.totalCountId),
        pageNumbers: document.getElementById(settings.pageNumbersId),
        firstPageBtn: document.getElementById('firstPage'),
        prevPageBtn: document.getElementById('prevPage'),
        nextPageBtn: document.getElementById('nextPage'),
        lastPageBtn: document.getElementById('lastPage'),
        searchTypeSelect: document.getElementById('searchTypeSelect'),
        searchInput: document.getElementById('searchInput'),
        searchButton: document.getElementById('searchButton'),
        sortOrderSelect: document.getElementById('sortOrderSelect'),
        tabs: document.querySelector('.tabs')
    };

    /**
     * 데이터 정렬 함수
     * @param {Array} data - 정렬할 데이터 배열
     * @param {string} column - 정렬 기준 컬럼
     * @param {string} direction - 정렬 방향 ('asc' 또는 'desc')
     * @returns {Array} - 정렬된 데이터 배열
     */
    function sortData(data, column, direction) {
        return [...data].sort((a, b) => {
            // 특별한 컬럼 처리
            if (column === 'number') {
                // 'number'는 'id' 필드로 처리
                return direction === 'asc' ? a.id - b.id : b.id - a.id;
            }

            let valueA = a[column];
            let valueB = b[column];

            // 날짜 관련 컬럼 처리 (date, time, startDate, endDate 등)
            if (column === 'date' || column === 'time' || column === 'startDate' || column === 'endDate') {
                // 날짜 범위 형식(2025.04.01~2025.04.15) 처리
                if (typeof valueA === 'string' && valueA.includes('~')) {
                    // 시작 날짜를 기준으로 정렬
                    valueA = valueA.split('~')[0].trim();
                }
                if (typeof valueB === 'string' && valueB.includes('~')) {
                    // 시작 날짜를 기준으로 정렬
                    valueB = valueB.split('~')[0].trim();
                }

                // 특수 값 처리 ('-' 같은 경우 최소값으로 처리)
                if (valueA === '-' || valueA === '') {
                    return direction === 'asc' ? -1 : 1;
                }
                if (valueB === '-' || valueB === '') {
                    return direction === 'asc' ? 1 : -1;
                }

                // 날짜 변환 (.을 -로 변경하여 Date 객체로 변환)
                const dateA = new Date(valueA.replace(/\./g, '-'));
                const dateB = new Date(valueB.replace(/\./g, '-'));

                // 유효한 날짜인지 확인
                const validDateA = !isNaN(dateA.getTime());
                const validDateB = !isNaN(dateB.getTime());

                if (validDateA && validDateB) {
                    return direction === 'asc' ? dateA - dateB : dateB - dateA;
                } else if (validDateA) {
                    return direction === 'asc' ? -1 : 1;
                } else if (validDateB) {
                    return direction === 'asc' ? 1 : -1;
                }
            }

            // 숫자 정렬 처리
            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return direction === 'asc' ? valueA - valueB : valueB - valueA;
            }

            // 문자열 정렬 처리
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return direction === 'asc'
                    ? valueA.localeCompare(valueB, 'ko')
                    : valueB.localeCompare(valueA, 'ko');
            }

            return 0;
        });
    }

    /**
     * 데이터 필터링 함수
     * @param {Array} data - 필터링할 데이터 배열
     * @param {string} property - 필터링 속성
     * @param {string} value - 필터링 값
     * @returns {Array} - 필터링된 데이터 배열
     */
    function filterData(data, property, value) {
        if (!property || value === 'all') {
            return data;
        }
        return data.filter(item => item[property] === value);
    }

    /**
     * 데이터 검색 함수
     * @param {Array} data - 검색할 데이터 배열
     * @param {string} type - 검색 유형 ('all', 'title', 'content' 등)
     * @param {string} term - 검색어
     * @returns {Array} - 검색 결과 배열
     */
    function searchData(data, type, term) {
        if (!term) {
            return data;
        }

        const searchTerm = term.toLowerCase();
        return data.filter(item => {
            if (type === 'all') {
                // 모든 필드에서 검색
                return Object.values(item).some(value =>
                    String(value).toLowerCase().includes(searchTerm)
                );
            } else {
                // 특정 필드에서 검색
                return String(item[type]).toLowerCase().includes(searchTerm);
            }
        });
    }

    /**
     * 현재 페이지 데이터 가져오기
     * @returns {Array} - 현재 페이지에 표시할 데이터
     */
    function getCurrentPageData() {
        const startIndex = (state.currentPage - 1) * settings.itemsPerPage;
        const endIndex = startIndex + settings.itemsPerPage;
        return state.currentData.slice(startIndex, endIndex);
    }

 /**
 * 테이블 데이터 렌더링
 */
function renderTable() {
    const currentPageData = getCurrentPageData();

    // PC 테이블 렌더링
    if (elements.tableBody && settings.renderCallback) {
        if (state.currentData.length === 0) {
            // 테이블 헤더의 열 개수 확인 (동적으로 계산)
            const headerCells = document.querySelectorAll('table thead th').length;
            const colspan = headerCells > 0 ? headerCells : 1;
            
            // 검색 결과가 없는 경우와 데이터가 없는 경우를 구분
            // 설정된 메시지를 그대로 사용하되, 검색 결과가 없는 경우에만 버튼 추가
            let emptyMessage = state.searchTerm ? settings.messages.emptySearch.pc : settings.messages.emptyData.pc;
            
            // 검색 결과가 없을 때만 "목록으로" 버튼 추가
            if (state.searchTerm) {
                // 버튼이 이미 포함되어 있지 않은 경우만 추가
                if (!emptyMessage.includes('btn-reset-search')) {
                    // search-no-result 내부에 버튼 추가
                    emptyMessage = emptyMessage.replace('</div>', '<button class="button btn-reset-search">목록으로</button></div>');
                }
                
                elements.tableBody.innerHTML = `
                    <tr>
                        <td colspan="${colspan}" class="text-center">
                            ${emptyMessage}
                        </td>
                    </tr>
                `;
                
                // 버튼에 이벤트 추가
                const resetBtn = elements.tableBody.querySelector('.btn-reset-search');
                if (resetBtn) {
                    resetBtn.addEventListener('click', function() {
                        // 검색어 초기화
                        state.searchTerm = '';
                        if (elements.searchInput) {
                            elements.searchInput.value = '';
                        }
                        
                        // 데이터 처리 및 테이블 재렌더링
                        processAndRenderData();
                    });
                }
            } else {
                // 데이터가 없는 경우 - 각 페이지의 설정 메시지 사용
                elements.tableBody.innerHTML = `
                    <tr>
                        <td colspan="${colspan}" class="text-center">
                            ${emptyMessage}
                        </td>
                    </tr>
                `;
            }
        } else {
            settings.renderCallback(currentPageData, elements.tableBody);
        }
    }

    // 모바일 테이블 렌더링
    if (elements.moTableBody && settings.renderMobileCallback) {
        if (state.currentData.length === 0) {
            // 검색 결과가 없는 경우와 데이터가 없는 경우를 구분
            let emptyMessage = state.searchTerm ? settings.messages.emptySearch.mobile : settings.messages.emptyData.mobile;
            
            // 검색 결과가 없을 때만 "목록으로" 버튼 추가
            if (state.searchTerm) {
                // 버튼이 이미 포함되어 있지 않은 경우만 추가
                if (!emptyMessage.includes('btn-reset-search')) {
                    // search-no-result 내부에 버튼 추가
                    emptyMessage = emptyMessage.replace('</div>', '<button class="button btn-reset-search">목록으로</button></div>');
                }
                
                elements.moTableBody.innerHTML = emptyMessage;
                
                // 버튼에 이벤트 추가
                const resetBtn = elements.moTableBody.querySelector('.btn-reset-search');
                if (resetBtn) {
                    resetBtn.addEventListener('click', function() {
                        // 검색어 초기화
                        state.searchTerm = '';
                        if (elements.searchInput) {
                            elements.searchInput.value = '';
                        }
                        
                        // 데이터 처리 및 테이블 재렌더링
                        processAndRenderData();
                        
                        // 모바일 화면에서는 검색 컨테이너도 닫기
                        if (window.innerWidth <= 767) {
                            const searchContainer = document.querySelector('.search-container');
                            if (searchContainer && searchContainer.classList.contains('active')) {
                                searchContainer.classList.remove('active');
                            }
                        }
                    });
                }
            } else {
                // 데이터가 없는 경우 - 각 페이지의 설정 메시지 사용
                elements.moTableBody.innerHTML = emptyMessage;
            }
        } else {
            settings.renderMobileCallback(currentPageData, elements.moTableBody);
        }
    }

    // 총 항목 수 업데이트
    if (elements.totalCount) {
        elements.totalCount.textContent = state.currentData.length;
    }

    // 페이지네이션 업데이트
    updatePagination();
}

    /**
     * 페이지네이션 업데이트
     */
    function updatePagination() {
        // 총 페이지 수 계산
        state.totalPages = Math.ceil(state.currentData.length / settings.itemsPerPage);

        if (!elements.pageNumbers) return;

        elements.pageNumbers.innerHTML = '';

        // 페이지 범위 계산
        const startPage = Math.max(1, state.currentPage - Math.floor(settings.pageRange / 2));
        const endPage = Math.min(state.totalPages, startPage + settings.pageRange - 1);

        // 페이지 버튼 생성
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = i === state.currentPage ? 'active' : '';
            pageButton.addEventListener('click', () => goToPage(i));
            elements.pageNumbers.appendChild(pageButton);
        }

        // 이전/다음 버튼 활성화/비활성화
        if (elements.firstPageBtn) {
            elements.firstPageBtn.disabled = state.currentPage === 1;
        }
        if (elements.prevPageBtn) {
            elements.prevPageBtn.disabled = state.currentPage === 1;
        }
        if (elements.nextPageBtn) {
            elements.nextPageBtn.disabled = state.currentPage === state.totalPages || state.totalPages === 0;
        }
        if (elements.lastPageBtn) {
            elements.lastPageBtn.disabled = state.currentPage === state.totalPages || state.totalPages === 0;
        }
    }

    /**
     * 지정한 페이지로 이동
     * @param {number} page - 이동할 페이지 번호
     */
    function goToPage(page) {
        if (page < 1 || page > state.totalPages) {
            return;
        }
        state.currentPage = page;
        renderTable();
    }

    /**
     * 데이터 처리 및 렌더링 수행
     * 정렬, 필터링, 검색을 적용하고 테이블 업데이트
     */
    function processAndRenderData() {
        // 원본 데이터로 시작
        let processedData = [...state.originalData];

        // 필터링 적용
        if (settings.filterProperty && state.activeFilter !== 'all') {
            processedData = filterData(processedData, settings.filterProperty, state.activeFilter);
        }

        // 검색 적용
        if (state.searchTerm) {
            processedData = searchData(processedData, state.searchType, state.searchTerm);
        }

        // 정렬 적용 (고정 항목 우선 처리)
        if (settings.fixedItemsFirst && processedData.some(item => item.isFixed)) {
            // 고정 항목과 일반 항목 분리
            const fixedItems = processedData.filter(item => item.isFixed);
            const normalItems = processedData.filter(item => !item.isFixed);

            // 각 그룹 내에서 정렬
            const sortedFixed = sortData(fixedItems, state.sortColumn, state.sortDirection);
            const sortedNormal = sortData(normalItems, state.sortColumn, state.sortDirection);

            // 고정 항목을 먼저 배치
            processedData = [...sortedFixed, ...sortedNormal];
        } else {
            // 일반 정렬 적용
            processedData = sortData(processedData, state.sortColumn, state.sortDirection);
        }

        // 현재 데이터 업데이트
        state.currentData = processedData;

        // 첫 페이지로 이동
        state.currentPage = 1;

        // 테이블 렌더링
        renderTable();
    }

    /**
     * 이벤트 리스너 설정
     */
    function setupEventListeners() {
        // 페이지네이션 버튼 이벤트
        if (elements.firstPageBtn) {
            elements.firstPageBtn.addEventListener('click', () => goToPage(1));
        }
        if (elements.prevPageBtn) {
            elements.prevPageBtn.addEventListener('click', () => goToPage(state.currentPage - 1));
        }
        if (elements.nextPageBtn) {
            elements.nextPageBtn.addEventListener('click', () => goToPage(state.currentPage + 1));
        }
        if (elements.lastPageBtn) {
            elements.lastPageBtn.addEventListener('click', () => goToPage(state.totalPages));
        }

        // 검색 이벤트
        if (elements.searchButton) {
            elements.searchButton.addEventListener('click', () => {
                state.searchTerm = elements.searchInput.value.trim();
                state.searchType = document.getElementById('searchType').value;
                processAndRenderData();
            });
        }

        if (elements.searchInput) {
            elements.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    state.searchTerm = elements.searchInput.value.trim();
                    state.searchType = document.getElementById('searchType').value;
                    processAndRenderData();
                }
            });
        }

        // 정렬 이벤트 - 테이블 헤더 클릭 (수정됨)
        setupTableHeaderSorting();

        // 정렬 선택 변경 이벤트
        if (elements.sortOrderSelect) {
            const sortItems = elements.sortOrderSelect.querySelectorAll('.select-items div');
            sortItems.forEach(item => {
                item.addEventListener('click', function () {
                    const value = this.getAttribute('data-value');
                    document.getElementById('sortOrder').value = value;

                    // 정렬 방식에 따라 상태 업데이트
                    switch (value) {
                        case 'newest':
                            state.sortColumn = 'date';
                            state.sortDirection = 'desc';
                            break;
                        case 'oldest':
                            state.sortColumn = 'date';
                            state.sortDirection = 'asc';
                            break;
                        case 'views':
                            state.sortColumn = 'views';
                            state.sortDirection = 'desc';
                            break;
                    }

                    processAndRenderData();
                });
            });
        }

        // 탭(필터) 클릭 이벤트
        if (elements.tabs) {
            elements.tabs.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    const filter = e.target.getAttribute('data-value');

                    // 활성 탭 스타일 변경
                    document.querySelectorAll('.tabs button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    e.target.classList.add('active');

                    // 필터 적용
                    state.activeFilter = filter;
                    processAndRenderData();
                }
            });
        }

        // 커스텀 셀렉트 박스 이벤트 설정
        setupCustomSelectBoxes();
    }

    /**
     * 테이블 헤더 정렬 이벤트 설정
     * 테이블 헤더 클릭 시 정렬 기능을 처리합니다.
     */
    function setupTableHeaderSorting() {
        const headerCells = document.querySelectorAll('th[data-sort]');
        // 모든 이벤트 리스너 제거하고 다시 설정
        headerCells.forEach(cell => {
            // 기존 리스너 제거 (클론 교체 방식)
            const newCell = cell.cloneNode(true);
            cell.parentNode.replaceChild(newCell, cell);

            // 새 리스너 추가
            newCell.addEventListener('click', function () {
                const column = this.getAttribute('data-sort');

                // 정렬 방향 아이콘 업데이트
                updateSortIcons(this);

                // 같은 컬럼 클릭 시 정렬 방향 전환
                if (state.sortColumn === column) {
                    state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    state.sortColumn = column;
                    state.sortDirection = 'asc';
                }

                // 정렬 실행
                processAndRenderData();
            });
        });
    }

    /**
     * 정렬 아이콘 업데이트
     * @param {HTMLElement} currentHeader - 현재 클릭한 헤더 셀
     */


    function updateSortIcons(currentHeader) {
        // 모든 헤더에서 정렬 클래스 제거
        document.querySelectorAll('th[data-sort]').forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
        });

        // 현재 헤더에 정렬 클래스 추가
        const column = currentHeader.getAttribute('data-sort');
        if (state.sortColumn === column) {
            // 같은 컬럼이면 다음 방향으로 전환
            const nextDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
            currentHeader.classList.add(`sort-${nextDirection}`);
        } else {
            // 새 컬럼이면 오름차순 시작
            currentHeader.classList.add('sort-asc');
        }
    }

    /**
     * 커스텀 셀렉트 박스 설정
     */
    function setupCustomSelectBoxes() {
        const customSelects = document.querySelectorAll('.custom-select');

        customSelects.forEach(selectBox => {
            const selected = selectBox.querySelector('.select-selected');
            const items = selectBox.querySelector('.select-items');

            // 셀렉트 박스 클릭 이벤트
            selected.addEventListener('click', function (e) {
                e.stopPropagation();

                // 다른 셀렉트 박스 닫기
                document.querySelectorAll('.select-items').forEach(dropdown => {
                    if (dropdown !== items) {
                        dropdown.classList.add('select-hide');
                    }
                });

                // 현재 셀렉트 박스 토글
                items.classList.toggle('select-hide');
                this.classList.toggle('select-arrow-active');
            });

            // 옵션 아이템 클릭 이벤트
            const optionItems = items.querySelectorAll('div');
            optionItems.forEach(item => {
                item.addEventListener('click', function (e) {
                    e.stopPropagation();

                    // 선택된 값 표시 및 hidden input 업데이트
                    selected.textContent = this.textContent;
                    const value = this.getAttribute('data-value');
                    const hiddenInput = selectBox.querySelector('input[type="hidden"]');
                    if (hiddenInput) {
                        hiddenInput.value = value;
                    }

                    // 드롭다운 닫기
                    items.classList.add('select-hide');
                    selected.classList.remove('select-arrow-active');
                });
            });
        });

        // 문서 클릭 시 모든 셀렉트 박스 닫기
        document.addEventListener('click', () => {
            document.querySelectorAll('.select-items').forEach(dropdown => {
                dropdown.classList.add('select-hide');
            });
            document.querySelectorAll('.select-selected').forEach(selected => {
                selected.classList.remove('select-arrow-active');
            });
        });
    }

    /**
     * 동적 탭 생성 함수
     * @param {Array} data - 데이터 배열
     * @param {string} property - 탭으로 표시할 속성
     * @param {HTMLElement} tabContainer - 탭을 추가할 컨테이너
     */
    function createDynamicTabs(data, property, tabContainer) {
        if (!tabContainer || !property) return;

        // 고유한 속성 값 추출
        const uniqueValues = [...new Set(data.map(item => item[property]))];

        // '전체' 탭 추가
        const allTab = document.createElement('li');
        const allButton = document.createElement('button');
        allButton.setAttribute('data-value', 'all');
        allButton.textContent = '전체';
        allButton.classList.add('active'); // 기본적으로 전체 탭 활성화
        allTab.appendChild(allButton);
        tabContainer.appendChild(allTab);

        // 각 고유 값에 대한 탭 추가
        uniqueValues.forEach(value => {
            const tabItem = document.createElement('li');
            const button = document.createElement('button');
            button.setAttribute('data-value', value);
            button.textContent = value;
            tabItem.appendChild(button);
            tabContainer.appendChild(tabItem);
        });
    }

    // 공개 API
    return {
        /**
         * 테이블 초기화
         */
        init: function () {
            setupEventListeners();
            processAndRenderData();
        },

        /**
         * 데이터 설정
         * @param {Array} newData - 새 데이터 배열
         */
        setData: function (newData) {
            state.originalData = [...newData];
            processAndRenderData();
        },

        /**
         * 현재 데이터 가져오기
         * @returns {Array} - 현재 데이터 배열
         */
        getData: function () {
            return state.currentData;
        },

        /**
         * 필터 설정
         * @param {string} filter - 적용할 필터 값
         */
        setFilter: function (filter) {
            state.activeFilter = filter;
            processAndRenderData();
        },

        /**
         * 검색 수행
         * @param {string} type - 검색 유형
         * @param {string} term - 검색어
         */
        search: function (type, term) {
            state.searchType = type;
            state.searchTerm = term;
            processAndRenderData();
        },

        /**
         * 정렬 설정
         * @param {string} column - 정렬 컬럼
         * @param {string} direction - 정렬 방향
         */
        sort: function (column, direction) {
            state.sortColumn = column;
            state.sortDirection = direction;
            processAndRenderData();
        },

        /**
         * 테이블 헤더 정렬 이벤트 재설정
         * 동적으로 테이블이 변경된 경우 호출하여 정렬 이벤트를 재설정합니다.
         */
        refreshHeaderSorting: function () {
            setupTableHeaderSorting();
        }
    };
}

/**
 * 동적 탭 생성 함수 - 전역으로 노출
 * @param {Array} data - 데이터 배열
 * @param {string} property - 탭으로 표시할 속성
 * @param {HTMLElement} tabContainer - 탭을 추가할 컨테이너
 */
function createDynamicTabs(data, property, tabContainer) {
    if (!tabContainer || !property) return;

    // 고유한 속성 값 추출
    const uniqueValues = [...new Set(data.map(item => item[property]))];

    // 값을 가나다 순으로 정렬 (전체 탭은 별도 처리)
    uniqueValues.sort((a, b) => {
        // 숫자인 경우 숫자 정렬
        if (!isNaN(Number(a)) && !isNaN(Number(b))) {
            return Number(a) - Number(b);
        }
        // 문자열인 경우 사전식 정렬
        return String(a).localeCompare(String(b), 'ko');
    });

    // 탭 컨테이너 초기화
    tabContainer.innerHTML = '';

    // '전체' 탭 추가 (항상 첫 번째)
    const allTab = document.createElement('li');
    const allButton = document.createElement('button');
    allButton.setAttribute('data-value', 'all');
    allButton.textContent = '전체';
    allButton.classList.add('active'); // 기본적으로 전체 탭 활성화
    allTab.appendChild(allButton);
    tabContainer.appendChild(allTab);

    // 각 고유 값에 대한 탭 추가
    uniqueValues.forEach(value => {
        // 빈 값이나 null은 건너뛰기
        if (value === null || value === undefined || value === '') return;

        const tabItem = document.createElement('li');
        const button = document.createElement('button');
        button.setAttribute('data-value', value);
        button.textContent = value;
        tabItem.appendChild(button);
        tabContainer.appendChild(tabItem);
    });
}

/**
 * 문서 준비 이벤트
 * 모바일 메뉴 관련 기능 설정
 */
document.addEventListener('DOMContentLoaded', function () {
    // 모바일 메뉴 토글 기능
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.overlay');
    const closeBtn = document.querySelector('.close-btn');

    if (menuToggle && nav && overlay) {
        // 메뉴 열기
        menuToggle.addEventListener('click', function () {
            nav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // 스크롤 방지
        });

        // 메뉴 닫기 함수
        const closeMenu = function () {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // 스크롤 복원
        };

        // 닫기 버튼 클릭
        if (closeBtn) {
            closeBtn.addEventListener('click', closeMenu);
        }

        // 오버레이 클릭
        overlay.addEventListener('click', closeMenu);
    }

    // 드롭다운 메뉴 토글 기능
    const mainMenuItems = document.querySelectorAll('.main-menu > li > a');

    mainMenuItems.forEach(item => {
        // 서브메뉴가 있는 항목만 처리
        const subMenu = item.nextElementSibling;
        if (subMenu && subMenu.classList.contains('sub-menu')) {
            item.addEventListener('click', function (e) {
                // 링크 기본 동작 방지(서브메뉴가 있는 경우만)
                e.preventDefault();

                // 현재 항목의 활성 상태 토글
                const parentLi = this.parentElement;
                parentLi.classList.toggle('active');

                // 다른 열린 메뉴 닫기 (옵션)
                mainMenuItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.parentElement.classList.contains('active')) {
                        otherItem.parentElement.classList.remove('active');
                    }
                });
            });
        }
    });

    // 프로필 드롭다운 메뉴
    const profileBtn = document.querySelector('.btn-profile');
    const profileContent = document.querySelector('.hover-content');

    if (profileBtn && profileContent) {
        profileBtn.addEventListener('click', function () {
            profileContent.classList.toggle('active');
        });

        // 문서 클릭 시 프로필 메뉴 닫기
        document.addEventListener('click', function (e) {
            if (!profileBtn.contains(e.target) && !profileContent.contains(e.target)) {
                profileContent.classList.remove('active');
            }
        });
    }
    // 검색 토글 버튼 이벤트 추가
    const searchButtonToggle = document.querySelector('.search-button-toggle');
    const searchContainer = document.querySelector('.search-container');

    if (searchButtonToggle && searchContainer) {
        searchButtonToggle.addEventListener('click', function (event) {
            // 이벤트 버블링 방지
            event.stopPropagation();

            // 토글 방식 변경
            if (searchContainer.classList.contains('active')) {
                searchContainer.classList.remove('active');
            } else {
                searchContainer.classList.add('active');
            }
        });
    }



});

document.addEventListener('DOMContentLoaded', function () {
    // 기존 코드...

    // 검색 이벤트 핸들러 추가
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            // 검색 처리 로직 (이미 테이블 초기화 함수에서 처리됨)
            
            // 모바일 화면(767px 이하)에서만 검색 컨테이너 닫기
            if (window.innerWidth <= 767) {
                const searchContainer = document.querySelector('.search-container');
                if (searchContainer && searchContainer.classList.contains('active')) {
                    searchContainer.classList.remove('active');
                }
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // 검색 처리 로직 (이미 테이블 초기화 함수에서 처리됨)
                
                // 모바일 화면(767px 이하)에서만 검색 컨테이너 닫기
                if (window.innerWidth <= 767) {
                    const searchContainer = document.querySelector('.search-container');
                    if (searchContainer && searchContainer.classList.contains('active')) {
                        searchContainer.classList.remove('active');
                    }
                }
            }
        });
    }
});


