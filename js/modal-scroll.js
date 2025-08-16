// Настройки системы
const modalConfig = {
    // ID вашего модального окна
    modalId: 'splitModal-2',
    
    // На каком % скролла показывать (0.5 = 50%)
    scrollThreshold: 0.5,
    
    // Пауза между показами в часах
    cooldownHours: 12
};

// Переменные состояния
let hasShownModal = false;

// Инициализация системы
function initScrollModals() {
    window.addEventListener('scroll', handleScroll);
    bindModalCloseEvent();
    console.log('Система автопоказа модального окна активирована');
}

// Обработчик скролла
function handleScroll() {
    const scrollPercentage = getScrollPercentage();
    
    if (scrollPercentage >= modalConfig.scrollThreshold && 
        !hasShownModal && 
        canShowModal()) {
        showModal();
    }
}

// Вычисление процента скролла
function getScrollPercentage() {
    const scrollTop = window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(scrollTop / documentHeight, 1);
}

// Проверка можно ли показать модальное окно
function canShowModal() {
    const lastShownTime = localStorage.getItem(`modal_last_shown_${modalConfig.modalId}`);
    
    if (!lastShownTime) return true;
    
    const timeDifference = Date.now() - parseInt(lastShownTime);
    const cooldownTime = modalConfig.cooldownHours * 60 * 60 * 1000;
    
    return timeDifference >= cooldownTime;
}

// Показ модального окна
function showModal() {
    const modalElement = document.getElementById(modalConfig.modalId);
    
    if (modalElement && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        hasShownModal = true;
        console.log(`Показано модальное окно: ${modalConfig.modalId}`);
    }
}

// Обработка закрытия модального окна
function bindModalCloseEvent() {
    const modalElement = document.getElementById(modalConfig.modalId);
    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', function() {
            handleModalClose();
        });
    }
}

// Обработка закрытия модального окна
function handleModalClose() {
    // Сохраняем время закрытия
    localStorage.setItem(`modal_last_shown_${modalConfig.modalId}`, Date.now().toString());
    hasShownModal = false;
    
    console.log(`Модальное окно ${modalConfig.modalId} закрыто. Следующий показ через ${modalConfig.cooldownHours} часов.`);
}

// Функции для тестирования
function resetModalTimers() {
    localStorage.removeItem(`modal_last_shown_${modalConfig.modalId}`);
    hasShownModal = false;
    console.log('Таймер модального окна сброшен');
}

function showModalNow() {
    hasShownModal = false;
    showModal();
}

function getModalStatus() {
    console.log('Текущее состояние системы:');
    console.log('- Показано в этой сессии:', hasShownModal);
    console.log('- Можно показать сейчас:', canShowModal());
    
    const lastShown = localStorage.getItem(`modal_last_shown_${modalConfig.modalId}`);
    if (lastShown) {
        const timePassed = Math.floor((Date.now() - parseInt(lastShown)) / (1000 * 60 * 60));
        console.log(`- ${modalConfig.modalId}: последний показ ${timePassed} часов назад`);
    } else {
        console.log(`- ${modalConfig.modalId}: еще не показывался`);
    }
}

// Запуск системы после загрузки DOM
document.addEventListener('DOMContentLoaded', initScrollModals);