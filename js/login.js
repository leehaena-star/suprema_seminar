// 입력 필드 상태 관리
const inputFields = document.querySelectorAll('.input-field');

inputFields.forEach(field => {
    // 포커스 이벤트
    field.addEventListener('focus', () => {
        // 이미 에러 상태인 경우 에러 표시 제거
        field.classList.remove('error');
    });
    
    // 값 변경 이벤트
    field.addEventListener('input', () => {
        if (field.value.trim() !== '') {
            field.classList.add('activated');
        } else {
            field.classList.remove('activated');
        }
    });
    
    // 포커스 아웃 이벤트
    field.addEventListener('blur', () => {
        if (field.value.trim() === '' && field.required) {
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
});

// 폼 제출 이벤트
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let hasError = false;
    
    inputFields.forEach(field => {
        if (field.value.trim() === '' && field.required) {
            field.classList.add('error');
            hasError = true;
        }
    });
    
    if (!hasError) {
        // 여기에 로그인 로직 추가
        console.log('Login submitted');
        // 예시: window.location.href = 'index.html';
    }
});
