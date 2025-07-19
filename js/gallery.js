/**
 * Галерея изображений с модальными окнами
 * 
 * ТРЕБОВАНИЯ ДЛЯ РАБОТЫ:
 * 1. Bootstrap 5.3+ CSS и JS должны быть подключены
 * 2. В HTML должно быть модальное окно с id="galleryModal" 
 * 3. Внутри модального окна нужны элементы:
 *    - #modalCarousel - контейнер карусели
 *    - #modalCarouselInner - внутренний контейнер слайдов
 *    - #modalCarouselIndicators - контейнер индикаторов
 * 4. Кнопки галереи должны иметь onclick="openGallery('carousel-id')"
 * 5. Изображения в каруселях должны быть внутри .carousel-item
 * 
 * ФУНКЦИИ:
 * - openGallery(carouselId) - открыть галерею для конкретной карусели
 * - showModalGallery(images, startIndex) - показать модальное окно
 * - closeGallery() - закрыть галерею
 * 
 * УПРАВЛЕНИЕ:
 * - Клик по фону модального окна - закрытие
 * - ESC - закрытие
 * - Стрелки влево/вправо - навигация по слайдам
 */

let modalCarousel = null;

// Функция для одиночных изображений
function openSingleImageGallery(imageWrapperId) {
	const imageWrapper = document.getElementById(imageWrapperId);
	if (!imageWrapper) return;

	const mainImg = imageWrapper.querySelector('img:not(.zoom-icon)');
	if (!mainImg) return;

	const images = [
		{
			src: mainImg.src,
			alt: mainImg.alt || 'Изображение',
		},
	];

	showModalGallery(images, 0);
}


function openGallery(carouselId) {
	// Получаем карусель по ID
	const carousel = document.getElementById(carouselId);
	if (!carousel) return;

	// Собираем только основные изображения (исключаем иконки zoom)
	const images = [];
	const carouselItems = carousel.querySelectorAll('.carousel-item');

	carouselItems.forEach((item, index) => {
		// Ищем основное изображение в каждом слайде (не zoom иконку)
		const mainImg = item.querySelector('img:not(.zoom-icon)');
		if (
			mainImg &&
			mainImg.src &&
			!mainImg.src.includes('zoom') &&
			!mainImg.classList.contains('zoom-icon')
		) {
			images.push({
				src: mainImg.src,
				alt: mainImg.alt || `Изображение ${index + 1}`,
			});
		}
	});

	// Определяем текущий активный слайд
	const activeItem = carousel.querySelector('.carousel-item.active');
	const allItems = carousel.querySelectorAll('.carousel-item');
	let currentIndex = 0;

	for (let i = 0; i < allItems.length; i++) {
		if (allItems[i] === activeItem) {
			currentIndex = i;
			break;
		}
	}

	// Открываем модальное окно с этими изображениями
	showModalGallery(images, currentIndex);
}

function showModalGallery(images, startIndex = 0) {
	if (images.length === 0) return;

	const modal = document.getElementById('galleryModal');
	const carouselInner = document.getElementById('modalCarouselInner');
	const indicators = document.getElementById('modalCarouselIndicators');

	// Очищаем предыдущий контент
	carouselInner.innerHTML = '';
	indicators.innerHTML = '';

	// Создаем слайды
	images.forEach((image, index) => {
		const slide = document.createElement('div');
		slide.className = `carousel-item h-100 ${index === startIndex ? 'active' : ''}`;
		slide.innerHTML = `
			<div class="row align-items-center h-100">
				<div class="col text-center">
					<img
						src="${image.src}"
						class="img-fluid"
						loading="lazy"
						alt="${image.alt}"
					/>
					<p style="color: #c8c8c8; margin-top: 1rem;">${image.alt}</p>
				</div>
			</div>
		`;
		carouselInner.appendChild(slide);

		// Создаем индикатор только если изображений больше одного
		if (images.length > 1) {
			const indicator = document.createElement('button');
			indicator.type = 'button';
			indicator.setAttribute('data-bs-target', '#modalCarousel');
			indicator.setAttribute('data-bs-slide-to', index);
			indicator.setAttribute('aria-label', `Slide ${index + 1}`);
			if (index === startIndex) {
				indicator.className = 'active';
				indicator.setAttribute('aria-current', 'true');
			}
			indicators.appendChild(indicator);
		}
	});

	// Скрываем элементы навигации если только одно изображение
	const prevButton = modal.querySelector('.carousel-control-prev');
	const nextButton = modal.querySelector('.carousel-control-next');

	if (images.length <= 1) {
		indicators.style.display = 'none';
		prevButton.style.display = 'none';
		nextButton.style.display = 'none';
	} else {
		indicators.style.display = '';
		prevButton.style.display = '';
		nextButton.style.display = '';
	}

	// Показываем модальное окно
	modal.style.display = 'block';
	document.body.style.overflow = 'hidden';

	// Уничтожаем предыдущий экземпляр карусели
	if (modalCarousel) {
		modalCarousel.dispose();
		modalCarousel = null;
	}

	// Небольшая задержка для корректной инициализации
	setTimeout(() => {
		// Инициализируем Bootstrap carousel
		modalCarousel = new bootstrap.Carousel(
			document.getElementById('modalCarousel'),
			{
				ride: false,
				interval: false,
				wrap: true,
			},
		);

		// Переходим к нужному слайду
		if (startIndex > 0) {
			modalCarousel.to(startIndex);
		}
	}, 100);
}

function closeGallery() {
	const modal = document.getElementById('galleryModal');
	modal.style.display = 'none';
	document.body.style.overflow = '';

	if (modalCarousel) {
		modalCarousel.dispose();
		modalCarousel = null;
	}
}

// Инициализация событий после загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
	// Закрытие по клику на фон
	const galleryModal = document.getElementById('galleryModal');
	if (galleryModal) {
		galleryModal.addEventListener('click', function (e) {
			if (e.target === this) {
				closeGallery();
			}
		});
	}

	// Обработка клавиш для модального окна
	document.addEventListener('keydown', function (e) {
		const modal = document.getElementById('galleryModal');
		const isModalOpen = modal && modal.style.display === 'block';

		if (!isModalOpen) return;

		switch (e.key) {
			case 'Escape':
				closeGallery();
				break;
			case 'ArrowLeft':
				e.preventDefault();
				if (modalCarousel) {
					modalCarousel.prev();
				}
				break;
			case 'ArrowRight':
				e.preventDefault();
				if (modalCarousel) {
					modalCarousel.next();
				}
				break;
		}
	});
});