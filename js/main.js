function showToast(message, triggerElement) {
    // 버튼이 비활성 상태일 경우 토스트 안 뜨게 처리
    if (triggerElement && !triggerElement.classList.contains('active')) return;
  
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
  
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

document.addEventListener('DOMContentLoaded', function() {
    // 공통 변수
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar .menu-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href && href === currentPath) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
    });
    const body = document.querySelector('body');
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.toggle');
    const searchBtn = document.querySelector('.search-box');
    const modeSwitch = document.querySelector('.toggle-switch');
    const modeText = document.querySelector('.mode-text');
    const popupDim = document.getElementById('popupDim');
    const sortBtn = document.querySelector('.sort-button[data-sort-key="amount"]');
    const sortIcon = sortBtn?.querySelector('img');
    const requireText = document.body.dataset.requireText === 'true';
    document.querySelectorAll('.check-icon, .download-link').forEach(button => {
        button.addEventListener('click', function () {
          const message = this.dataset.toastMessage;
          showToast(message, this);
        });
    });

    document.querySelectorAll('.table-select-button').forEach(button => {
        button.addEventListener('click', function() {
          this.classList.toggle('open');
        });
        
        const options = button.querySelectorAll('.table-select-option');
        options.forEach(option => {
          option.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 선택된 옵션 표시
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // 버튼 텍스트 업데이트
            button.childNodes[0].nodeValue = this.textContent;
            
            // 드롭다운 닫기
            button.classList.remove('open');
          });
        });
    });
    
    document.querySelectorAll('.input-with-icon').forEach(container => {
        const input = container.querySelector('.table-input');
        const icon = container.querySelector('.check-icon');
      
        input.addEventListener('input', () => {
          if (input.value.trim() === '') {
            icon.src = 'images/ic_check_disabled_20.png';
            icon.classList.remove('active');
          } else {
            icon.src = 'images/ic_check_activated_20.png';
            icon.classList.add('active');
          }
        });
      
        icon.addEventListener('mouseover', () => {
          if (icon.classList.contains('active')) {
            icon.src = 'images/ic_check_hover_20.png';
          }
        });
      
        icon.addEventListener('mouseout', () => {
          if (icon.classList.contains('active')) {
            icon.src = 'images/ic_check_activated_20.png';
          }
        });
      
        icon.addEventListener('mousedown', () => {
          if (icon.classList.contains('active')) {
            icon.src = 'images/ic_check_select_20.png';
          }
        });
      
        icon.addEventListener('mouseup', () => {
          if (icon.classList.contains('active')) {
            icon.src = 'images/ic_check_hover_20.png';
          }
        });
    });
      

    function checkInputsFilled() {
        const saveButton = document.getElementById('saveBtn');
        if (!saveButton) return;

        let valid = true;

        const visiblePopup = document.querySelector('.popup-container[style*="display: block"]');
        const context = visiblePopup || document;

        const radioInputs = context.querySelectorAll('input[name="rowSelect"]');
        if (radioInputs.length > 0) {
            const radioChecked = context.querySelector('input[name="rowSelect"]:checked') !== null;
            if (!radioChecked) valid = false;
        }

        if (requireText) {
            const activeInputs = context.querySelectorAll('.text-field:not(:disabled)');
            const allTextFilled = Array.from(activeInputs).every(input => input.value.trim() !== '');
            if (!allTextFilled) valid = false;
        }

        saveButton.disabled = !valid;
    }

    // 전역 인풋 감지
    document.addEventListener('input', function (e) {
        if (e.target.classList.contains('text-field')) {
            checkInputsFilled();
        }
    });

    // 전역 라디오 감지
    document.addEventListener('change', function (e) {
        if (e.target.type === 'radio') {
            checkInputsFilled();
        }
    });

    // 탭 전환 후 검사
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.addEventListener('click', () => {
            setTimeout(checkInputsFilled, 10);
        });
    });

    // 초기 상태 확인
    checkInputsFilled();


    if (sortBtn && sortIcon) {
        let isAscending = false;
    
        sortBtn.addEventListener('click', function () {
          isAscending = !isAscending;
    
          // 정렬 대상 테이블 행 가져오기
          const rows = Array.from(document.querySelectorAll('tbody tr'));
    
          // 정렬
          rows.sort((a, b) => {
            const aVal = parseInt(a.cells[4].innerText.replace(/[^0-9]/g, ''), 10);
            const bVal = parseInt(b.cells[4].innerText.replace(/[^0-9]/g, ''), 10);
            return isAscending ? aVal - bVal : bVal - aVal;
          });
    
          // 정렬된 행 다시 tbody에 삽입
          const tbody = document.querySelector('tbody');
          rows.forEach(row => tbody.appendChild(row));
        });
    }

    // ✅ 테이블 행 클릭 시 팝업 처리
    document.querySelectorAll('.open-popup-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const popupId = this.dataset.popupTarget;
            const popup = document.getElementById(popupId);
            const dim = document.getElementById('popupDim');
    
            if (popup && dim) {
                // 팝업 타이틀/내용이 있다면 여기서 설정
                const title = this.dataset.popupTitle;
                const popupTitleEl = popup.querySelector('.popup-header h2');
                if (popupTitleEl && title) popupTitleEl.textContent = title;
    
                popup.style.display = 'block';
                dim.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    //팝업 esc로 종료
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.popup-container, .date-picker-popup, #mypagePopup').forEach(popup => {
                popup.style.display = 'none';
            });

            const dim = document.getElementById('popupDim');
            if (dim) dim.style.display = 'none';

            document.body.style.overflow = '';

            document.querySelectorAll('.date-picker').forEach(picker => {
                picker.classList.remove('active');
            });
        }
    });

    // ✅ 팝업 버튼 클릭 시
    document.querySelectorAll('.open-popup-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const popupId = this.dataset.popupTarget; // 팝업 ID 가져오기
            const popup = document.getElementById(popupId); // 팝업 요소
            const dim = document.getElementById('popupDim'); // 딤 요소
    
            // data-popup-message와 data-popup-title 속성 값 가져오기
            const message = this.dataset.popupMessage; // 팝업 문구
            const title = this.dataset.popupTitle; // 팝업 타이틀
    
            if (popup && dim) {
                // 팝업 내용 업데이트
                const content = popup.querySelector('.popup-content p');
                if (content) {
                    content.innerHTML = message; // 팝업 문구 변경
                }
                
                // 팝업 타이틀 업데이트
                const popupTitle = popup.querySelector('.popup-header h2');
                if (popupTitle) {
                    popupTitle.innerText = title; // 팝업 타이틀 변경
                }
                
                // 팝업 열기
                popup.style.display = 'block';
                dim.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // ✅ 팝업 딤 클릭 시 닫기
    if (popupDim) {
        popupDim.addEventListener('click', function() {
            document.querySelectorAll('.popup-container').forEach(popup => {
                popup.style.display = 'none'; // 개별적으로 팝업 닫기
            });
            this.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    // ✅ 삭제 팝업 - 취소 버튼
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const popup = this.closest('.popup-container');
            if (popup) popup.style.display = 'none';
            if (popupDim) popupDim.style.display = 'none';
            document.body.style.overflow = '';
        });
    });

    // ✅ 삭제 팝업 - 확인 버튼
    document.querySelectorAll('.confirm-delete-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            alert('삭제가 처리되었습니다.');
            document.getElementById('confirmDeletePopup').style.display = 'none';
            if (popupDim) popupDim.style.display = 'none';
            document.body.style.overflow = '';
        });
    });

    // 콘텐츠 헤더 초기화
    initContentHeader();

    // 페이지네이션 초기화
    initPagination();

    // 사이드바 토글
    toggle?.addEventListener('click', () => {
        sidebar.classList.toggle('close');
    });

    // 검색 버튼
    searchBtn?.addEventListener('click', () => {
        sidebar.classList.remove('close');
    });

    // 다크모드 토글
    modeSwitch?.addEventListener('click', () => {
        body.classList.toggle('dark');

        if(body.classList.contains('dark')) {
            modeText.innerText = '라이트 모드';
        } else {
            modeText.innerText = '다크 모드';
        }
    });

    // 메뉴 아이템 활성화
    const menuItems = document.querySelectorAll('.nav-link');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // 기존 활성화된 메뉴 제거
            menuItems.forEach(i => i.classList.remove('active'));
            // 클릭된 메뉴 활성화
            item.classList.add('active');
        });
    });

    // 알림 관련 요소
    const alarmIcon = document.querySelector('#alarmContainer');
    const notificationCount = document.querySelector('#alarmBadge');
    let notifications = 0;

    // 알림 배지 업데이트 함수
    function updateNotificationBadge() {
        if (notifications > 0) {
            notificationCount.style.display = 'block';
            notificationCount.textContent = notifications;
        } else {
            notificationCount.style.display = 'none';
        }
    }

    // 알림 초기화
    notifications = 3; // 초기값 설정
    updateNotificationBadge();

    // 기존에 생성된 테스트 버튼 제거
    const existingTestBtn = document.getElementById('testAlarmBtn');
    if (existingTestBtn) {
        existingTestBtn.remove();
    }

    // 기존에 생성된 햄버거 아이콘 제거
    const existingHamburgerIcon = document.querySelector('.hamburger-icon');
    if (existingHamburgerIcon) {
        existingHamburgerIcon.remove();
    }

    // 프로필 관련 요소
    const profileIcon = document.querySelector('#userInfo');
    const profilePopup = document.querySelector('#mypagePopup');
    const closeProfileBtn = document.querySelector('#closePopupBtn');

    // 프로필 아이콘 클릭 이벤트
    profileIcon?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('popupDim').style.display = 'block';
        profilePopup.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 배경 스크롤 방지

        // 팝업 초기화 - 처음 탭을 활성화
        const firstTabButton = profilePopup.querySelector('.tab-button');
        if (firstTabButton) {
            // 모든 탭 버튼 비활성화
            profilePopup.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });

            // 첫 번째 탭 버튼 활성화
            firstTabButton.classList.add('active');

            // 모든 탭 페인 비활성화
            profilePopup.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });

            // 첫 번째 탭 페인 활성화
            const firstTabId = firstTabButton.getAttribute('data-tab');
            profilePopup.querySelector(`#${firstTabId}`).classList.add('active');
        }
    });

    // 프로필 팝업 닫기 버튼
    closeProfileBtn?.addEventListener('click', () => {
        profilePopup.style.display = 'none';
        document.getElementById('popupDim').style.display = 'none';
        document.body.style.overflow = ''; // 배경 스크롤 복원
    });

    // 문서 클릭 시 팝업 닫기
    document.addEventListener('click', (e) => {
        // 팝업 딘 영역을 클릭한 경우는 처리하지 않음
        if (popupDim === e.target) {
            return;
        }

        // 프로필 팝업 처리
        const profileIconClicked = profileIcon?.contains(e.target);
        const profilePopupClicked = profilePopup?.contains(e.target);

        // 알림 아이콘 처리
        const alarmIconClicked = alarmIcon?.contains(e.target);

        // 아이콘이나 팝업 영역을 클릭하지 않은 경우에만 팝업 닫기
        if (!profileIconClicked && !profilePopupClicked && !alarmIconClicked) {
            // 프로필 팝업이 표시되어 있는지 확인
            const profilePopupVisible = profilePopup && profilePopup.style.display === 'block';

            // 프로필 팝업이 표시되어 있는 경우 닫기
            if (profilePopupVisible) {
                profilePopup.style.display = 'none';
                popupDim.style.display = 'none';
                document.body.style.overflow = ''; // 배경 스크롤 복원
            }
        }
    });

    // ✅ 커스텀 드롭다운(select-field) 작동 처리
    document.querySelectorAll('.dropdown-container').forEach(select => {
        const selectBox = select.querySelector('.dropdown-select');
        const optionsBox = select.querySelector('.dropdown-options');
        const valueBox = select.querySelector('.selected-value');

        // 드롭다운 열기/닫기 토글
        selectBox.addEventListener('click', (e) => {
            e.stopPropagation();

            document.querySelectorAll('.dropdown-container').forEach(other => {
                if (other !== select) {
                    other.classList.remove('open');
                    other.querySelector('.dropdown-options').style.display = 'none';
                }
            });

            const isOpen = select.classList.toggle('open');
            optionsBox.style.display = isOpen ? 'block' : 'none';
        });

        // 옵션 선택 처리
        optionsBox.querySelectorAll('.dropdown-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                valueBox.textContent = option.textContent;
                selectBox.classList.add('selected'); // ✅ 변경 포인트
                optionsBox.style.display = 'none';
                select.classList.remove('open');
            });
        });

        // 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (!select.contains(e.target)) {
                select.classList.remove('open');
                optionsBox.style.display = 'none';
            }
        });
    });

    // 탭 관리
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 탭 버튼이 속한 탭 그룹 찾기
            const tabGroup = button.closest('.tab-group');
            const tabContainer = tabGroup.closest('.tab-container');
            const tabContent = tabContainer.nextElementSibling;

            // 현재 탭 그룹의 모든 버튼 비활성화
            tabGroup.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });

            // 클릭한 버튼 활성화
            button.classList.add('active');

            // 해당 탭 콘텐츠 활성화
            const tabId = button.getAttribute('data-tab');

            // 모든 탭 페인 비활성화
            tabContent.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });

            // 해당 탭 페인 활성화
            tabContent.querySelector(`#${tabId}`).classList.add('active');
        });
    });

    // 차트 데이터
    const chartData = {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
        datasets: [{
            label: '월별 실적',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    // 차트 설정
    const chartConfig = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    // 차트 초기화 (canvas 요소가 있을 경우에만)
    const chartCanvas = document.querySelector('#performanceChart');
    if (chartCanvas) {
        new Chart(chartCanvas, chartConfig);
    }

    // 데이터 테이블 초기화
    const dataTable = document.querySelector('#dataTable');
    if (dataTable) {
        new DataTable(dataTable, {
            pageLength: 10,
            searching: true,
            ordering: true,
            responsive: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/ko.json'
            }
        });
    }

    // 폼 제출 처리
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 폼 데이터 수집
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // API 호출 시뮬레이션
            console.log('폼 데이터 전송:', data);
            alert('저장되었습니다.');
        });
    });

    // 모바일 반응형 처리
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');

        // 사이드바 상태에 따라 토글 버튼 아이콘 변경
        const toggleIcon = menuToggle.querySelector('.menu-toggle-icon');
        if (sidebar.classList.contains('mobile-open')) {
            toggleIcon.src = 'images/ic_close_24.png'; // 메뉴 닫기 아이콘
        } else {
            toggleIcon.src = 'images/ic_menu_24.png'; // 메뉴 열기 아이콘
        }
    });

    // 창 크기 변경 시 처리
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('mobile-open'); // 큰 화면에서는 사이드바 항상 표시

            // 햄버거 아이콘 제거
            const hamburgerIcon = document.querySelector('.hamburger-icon');
            if (hamburgerIcon) {
                hamburgerIcon.style.display = 'none';
            }
        } else {
            // 모바일 화면에서는 햄버거 아이콘 표시
            const hamburgerIcon = document.querySelector('.hamburger-icon');
            if (hamburgerIcon) {
                hamburgerIcon.style.display = 'flex';
            } else {
                // 햄버거 아이콘이 없는 경우 생성
                createHamburgerIcon();
            }
        }
    });

    // 페이지 로드 시 햄버거 아이콘 생성 함수 호출
    createHamburgerIcon();

    // 모바일 닫기 버튼 생성
    createMobileCloseButton();

    // 햄버거 아이콘 생성 함수
    function createHamburgerIcon() {
        if (!document.querySelector('.hamburger-icon')) {
            const hamburgerIcon = document.createElement('div');
            hamburgerIcon.className = 'hamburger-icon';

            // 이미지 요소 생성
            const imgElement = document.createElement('img');
            imgElement.src = 'images/ic_menu_mo_48.png';
            imgElement.alt = '햄버거 아이콘';
            imgElement.width = 48;
            imgElement.height = 48;

            // 이미지를 햄버거 아이콘 요소에 추가
            hamburgerIcon.appendChild(imgElement);

            // 문서에 햄버거 아이콘 추가
            document.body.appendChild(hamburgerIcon);

            // 햄버거 아이콘 클릭 이벤트
            hamburgerIcon.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');

                // 사이드바 상태에 따라 토글 버튼 아이콘 변경
                const toggleIcon = document.querySelector('.menu-toggle-icon');
                if (toggleIcon) {
                    if (sidebar.classList.contains('mobile-open')) {
                        toggleIcon.src = 'images/ic_close_24.png'; // 메뉴 닫기 아이콘
                        // 본문 스크롤 방지
                        document.body.style.overflow = 'hidden';
                    } else {
                        toggleIcon.src = 'images/ic_menu_24.png'; // 메뉴 열기 아이콘
                        // 본문 스크롤 허용
                        document.body.style.overflow = '';
                    }
                }

                // 이미지 소스 로그 출력 (디버깅용)
                console.log('Hamburger icon image source:', imgElement.src);
            });

            // 이미지 로드 오류 처리
            imgElement.onerror = function() {
                console.error('Failed to load hamburger icon image');
                // 이미지 로드 실패 시 텍스트로 대체
                hamburgerIcon.innerHTML = '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;background-color:#A42444;color:white;font-size:24px;">☰</div>';
            };
        }
    }

    // 모바일 닫기 버튼 생성 함수
    function createMobileCloseButton() {
        if (!document.querySelector('.mobile-close-btn')) {
            const closeButton = document.createElement('button');
            closeButton.className = 'mobile-close-btn';

            // 이미지 요소 생성
            const imgElement = document.createElement('img');
            imgElement.src = 'images/ic_close.png';
            imgElement.alt = '닫기 버튼';
            imgElement.width = 48;
            imgElement.height = 48;

            // 이미지를 닫기 버튼 요소에 추가
            closeButton.appendChild(imgElement);

            // 문서에 닫기 버튼 추가
            document.body.appendChild(closeButton);

            // 닫기 버튼 클릭 이벤트
            closeButton.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');

                // 사이드바 상태에 따라 토글 버튼 아이콘 변경
                const toggleIcon = document.querySelector('.menu-toggle-icon');
                if (toggleIcon) {
                    toggleIcon.src = 'images/ic_menu_24.png'; // 메뉴 열기 아이콘
                }

                // 본문 스크롤 허용
                document.body.style.overflow = '';
            });

            // 이미지 로드 오류 처리
            imgElement.onerror = function() {
                console.error('Failed to load close button image');
                // 이미지 로드 실패 시 텍스트로 대체
                closeButton.innerHTML = '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;color:black;font-size:24px;">×</div>';
            };
        }
    }

    // 초기 화면 로드 시 모바일 사이즈인 경우 햄버거 아이콘 생성
    if (window.innerWidth <= 768) {
        createHamburgerIcon();
    }

    // 로그아웃 처리
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn?.addEventListener('click', () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            // 로그아웃 처리 로직
            window.location.href = '/login.html';
        }
    });

    // 사용자 정보 관리
    const userInfo = {
        name: '홍길동',
        department: '개발팀',
        position: '팀장',
        email: 'hong@example.com'
    };

    // 사용자 정보 표시
    const userNameElements = document.querySelectorAll('.user-name');
    const userDeptElements = document.querySelectorAll('.user-department');

    userNameElements.forEach(el => {
        el.textContent = userInfo.name;
    });

    userDeptElements.forEach(el => {
        el.textContent = userInfo.department;
    });

    // 페이지별 초기화 함수
    function initializePage() {
        const currentPage = document.body.dataset.page;

        switch(currentPage) {
            case 'dashboard':
                initializeDashboard();
                break;
            case 'reports':
                initializeReports();
                break;
            case 'settings':
                initializeSettings();
                break;
        }
    }

    // 대시보드 초기화
    function initializeDashboard() {
        console.log('대시보드 초기화 완료');
    }

    // 리포트 페이지 초기화
    function initializeReports() {
        console.log('리포트 페이지 초기화 완료');
    }

    // 설정 페이지 초기화
    function initializeSettings() {
        console.log('설정 페이지 초기화 완료');
    }

    // 페이지 초기화 실행
    initializePage();
    // 연락처 하이픈 자동입력 및 유효성 검사
    document.querySelectorAll('.phone-field').forEach(input => {
        // 에러 메시지 요소 생성 및 초기 숨김 처리
        let errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = '올바른 연락처 형식이 아닙니다.';
        errorMessage.style.display = 'none';

        // 입력 필드 다음에 에러 메시지 요소 추가
        input.parentNode.appendChild(errorMessage);

        // 입력 이벤트 리스너
        input.addEventListener('input', function () {
            let numbersOnly = input.value.replace(/[^0-9]/g, '');
            let formatted = numbersOnly;

            // 하이픈 자동 추가
            if (numbersOnly.length === 11) {
                formatted = numbersOnly.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (numbersOnly.length === 10) {
                if (numbersOnly.startsWith('02')) {
                    formatted = numbersOnly.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                } else {
                    formatted = numbersOnly.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                }
            } else if (numbersOnly.length >= 7) {
                formatted = numbersOnly.replace(/(\d{3})(\d{3,4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
            }

            input.value = formatted;

            // 유효성 검사
            validatePhoneNumber(input);
        });

        // 포커스 아웃 이벤트에도 유효성 검사 추가
        input.addEventListener('blur', function() {
            validatePhoneNumber(input);
        });
    });

    // 연락처 유효성 검사 함수
    function validatePhoneNumber(input) {
        const value = input.value;
        const numbersOnly = value.replace(/[^0-9]/g, '');
        const errorMessage = input.parentNode.querySelector('.error-message');

        // 유효한 전화번호 패턴 검사
        // 1. 빈 값은 허용 (필수 입력이 아닌 경우)
        // 2. 10-11자리 숫자만 유효 (지역번호 포함)
        const isValid = value === '' || (numbersOnly.length >= 10 && numbersOnly.length <= 11);

        if (!isValid && value !== '') {
            // 유효하지 않은 경우 에러 표시
            input.classList.add('error');
            errorMessage.style.display = 'block';
        } else {
            // 유효한 경우 에러 제거
            input.classList.remove('error');
            errorMessage.style.display = 'none';
        }

        return isValid;
    }

    

    /**
     * 콘텐츠 헤더 초기화 함수
     */
    function initContentHeader() {
        initDropdowns();
        initDatePicker();
        initSearchButton();
    }

    /**
     * 드롭다운 메뉴 초기화
     */
    function initDropdowns() {
        // 드롭다운 토글 기능
        document.querySelectorAll('.dropdown-button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();

                console.log('버튼 클릭됨:', this.id);

                // 현재 버튼의 active 상태 토글
                this.classList.toggle('active');

                // 현재 버튼에 연결된 메뉴 찾기
                const menu = this.nextElementSibling;

                // 다른 모든 메뉴 닫기
                document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                    if (otherMenu !== menu) {
                        otherMenu.classList.remove('show');
                        otherMenu.previousElementSibling.classList.remove('active');
                    }
                });

                // 현재 메뉴 토글
                menu.classList.toggle('show');

                // date picker 팝업 닫기
                const datePickerPopup = document.querySelector('.date-picker-popup');
                if (datePickerPopup) {
                    datePickerPopup.remove();
                    document.querySelectorAll('.date-picker').forEach(picker => {
                        picker.classList.remove('active');
                    });
                }
            });
        });

        // 드롭다운 항목 선택 기능
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function(e) {
              e.stopPropagation();
          
              // 선택된 항목의 텍스트 가져오기
              const selectedText = this.textContent;
          
              // 드롭다운 버튼에 선택된 텍스트 설정
              const button = this.closest('.header-dropdown').querySelector('.dropdown-button');
          
              // ✅ 버튼 텍스트에 선택된 값만 표시
              button.innerHTML = '<span class="selected-value">' + selectedText + '</span>';
          
              // 선택된 값 저장
              button.setAttribute('data-value', selectedText);
          
              // 메뉴 닫기
              this.closest('.dropdown-menu').classList.remove('show');
              button.classList.remove('active');
          
              // 변경 이벤트 발생
              const changeEvent = new CustomEvent('dropdown-change', {
                detail: {
                  id: button.id,
                  value: selectedText
                }
              });
              document.dispatchEvent(changeEvent);
            });
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown-button')) {
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
                document.querySelectorAll('.dropdown-button').forEach(button => {
                    button.classList.remove('active');
                });
            }
        });
    }

    function initDatePicker() {
        document.querySelectorAll('.date-picker').forEach(picker => {
            picker.addEventListener('click', function(e) {
                e.stopPropagation();

                // 현재 picker의 active 상태 토글
                this.classList.toggle('active');

                // 기존 팝업 제거
                const existingPopup = document.querySelector('.date-picker-popup');
                if (existingPopup) {
                    existingPopup.remove();
                }

                // 드롭다운 메뉴 닫기
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
                document.querySelectorAll('.dropdown-button').forEach(button => {
                    button.classList.remove('active');
                });

                // 이미 active 상태가 아니면 팝업 생성 중단
                if (!this.classList.contains('active')) {
                    return;
                }

                // 날짜 선택 팝업 생성
                const popup = document.createElement('div');
                popup.className = 'date-picker-popup show';

                // 현재 날짜 정보 가져오기
                const today = new Date();
                const currentYear = today.getFullYear();
                const currentMonth = today.getMonth();
                const currentDate = today.getDate();

                // 달력 헤더 생성
                const calendarHeader = document.createElement('div');
                calendarHeader.className = 'calendar-header';

                const prevBtn = document.createElement('button');
                prevBtn.className = 'calendar-nav';
                prevBtn.innerHTML = '&lt;';
                prevBtn.setAttribute('data-action', 'prev');

                const calendarTitle = document.createElement('div');
                calendarTitle.className = 'calendar-title';
                calendarTitle.textContent = `${currentYear}년 ${currentMonth + 1}월`;
                calendarTitle.setAttribute('data-year', currentYear);
                calendarTitle.setAttribute('data-month', currentMonth);

                const nextBtn = document.createElement('button');
                nextBtn.className = 'calendar-nav';
                nextBtn.innerHTML = '&gt;';
                nextBtn.setAttribute('data-action', 'next');

                calendarHeader.appendChild(prevBtn);
                calendarHeader.appendChild(calendarTitle);
                calendarHeader.appendChild(nextBtn);

                // 달력 그리드 생성
                const calendarGrid = document.createElement('div');
                calendarGrid.className = 'calendar-grid';

                // 요일 헤더 추가
                const days = ['일', '월', '화', '수', '목', '금', '토'];
                days.forEach(day => {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day';
                    dayElement.textContent = day;
                    calendarGrid.appendChild(dayElement);
                });

                // 달력 날짜 생성 함수
                function generateCalendarDates(year, month) {
                    // 해당 월의 첫 날과 마지막 날
                    const firstDay = new Date(year, month, 1);
                    const lastDay = new Date(year, month + 1, 0);

                    // 첫 날의 요일 (0: 일요일, 6: 토요일)
                    const firstDayOfWeek = firstDay.getDay();

                    // 이전 달의 마지막 날
                    const prevMonthLastDay = new Date(year, month, 0).getDate();

                    // 달력에 표시할 날짜 배열
                    const dates = [];

                    // 이전 달의 날짜 추가
                    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                        dates.push({
                            date: prevMonthLastDay - i,
                            month: 'prev',
                            disabled: true
                        });
                    }

                    // 현재 달의 날짜 추가
                    for (let i = 1; i <= lastDay.getDate(); i++) {
                        dates.push({
                            date: i,
                            month: 'current',
                            disabled: false,
                            isToday: year === today.getFullYear() && month === today.getMonth() && i === today.getDate()
                        });
                    }

                    // 다음 달의 날짜 추가 (6주 채우기)
                    const remainingDays = 42 - dates.length;
                    for (let i = 1; i <= remainingDays; i++) {
                        dates.push({
                            date: i,
                            month: 'next',
                            disabled: true
                        });
                    }

                    return dates;
                }

                // 달력 날짜 렌더링
                function renderCalendarDates(year, month) {
                    // 기존 날짜 요소 제거
                    const dateElements = calendarGrid.querySelectorAll('.calendar-date');
                    dateElements.forEach(el => el.remove());

                    // 새 날짜 생성 및 추가
                    const dates = generateCalendarDates(year, month);
                    dates.forEach(dateObj => {
                        const dateElement = document.createElement('div');
                        dateElement.className = 'calendar-date';
                        dateElement.textContent = dateObj.date;

                        if (dateObj.disabled) {
                            dateElement.classList.add('disabled');
                        }

                        if (dateObj.isToday) {
                            dateElement.classList.add('today');
                        }

                        // 선택된 날짜 표시
                        const selectedValue = picker.getAttribute('data-value');
                        if (selectedValue) {
                            const selectedDate = new Date(selectedValue);
                            if (
                                selectedDate.getFullYear() === year &&
                                selectedDate.getMonth() === month &&
                                selectedDate.getDate() === dateObj.date &&
                                dateObj.month === 'current'
                            ) {
                                dateElement.classList.add('selected');
                            }
                        }

                        // 날짜 클릭 이벤트
                        if (!dateObj.disabled) {
                            dateElement.addEventListener('click', function () {
                                // 선택된 날짜 설정
                                const selectedDate = new Date(year, month, dateObj.date);
                                const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateObj.date).padStart(2, '0')}`;
                        
                                // data-value 속성에 선택된 날짜 저장
                                picker.setAttribute('data-value', formattedDate);
                        
                                // ✅ 선택된 날짜를 텍스트로 표시
                                picker.textContent = formattedDate;
                        
                                // 팝업 닫기
                                popup.remove();
                                picker.classList.remove('active');
                        
                                // 변경 이벤트 발생
                                const changeEvent = new CustomEvent('date-change', {
                                    detail: {
                                        element: picker,
                                        value: formattedDate
                                    }
                                });
                                document.dispatchEvent(changeEvent);
                            });
                        }

                        calendarGrid.appendChild(dateElement);
                    });
                }

                // 초기 달력 렌더링
                renderCalendarDates(currentYear, currentMonth);

                // 이전/다음 달 버튼 이벤트
                prevBtn.addEventListener('click', function() {
                    let year = parseInt(calendarTitle.getAttribute('data-year'));
                    let month = parseInt(calendarTitle.getAttribute('data-month'));

                    month--;
                    if (month < 0) {
                        month = 11;
                        year--;
                    }

                    calendarTitle.setAttribute('data-year', year);
                    calendarTitle.setAttribute('data-month', month);
                    calendarTitle.textContent = `${year}년 ${month + 1}월`;

                    renderCalendarDates(year, month);
                });

                nextBtn.addEventListener('click', function() {
                    let year = parseInt(calendarTitle.getAttribute('data-year'));
                    let month = parseInt(calendarTitle.getAttribute('data-month'));

                    month++;
                    if (month > 11) {
                        month = 0;
                        year++;
                    }

                    calendarTitle.setAttribute('data-year', year);
                    calendarTitle.setAttribute('data-month', month);
                    calendarTitle.textContent = `${year}년 ${month + 1}월`;

                    renderCalendarDates(year, month);
                });

                // 달력 푸터 생성
                const calendarFooter = document.createElement('div');
                calendarFooter.className = 'calendar-footer';

                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'calendar-btn cancel';
                cancelBtn.textContent = '취소';
                cancelBtn.addEventListener('click', function() {
                    popup.remove();
                    picker.classList.remove('active');
                });

                const confirmBtn = document.createElement('button');
                confirmBtn.className = 'calendar-btn';
                confirmBtn.textContent = '확인';
                confirmBtn.addEventListener('click', function() {
                    popup.remove();
                    picker.classList.remove('active');
                });

                calendarFooter.appendChild(cancelBtn);
                calendarFooter.appendChild(confirmBtn);

                // 팝업에 요소 추가
                popup.appendChild(calendarHeader);
                popup.appendChild(calendarGrid);
                popup.appendChild(calendarFooter);

                // 팝업 위치 설정 및 표시
                document.body.appendChild(popup);

                function positionDatePickerPopup(popup, picker) {
                    const popupWidth = popup.offsetWidth;
                    const pickerRect = picker.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                
                    let left = pickerRect.left + window.scrollX;
                    let top = pickerRect.bottom + window.scrollY;
                
                    if (left + popupWidth > viewportWidth) {
                        left = viewportWidth - popupWidth - 10;
                        if (left < 0) left = 0;
                    }
                
                    popup.style.position = 'absolute';
                    popup.style.left = `${left}px`;
                    popup.style.top = `${top}px`;
                }
                
                positionDatePickerPopup(popup, picker);
                
                // ✅ 화면 크기 변경 시 팝업 위치 재조정
                window.addEventListener('resize', () => {
                    if (document.body.contains(popup)) {
                        positionDatePickerPopup(popup, picker);
                    }
                });
            
                // 문서 클릭 시 팝업 닫기
                document.addEventListener('click', function closePopup(e) {
                    if (!popup.contains(e.target) && e.target !== picker) {
                        popup.remove();
                        picker.classList.remove('active');
                        document.removeEventListener('click', closePopup);
                    }
                });
            });
        });
    }

    /**
     * 검색 버튼 기능 초기화
     */
    function initSearchButton() {
        document.querySelectorAll('.search-button').forEach(button => {
            button.addEventListener('click', function() {
                // 검색 기능 구현
                const searchParams = collectSearchParams();
                console.log('검색 파라미터:', searchParams);

                // 검색 이벤트 발생
                const searchEvent = new CustomEvent('content-search', {
                    detail: searchParams
                });
                document.dispatchEvent(searchEvent);
            });
        });
    }

    /**
     * 검색 파라미터 수집 함수
     * @returns {Object} 검색 파라미터 객체
     */
    function collectSearchParams() {
        const params = {};

        // 입력 필드 값
        const inputField = document.querySelector('.header-input');
        if (inputField) {
            params.keyword = inputField.value;
        }

        // 드롭다운 선택 값
        document.querySelectorAll('.dropdown-button').forEach(button => {
            if (button.getAttribute('data-value')) {
                params[button.id] = button.getAttribute('data-value');
            }
        });

        // 날짜 선택 값
        const datePicker = document.querySelector('.date-picker');
        if (datePicker && datePicker.getAttribute('data-value')) {
            params.date = datePicker.getAttribute('data-value');
        }

        return params;
    }

    /**
     * 콘텐츠 헤더 생성 함수
     * @param {Object} options 헤더 옵션
     * @returns {HTMLElement} 생성된 헤더 요소
     */
    function createContentHeader(options = {}) {
        const headerContainer = document.createElement('div');
        headerContainer.className = 'content-header';

        // 기본 옵션
        const defaultOptions = {
            showInput: true,
            inputPlaceholder: '프로젝트명을 입력해 주세요',
            dropdowns: [
                { id: 'project-dropdown', label: '프로젝트명', items: ['프로젝트명 노출'] },
                { id: 'department-dropdown', label: '담당자', items: ['홍길동', '김철수'] }
            ],
            showDatePicker: true,
            showSearchButton: true
        };

        // 옵션 병합
        const mergedOptions = { ...defaultOptions, ...options };

        // 입력 필드 추가
        if (mergedOptions.showInput) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'header-input';
            input.placeholder = mergedOptions.inputPlaceholder;
            headerContainer.appendChild(input);
        }

        // 드롭다운 추가
        mergedOptions.dropdowns.forEach(dropdown => {
            const dropdownContainer = document.createElement('div');
            dropdownContainer.className = 'header-dropdown';

            const button = document.createElement('button');
            button.className = 'dropdown-button';
            button.id = dropdown.id;
            button.setAttribute('data-label', dropdown.label);
            button.textContent = dropdown.label;

            const menu = document.createElement('div');
            menu.className = 'dropdown-menu';
            menu.id = dropdown.id + '-menu';

            dropdown.items.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'dropdown-item';
                menuItem.textContent = item;
                menu.appendChild(menuItem);
            });

            dropdownContainer.appendChild(button);
            dropdownContainer.appendChild(menu);
            headerContainer.appendChild(dropdownContainer);
        });

        // 날짜 선택 추가
        if (mergedOptions.showDatePicker) {
            const datePicker = document.createElement('div');
            datePicker.className = 'date-picker';
            datePicker.setAttribute('data-value', '');
            headerContainer.appendChild(datePicker);
        }

        // 검색 버튼 추가
        if (mergedOptions.showSearchButton) {
            const searchButton = document.createElement('button');
            searchButton.className = 'search-button';
            searchButton.textContent = '검색';
            headerContainer.appendChild(searchButton);
        }

        return headerContainer;
    }

    // 전역 스코프에 함수 노출
    window.createContentHeader = createContentHeader;

    // 페이지네이션 초기화 함수
    function initPagination() {
        // 테이블 콘텐츠 요소 찾기
        const tableContents = document.querySelectorAll('.table-content');
        if (!tableContents.length) return;

        // 각 테이블 콘텐츠에 페이지네이션 추가
        tableContents.forEach(tableContent => {
            // 이미 페이지네이션이 있는지 확인
            if (tableContent.querySelector('.pagination')) return;

            // 페이지네이션 요소 생성
            const paginationElement = document.createElement('div');
            paginationElement.className = 'pagination';

            // 왼쪽 화살표
            const leftArrow = document.createElement('div');
            leftArrow.className = 'pagination-arrow';
            leftArrow.innerHTML = '&#10094;';
            paginationElement.appendChild(leftArrow);

            // 페이지 번호 (1~5)
            for (let i = 1; i <= 5; i++) {
                const pageItem = document.createElement('div');
                pageItem.className = 'pagination-item';
                if (i === 1) pageItem.classList.add('active');
                pageItem.textContent = i;
                paginationElement.appendChild(pageItem);
            }

            // 생략 부호
            const ellipsis = document.createElement('div');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            paginationElement.appendChild(ellipsis);

            // 마지막 페이지
            const lastPage = document.createElement('div');
            lastPage.className = 'pagination-item';
            lastPage.textContent = '888';
            paginationElement.appendChild(lastPage);

            // 오른쪽 화살표
            const rightArrow = document.createElement('div');
            rightArrow.className = 'pagination-arrow';
            rightArrow.innerHTML = '&#10095;';
            paginationElement.appendChild(rightArrow);

            // 테이블 콘텐츠에 페이지네이션 추가
            tableContent.appendChild(paginationElement);

            // 페이지네이션 이벤트 처리
            const paginationItems = paginationElement.querySelectorAll('.pagination-item');
            paginationItems.forEach(item => {
                item.addEventListener('click', function() {
                    // 현재 활성화된 페이지 아이템에서 active 클래스 제거
                    paginationElement.querySelector('.pagination-item.active').classList.remove('active');
                    // 클릭한 페이지 아이템에 active 클래스 추가
                    this.classList.add('active');

                    // 여기에 페이지 변경 로직 추가 (예: 데이터 로드)
                    console.log('페이지 변경:', this.textContent);

                    // 페이지 변경 이벤트 발생
                    const event = new CustomEvent('page-change', {
                        detail: {
                            page: parseInt(this.textContent)
                        }
                    });
                    document.dispatchEvent(event);
                });
            });

            // 화살표 버튼 이벤트 처리
            const paginationArrows = paginationElement.querySelectorAll('.pagination-arrow');
            paginationArrows.forEach(arrow => {
                arrow.addEventListener('click', function() {
                    const currentPage = parseInt(paginationElement.querySelector('.pagination-item.active').textContent);
                    let newPage;

                    // 왼쪽 화살표인 경우 이전 페이지로, 오른쪽 화살표인 경우 다음 페이지로 이동
                    if (this.innerHTML === '&#10094;') {
                        newPage = Math.max(1, currentPage - 1);
                    } else {
                        newPage = Math.min(888, currentPage + 1);
                    }

                    // 페이지 아이템 중에서 새 페이지 번호와 일치하는 항목 찾기
                    const newPageItem = Array.from(paginationItems).find(item => parseInt(item.textContent) === newPage);

                    // 해당 페이지 아이템이 있으면 클릭 이벤트 발생
                    if (newPageItem) {
                        newPageItem.click();
                    } else {
                        // 페이지 아이템이 없는 경우 (예: 6, 7, 8 등) 페이지네이션 업데이트
                        updatePagination(paginationElement, newPage);
                    }
                });
            });
        });
    }

    //날짜 입력필드 인풋
    function initPopupDateInputs() {
        document.querySelectorAll('.date-input').forEach(input => {
            input.addEventListener('click', function(e) {
                e.stopPropagation();
    
                const existing = document.querySelector('.date-picker-popup');
                if (existing) existing.remove();
    
                const popup = document.createElement('div');
                popup.className = 'date-picker-popup show';
    
                const today = new Date();
                let selectedDate = null;
    
                function renderCalendar(year, month) {
                    popup.innerHTML = '';
    
                    const header = document.createElement('div');
                    header.className = 'calendar-header';
    
                    const prevBtn = document.createElement('button');
                    prevBtn.textContent = '<';
                    prevBtn.addEventListener('click', () => {
                        if (month === 0) {
                            month = 11;
                            year--;
                        } else {
                            month--;
                        }
                        renderCalendar(year, month);
                    });
    
                    const nextBtn = document.createElement('button');
                    nextBtn.textContent = '>';
                    nextBtn.addEventListener('click', () => {
                        if (month === 11) {
                            month = 0;
                            year++;
                        } else {
                            month++;
                        }
                        renderCalendar(year, month);
                    });
    
                    const title = document.createElement('span');
                    title.textContent = `${year}년 ${month + 1}월`;
    
                    header.appendChild(prevBtn);
                    header.appendChild(title);
                    header.appendChild(nextBtn);
                    popup.appendChild(header);
    
                    const grid = document.createElement('div');
                    grid.className = 'calendar-grid';
                    ['일','월','화','수','목','금','토'].forEach(d => {
                        const day = document.createElement('div');
                        day.className = 'calendar-day';
                        day.textContent = d;
                        grid.appendChild(day);
                    });
    
                    const firstDay = new Date(year, month, 1).getDay();
                    const lastDate = new Date(year, month + 1, 0).getDate();
    
                    for (let i = 0; i < firstDay; i++) {
                        const empty = document.createElement('div');
                        grid.appendChild(empty);
                    }
    
                    for (let d = 1; d <= lastDate; d++) {
                        const cell = document.createElement('div');
                        cell.className = 'calendar-date';
                        cell.textContent = d;
    
                        cell.addEventListener('click', () => {
                            selectedDate = new Date(year, month, d);
                            input.value = selectedDate.toISOString().slice(0,10);
                            input.classList.add('activated');
                            popup.remove();
                        });
    
                        grid.appendChild(cell);
                    }
    
                    popup.appendChild(grid);
                }
    
                renderCalendar(today.getFullYear(), today.getMonth());
    
                const rect = input.getBoundingClientRect();
                popup.style.position = 'fixed';
                popup.style.top = `${rect.bottom}px`;
                popup.style.left = `${rect.left}px`;
                document.body.appendChild(popup);
    
                document.addEventListener('click', function handler(ev) {
                    if (!popup.contains(ev.target) && ev.target !== input) {
                        popup.remove();
                        document.removeEventListener('click', handler);
                    }
                });
            });
        });
    }
    
    // ✅ 파일 업로드 처리 로직 추가
  const fileInput = document.getElementById('fileInput');
  const fileList = document.querySelector('.uploaded-file-list');

  if (fileInput && fileList) {
    fileInput.addEventListener('change', function (e) {
      const files = Array.from(e.target.files);

      files.forEach(file => {
        const uploadedEl = document.createElement('div');
        uploadedEl.className = 'uploaded-file';

        uploadedEl.innerHTML = `
          <div class="file-icon"></div>
          <div class="file-name">${file.name}</div>
          <button type="button" class="remove-file" title="삭제"></button>
        `;

        uploadedEl.querySelector('.remove-file').addEventListener('click', () => {
          uploadedEl.remove();
        });

        fileList.appendChild(uploadedEl);
      });

      // label 텍스트 변경
      const label = document.querySelector('.file-upload-box .file-name');
      if (label) label.textContent = files[0]?.name || '파일을 선택해주세요';
    });
  }

    // 페이지네이션 업데이트 함수
    function updatePagination(paginationElement, currentPage) {
        const totalPages = 888; // 총 페이지 수
        const paginationItems = paginationElement.querySelectorAll('.pagination-item');

        // 현재 페이지가 1~5 사이인 경우
        if (currentPage <= 5) {
            for (let i = 0; i < 5; i++) {
                paginationItems[i].textContent = i + 1;
                paginationItems[i].classList.remove('active');
                if (i + 1 === currentPage) {
                    paginationItems[i].classList.add('active');
                }
            }
        }
        // 현재 페이지가 마지막 페이지인 경우
        else if (currentPage === totalPages) {
            paginationItems[paginationItems.length - 1].classList.add('active');
        }
        // 그 외의 경우
        else {
            // 페이지 번호 업데이트 (현재 페이지 중심으로 -2, -1, 0, +1, +2)
            for (let i = 0; i < 5; i++) {
                const pageNum = currentPage - 2 + i;
                if (pageNum > 0 && pageNum < totalPages) {
                    paginationItems[i].textContent = pageNum;
                    paginationItems[i].classList.remove('active');
                    if (pageNum === currentPage) {
                        paginationItems[i].classList.add('active');
                    }
                }
            }
        }

        // 페이지 변경 이벤트 발생
        const event = new CustomEvent('page-change', {
            detail: {
                page: currentPage
            }
        });
        document.dispatchEvent(event);
    }

    // 페이지 로드 시 페이지네이션 초기화
    initPagination();

    //날짜 입력 필드 인풋
    initPopupDateInputs();

    document.querySelectorAll('.date-input').forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.classList.add('activated');
            } else {
                input.classList.remove('activated');
            }
        }); // ← 닫는 중괄호 추가
    }); // ← forEach 닫는 중괄호 추가

    document.querySelectorAll('.select-field').forEach(select => {
        const input = select.querySelector('.select-input');
        const options = select.querySelectorAll('.select-option');
      
    // 토글 드롭다운 열기
        input.addEventListener('click', () => {
          document.querySelectorAll('.select-field').forEach(f => {
            if (f !== select) f.classList.remove('open');
          });
          select.classList.toggle('open');
     });
      
     // 옵션 선택
        options.forEach(option => {
          option.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            input.value = option.textContent;
            input.classList.add('activated');
            select.classList.remove('open');
          });
    });
      
    // 외부 클릭 시 닫기
        document.addEventListener('click', e => {
          if (!select.contains(e.target)) {
            select.classList.remove('open');
          }
    });

    console.log('open-popup-btn 개수:', document.querySelectorAll('.open-popup-btn').length);

    //솔리드 버튼 누를때 팝업 닫기
    document.querySelectorAll('.popup-close-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          const popup = this.closest('[id^="popup-"]'); // id가 'popup-'으로 시작하는 부모 팝업 찾기
          const dim = document.getElementById('popupDim');
      
          if (popup) popup.style.display = 'none';
          if (dim) dim.style.display = 'none';
          document.body.style.overflow = '';
        });
    });

    // ✅ 공통 팝업 열기 버튼 처리
    document.querySelectorAll('.open-popup-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const targetId = this.dataset.popupTarget;
            const popup = document.getElementById(targetId);
            const dim = document.getElementById('popupDim');

            if (popup && dim) {
                popup.style.display = 'block';
                dim.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
});
// ✅ 이거 반드시 들어가야 함
});
