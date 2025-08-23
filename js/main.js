console.log('JavaScript файл main.js завантажено')

// Функціональність для табів на сторінці замовлень
function initOrdersTabs() {
	const tabs = document.querySelectorAll('.orders__tab')
	const contents = document.querySelectorAll('.orders__content')

	tabs.forEach(tab => {
		tab.addEventListener('click', () => {
			const targetTab = tab.dataset.tab

			// Видаляємо активний клас з усіх табів
			tabs.forEach(t => t.classList.remove('orders__tab--active'))
			contents.forEach(c => c.classList.remove('orders__content--active'))

			// Додаємо активний клас до поточного таба та контенту
			tab.classList.add('orders__tab--active')
			const targetContent = document.querySelector(
				`[data-content="${targetTab}"]`
			)
			if (targetContent) {
				targetContent.classList.add('orders__content--active')
			}
		})
	})
}

// Глобальна функція для перевірки email
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

// Робимо функцію глобальною для використання в інших місцях
window.isValidEmail = isValidEmail

// Функція для оновлення іконки валюти
function updateCurrencyIcon(selectElement, iconContainer) {
	const selectedValue = selectElement.value
	const iconPath = `./uploads/SimpleExchange/images/${selectedValue}.svg`
	const iconImg = iconContainer.querySelector('.swapper__select-currency-icon')

	if (iconImg) {
		iconImg.src = iconPath
		iconImg.alt = selectedValue.toUpperCase()
	}
}

// Функція для роботи з currency overlay
function initCurrencyOverlay() {
	const selectWrappers = document.querySelectorAll('.swapper__select-wrapper')
	console.log('Знайдено selectWrappers:', selectWrappers.length)

	selectWrappers.forEach((wrapper, index) => {
		const overlay = wrapper.querySelector('.currency__overlay')
		const arrow = wrapper.querySelector('.swapper__select-arrow')
		const searchInput = wrapper.querySelector('.currency__search-input')
		const currencyItems = wrapper.querySelectorAll('.currency__item')
		const iconContainer = wrapper.querySelector('.swapper__select-icon')

		console.log(`Wrapper ${index}:`, {
			overlay: !!overlay,
			arrow: !!arrow,
			searchInput: !!searchInput,
			currencyItems: currencyItems.length,
			iconContainer: !!iconContainer,
		})

		if (!overlay) {
			console.log(`Wrapper ${index}: overlay не знайдено`)
			return
		}

		// Додаємо стилі для позиціонування
		overlay.style.position = 'absolute'
		overlay.style.top = '100%'
		overlay.style.left = '0'
		overlay.style.zIndex = '9999'

		// Відкриття/закриття overlay при кліку на wrapper
		wrapper.addEventListener('click', e => {
			console.log('Клік на wrapper', index)
			e.preventDefault()
			e.stopPropagation()

			const isActive = overlay.classList.contains('active')

			// Закриваємо всі інші overlay
			document.querySelectorAll('.currency__overlay.active').forEach(ol => {
				if (ol !== overlay) {
					ol.classList.remove('active')
					console.log('Закриваємо інший overlay')
					// Повертаємо стрілки інших wrapper'ів
					const otherArrow = ol
						.closest('.swapper__select-wrapper')
						?.querySelector('.swapper__select-arrow')
					if (otherArrow) {
						otherArrow.style.transform = 'translateY(-50%) rotate(0deg)'
					}
				}
			})

			// Переключаємо поточний overlay
			if (isActive) {
				overlay.classList.remove('active')
			} else {
				overlay.classList.add('active')
			}

			console.log('Overlay активний:', overlay.classList.contains('active'))

			// Анімація стрілки
			if (arrow) {
				arrow.style.transform = overlay.classList.contains('active')
					? 'translateY(-50%) rotate(180deg)'
					: 'translateY(-50%) rotate(0deg)'
			}

			// Фокус на пошукове поле при відкритті
			if (!isActive && searchInput) {
				setTimeout(() => searchInput.focus(), 100)
			}
		})

		// Запобігаємо закриттю overlay при кліку всередині нього
		overlay.addEventListener('click', e => {
			e.stopPropagation()
			console.log('Клік всередині overlay')
		})

		// Закриття overlay при кліку поза ним
		document.addEventListener('click', e => {
			if (!wrapper.contains(e.target)) {
				overlay.classList.remove('active')
				console.log('Закриваємо overlay при кліку поза ним')
				// Повертаємо стрілку в початкове положення
				if (arrow) {
					arrow.style.transform = 'translateY(-50%) rotate(0deg)'
				}
			}
		})

		// Закриття overlay при натисканні Escape
		document.addEventListener('keydown', e => {
			if (e.key === 'Escape' && overlay.classList.contains('active')) {
				overlay.classList.remove('active')
				console.log('Закриваємо overlay при натисканні Escape')
				// Повертаємо стрілку в початкове положення
				if (arrow) {
					arrow.style.transform = 'translateY(-50%) rotate(0deg)'
				}
			}
		})

		// Пошук по криптовалютах
		if (searchInput) {
			searchInput.addEventListener('input', e => {
				const searchTerm = e.target.value.toLowerCase()
				console.log('Пошук:', searchTerm)

				currencyItems.forEach(item => {
					const name = item
						.querySelector('.currency__text')
						?.textContent.toLowerCase()

					if (name && name.includes(searchTerm)) {
						item.style.display = 'flex'
					} else {
						item.style.display = 'none'
					}
				})
			})
		}

		// Вибір криптовалюти
		currencyItems.forEach(item => {
			item.addEventListener('click', e => {
				e.stopPropagation()
				const value = item.getAttribute('data-value')
				const name = item.querySelector('.currency__text')?.textContent
				const icon = item.querySelector('.currency__left img')

				console.log('Вибрано валюту:', name, value)

				// Оновлюємо іконку
				if (iconContainer && icon) {
					const iconImg = iconContainer.querySelector(
						'.swapper__select-currency-icon'
					)
					if (iconImg) {
						iconImg.src = icon.src
						iconImg.alt = value.toUpperCase()
					}
				}

				// Закриваємо overlay
				overlay.classList.remove('active')

				// Повертаємо стрілку в початкове положення
				if (arrow) {
					arrow.style.transform = 'translateY(-50%) rotate(0deg)'
				}

				// Очищаємо пошук
				if (searchInput) {
					searchInput.value = ''
					currencyItems.forEach(item => {
						item.style.display = 'flex'
					})
				}
			})
		})
	})
}

// Функція для роботи з кнопкою swap
function initSwapButton() {
	const swapButton = document.querySelector('.swapper__swap')
	const sendWrapper = document.querySelector('.swapper__send')
	const receiveWrapper = document.querySelector('.swapper__receive')

	if (!swapButton || !sendWrapper || !receiveWrapper) {
		console.log('Не знайдено елементи для swap функціональності')
		return
	}

	swapButton.addEventListener('click', function () {
		console.log('Клік на кнопку swap')

		// Перевіряємо, чи не виконується вже анімація
		if (swapButton.classList.contains('swapping')) {
			console.log('Анімація swap вже виконується')
			return
		}

		// Додаємо клас для анімації
		swapButton.classList.add('swapping')

		// Перевіряємо поточний стан кнопки
		const isCurrentlySwapped = swapButton.classList.contains('swapped')

		// Отримуємо поточні значення
		const sendInput = sendWrapper.querySelector('.swapper__send-input')
		const receiveInput = receiveWrapper.querySelector('.swapper__receive-input')
		const sendIcon = sendWrapper.querySelector('.swapper__select-currency-icon')
		const receiveIcon = receiveWrapper.querySelector(
			'.swapper__select-currency-icon'
		)

		// Зберігаємо поточні значення
		const sendValue = sendInput.value
		const receiveValue = receiveInput.value
		const sendIconSrc = sendIcon.src
		const receiveIconSrc = receiveIcon.src
		const sendIconAlt = sendIcon.alt
		const receiveIconAlt = receiveIcon.alt

		// Затримка для анімації - змінюємо значення в середині анімації
		setTimeout(() => {
			// Міняємо місцями значення полів
			sendInput.value = receiveValue
			receiveInput.value = sendValue

			// Міняємо місцями іконки
			sendIcon.src = receiveIconSrc
			sendIcon.alt = receiveIconAlt
			receiveIcon.src = sendIconSrc
			receiveIcon.alt = sendIconAlt

			// Оновлюємо курс обміну
			updateExchangeRate()

			// Перераховуємо суму отримання
			recalculateReceiveAmount()

			console.log('Таймер перезапущено після swap')

			// Видаляємо клас анімації та змінюємо стан swapped після завершення
			setTimeout(() => {
				swapButton.classList.remove('swapping')
				if (isCurrentlySwapped) {
					swapButton.classList.remove('swapped')
				} else {
					swapButton.classList.add('swapped')
				}
				console.log('Анімація swap завершена')
			}, 300)

			// Додатковий обробник для гарантованого видалення класу
			const handleAnimationEnd = () => {
				swapButton.classList.remove('swapping')
				if (isCurrentlySwapped) {
					swapButton.classList.remove('swapped')
				} else {
					swapButton.classList.add('swapped')
				}
				swapButton.removeEventListener('animationend', handleAnimationEnd)
				console.log('Анімація swap завершена (animationend)')
			}

			swapButton.addEventListener('animationend', handleAnimationEnd)

			console.log('Swap виконано успішно')
		}, 75)
	})
}

// Функція для оновлення курсу обміну
function updateExchangeRate() {
	const rateText = document.querySelector('.swapper__rate-text')
	if (!rateText) return

	// Тут можна додати логіку для отримання реального курсу
	// Зараз просто оновлюємо текст
	const currentText = rateText.textContent
	if (currentText.includes('USDT = 41.123 UAH')) {
		rateText.innerHTML = '1 UAH = 0.024 USDT<span>60</span>'
	} else if (currentText.includes('UAH = 0.024 USDT')) {
		rateText.innerHTML = '1 USDT = 41.123 UAH<span>60</span>'
	}

	// Перезапускаємо таймер після оновлення курсу
	console.log('Перезапуск таймера після оновлення курсу')
	initRateTimer({ durationSeconds: 60 })
}

// Функція для перерахунку суми отримання
function recalculateReceiveAmount() {
	const sendInput = document.querySelector('.swapper__send-input')
	const receiveInput = document.querySelector('.swapper__receive-input')
	const rateText = document.querySelector('.swapper__rate-text')

	if (!sendInput || !receiveInput || !rateText) return

	const sendAmount = parseFloat(sendInput.value) || 0
	const currentText = rateText.textContent

	// Простий перерахунок на основі курсу (заглушка)
	let receiveAmount = 0

	if (currentText.includes('USDT = 41.123 UAH')) {
		// Якщо відправляємо USDT, отримуємо UAH
		receiveAmount = sendAmount * 41.123
	} else if (currentText.includes('UAH = 0.024 USDT')) {
		// Якщо відправляємо UAH, отримуємо USDT
		receiveAmount = sendAmount * 0.024
	} else {
		// За замовчуванням
		receiveAmount = sendAmount * 41.123
	}

	// Віднімаємо комісію
	const commission = 1.5 // 1.5 USDT комісія
	if (currentText.includes('USDT')) {
		receiveAmount -= commission
	}

	receiveInput.value = receiveAmount.toFixed(2)
}

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', function () {
	console.log('DOM завантажено, ініціалізуємо...')

	// Простий тест для перевірки
	console.log(
		'Тест: Знайдено swapper__select-wrapper:',
		document.querySelectorAll('.swapper__select-wrapper').length
	)
	console.log(
		'Тест: Знайдено currency__overlay:',
		document.querySelectorAll('.currency__overlay').length
	)

	// Знаходимо всі swapper__select
	const currencySelects = document.querySelectorAll('.swapper__select')

	currencySelects.forEach(select => {
		const wrapper = select.closest('.swapper__select-wrapper')
		const iconContainer = wrapper?.querySelector('.swapper__select-icon')

		if (iconContainer) {
			// Встановлюємо початкову іконку
			updateCurrencyIcon(select, iconContainer)

			// Додаємо обробник події зміни
			select.addEventListener('change', function () {
				updateCurrencyIcon(select, iconContainer)
			})
		}
	})

	// Ініціалізуємо currency overlay
	initCurrencyOverlay()

	// Ініціалізуємо кнопку swap
	initSwapButton()

	// Ініціалізуємо таби купити/продати
	initBuySellTabs()

	// Додаємо обробник для автоматичного перерахунку
	const sendInput = document.querySelector('.swapper__send-input')
	if (sendInput) {
		sendInput.addEventListener('input', recalculateReceiveAmount)
	}

	// Простий тестовий обробник кліку
	document
		.querySelectorAll('.swapper__select-wrapper')
		.forEach((wrapper, index) => {
			console.log(`Додано обробник для wrapper ${index}`)
		})

	// Ініціалізація кастомного dropdown для вибору мови
	initLanguageDropdown()

	// Запуск таймера курсу
	initRateTimer({ durationSeconds: 60 })

	// Ініціалізація форматування номера карти
	initCardNumberFormatting()

	// Ініціалізація попапу авторизації
	initAuthModal()

	// Ініціалізація попапу реєстрації
	initRegisterModal()

	// Ініціалізація попапу відновлення паролю
	initForgotModal()

	// Ініціалізація попапу зміни паролю
	initChangePasswordModal()

	// Ініціалізація dropdown меню користувача
	initUserDropdown()

	// Ініціалізація бургер меню
	initBurgerMenu()
})

// Функція для роботи з кастомним dropdown вибору мови
function initLanguageDropdown() {
	const languageSelector = document.querySelector('.main__language-selector')
	const languageCurrent = document.querySelector('.main__language-current')
	const languageDropdown = document.querySelector('.main__language-dropdown')
	const languageOptions = document.querySelectorAll('.main__language-option')
	const languageText = document.querySelector('.main__language-text')

	if (!languageSelector) return

	// Відкриття/закриття dropdown при кліку
	languageCurrent.addEventListener('click', e => {
		e.stopPropagation()

		// Закриваємо user dropdown якщо він відкритий
		const userSelector = document.querySelector('.main__user-selector')
		if (userSelector && userSelector.classList.contains('active')) {
			userSelector.classList.remove('active')
		}

		languageSelector.classList.toggle('active')
	})

	// Закриття dropdown при кліку поза ним
	document.addEventListener('click', e => {
		if (!languageSelector.contains(e.target)) {
			languageSelector.classList.remove('active')
		}
	})

	// Закриття dropdown при натисканні Escape
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape' && languageSelector.classList.contains('active')) {
			languageSelector.classList.remove('active')
		}
	})

	// Обробка вибору мови
	languageOptions.forEach(option => {
		option.addEventListener('click', () => {
			const value = option.getAttribute('data-value')
			const text = option.querySelector(
				'.main__language-option-text'
			)?.textContent

			// Оновлюємо відображуваний текст
			if (languageText) {
				languageText.textContent = value.toUpperCase()
			}

			// Оновлюємо активний стан опцій
			languageOptions.forEach(opt => opt.classList.remove('active'))
			option.classList.add('active')

			// Закриваємо dropdown
			languageSelector.classList.remove('active')

			// Синхронізуємо з мобільним вибором мови
			const mobileLanguageText = document.querySelector(
				'.mobile-menu__language-text'
			)
			if (mobileLanguageText) {
				mobileLanguageText.textContent = value.toUpperCase()
			}

			// Тут можна додати логіку для зміни мови на сайті
			changeLanguage(value)
		})
	})

	// Встановлюємо початковий активний стан для української мови
	const ukrainianOption = document.querySelector(
		'.main__language-option[data-value="ua"]'
	)
	if (ukrainianOption) {
		ukrainianOption.classList.add('active')
	}
}

// Функція для зміни мови (заглушка - можна розширити)
function changeLanguage(languageCode) {
	console.log('Зміна мови на:', languageCode)
	// Тут можна додати логіку для зміни тексту на сайті
	// Наприклад, завантаження перекладів або зміна контенту
}

// Функція для роботи з табами купити/продати
function initBuySellTabs() {
	const tabs = document.querySelectorAll('.swapper__tab')
	const sendWrapper = document.querySelector('.swapper__send')
	const receiveWrapper = document.querySelector('.swapper__receive')
	const sendInput = document.querySelector('.swapper__send-input')
	const receiveInput = document.querySelector('.swapper__receive-input')
	const rateText = document.querySelector('.swapper__rate-text')
	const commissionText = document.querySelector('.swapper__rate-commission')
	const buttonText = document.querySelector('.swapper__button')

	if (!tabs.length) {
		console.log('Таби не знайдено')
		return
	}

	// Початковий стан - активний таб "Купити"
	let currentTab = 'buy'

	// Функція для оновлення контенту в залежності від активного таба
	function updateTabContent(tabType) {
		if (tabType === 'buy') {
			// Таб "Купити" - користувач відправляє криптовалюту, отримує фіат
			sendWrapper.querySelector('.swapper__send-text').textContent =
				'Ви відправляєте'
			receiveWrapper.querySelector('.swapper__receive-text').textContent =
				'Ви отримуєте'

			// Встановлюємо криптовалюту як відправляєму валюту (якщо ще не встановлена)
			const sendIcon = sendWrapper.querySelector(
				'.swapper__select-currency-icon'
			)
			if (
				sendIcon &&
				!sendIcon.src.includes('usdt.svg') &&
				!sendIcon.src.includes('btc.svg')
			) {
				sendIcon.src = './images/usdt.svg'
				sendIcon.alt = 'USDT'
			}

			// Встановлюємо фіат як отримувану валюту
			const receiveIcon = receiveWrapper.querySelector(
				'.swapper__select-currency-icon'
			)
			if (receiveIcon && !receiveIcon.src.includes('uah.svg')) {
				receiveIcon.src = './images/uah.svg'
				receiveIcon.alt = 'UAH'
			}

			// Оновлюємо курс
			if (rateText) {
				rateText.innerHTML = '1 USDT = 41.123 UAH<span>60</span>'
			}

			// Оновлюємо комісію
			if (commissionText) {
				commissionText.innerHTML =
					'Комісія за обробку платежу <span>1,5 USDT</span>'
			}

			// Оновлюємо текст кнопки
			if (buttonText) {
				buttonText.textContent = 'Купити зараз'
			}
		} else {
			// Таб "Продати" - користувач відправляє фіат, отримує криптовалюту
			sendWrapper.querySelector('.swapper__send-text').textContent =
				'Ви відправляєте'
			receiveWrapper.querySelector('.swapper__receive-text').textContent =
				'Ви отримуєте'

			// Встановлюємо фіат як відправляєму валюту
			const sendIcon = sendWrapper.querySelector(
				'.swapper__select-currency-icon'
			)
			if (sendIcon && !sendIcon.src.includes('uah.svg')) {
				sendIcon.src = './images/uah.svg'
				sendIcon.alt = 'UAH'
			}

			// Встановлюємо криптовалюту як отримувану валюту
			const receiveIcon = receiveWrapper.querySelector(
				'.swapper__select-currency-icon'
			)
			if (
				receiveIcon &&
				!receiveIcon.src.includes('usdt.svg') &&
				!receiveIcon.src.includes('btc.svg')
			) {
				receiveIcon.src = './images/usdt.svg'
				receiveIcon.alt = 'USDT'
			}

			// Оновлюємо курс
			if (rateText) {
				rateText.innerHTML = '1 UAH = 0.024 USDT<span>60</span>'
			}

			// Оновлюємо комісію
			if (commissionText) {
				commissionText.innerHTML = 'Комісія за обробку платежу <span>2%</span>'
			}

			// Оновлюємо текст кнопки
			if (buttonText) {
				buttonText.textContent = 'Продати зараз'
			}
		}

		// Перераховуємо суму
		recalculateReceiveAmount()

		// Перезапускаємо таймер після зміни курсу
		initRateTimer({ durationSeconds: 60 })
	}

	// Додаємо обробники подій для табів
	tabs.forEach((tab, index) => {
		tab.addEventListener('click', function () {
			// Видаляємо активний клас з усіх табів
			tabs.forEach(t => t.classList.remove('active'))

			// Додаємо активний клас до поточного таба
			tab.classList.add('active')

			// Визначаємо тип таба
			const tabType = index === 0 ? 'buy' : 'sell'
			currentTab = tabType

			console.log('Активний таб:', tabType)

			// Оновлюємо контент
			updateTabContent(tabType)

			// Очищаємо поля вводу
			if (sendInput) sendInput.value = ''
			if (receiveInput) receiveInput.value = ''
		})
	})

	// Оновлюємо функцію перерахунку для роботи з табами
	const originalRecalculateReceiveAmount = recalculateReceiveAmount
	window.recalculateReceiveAmount = function () {
		const sendAmount = parseFloat(sendInput?.value) || 0
		let receiveAmount = 0

		if (currentTab === 'buy') {
			// Купити: USDT -> UAH
			receiveAmount = sendAmount * 41.123
			// Віднімаємо комісію
			receiveAmount -= 1.5
		} else {
			// Продати: UAH -> USDT
			receiveAmount = sendAmount * 0.024
			// Віднімаємо комісію 2%
			receiveAmount = receiveAmount * 0.98
		}

		if (receiveInput) {
			receiveInput.value = receiveAmount > 0 ? receiveAmount.toFixed(2) : ''
		}
	}

	// Додаємо обробник для кнопки створення замовлення
	if (buttonText) {
		buttonText.addEventListener('click', function (e) {
			e.preventDefault()

			const sendAmount = parseFloat(sendInput?.value) || 0
			const receiveAmount = parseFloat(receiveInput?.value) || 0

			if (sendAmount <= 0) {
				alert('Будь ласка, введіть суму для обміну')
				return
			}

			if (currentTab === 'buy') {
				alert(
					`Замовлення на купівлю створено!\nВи відправляєте: ${sendAmount} USDT\nВи отримуєте: ${receiveAmount} UAH`
				)
			} else {
				alert(
					`Замовлення на продаж створено!\nВи відправляєте: ${sendAmount} UAH\nВи отримуєте: ${receiveAmount} USDT`
				)
			}
		})
	}

	console.log('Таби купити/продати ініціалізовані')
}

// Анімоване кільце-таймер біля курсу
function initRateTimer(options) {
	const { durationSeconds = 60 } = options || {}
	const rateSpan = document.querySelector('.swapper__rate-text span')
	if (!rateSpan) return

	// Очищаємо попередній таймер, якщо він існує
	if (window.rateTimerAnimationId) {
		cancelAnimationFrame(window.rateTimerAnimationId)
		console.log('Попередній таймер зупинено')
	}

	// Оформлення
	rateSpan.classList.add('rate-timer')

	let remaining = Number(rateSpan.textContent.trim()) || durationSeconds
	let startTime = performance.now()

	console.log(`Таймер запущено з ${remaining} секунд`)

	function frame(now) {
		const elapsed = (now - startTime) / 1000
		const left = Math.max(durationSeconds - elapsed, 0)
		remaining = Math.ceil(left)
		rateSpan.textContent = String(remaining)
		const progressDeg = (left / durationSeconds) * 360
		rateSpan.style.setProperty('--progress', progressDeg + 'deg')

		if (left <= 0) {
			// перезапуск
			startTime = performance.now()
		}
		window.rateTimerAnimationId = requestAnimationFrame(frame)
	}

	window.rateTimerAnimationId = requestAnimationFrame(frame)
}

// Функція для форматування номера карти
function initCardNumberFormatting() {
	const cardInput = document.getElementById('cardNumberInput')
	if (!cardInput) return

	// Функція для перевірки номера карти за алгоритмом Луна
	function validateCardNumber(number) {
		const digits = number.replace(/\D/g, '').split('').map(Number)
		if (digits.length < 13 || digits.length > 19) return false

		let sum = 0
		let isEven = false

		// Проходимо по цифрах справа наліво
		for (let i = digits.length - 1; i >= 0; i--) {
			let digit = digits[i]

			if (isEven) {
				digit *= 2
				if (digit > 9) {
					digit = digit
						.toString()
						.split('')
						.map(Number)
						.reduce((a, b) => a + b, 0)
				}
			}

			sum += digit
			isEven = !isEven
		}

		return sum % 10 === 0
	}

	// Функція для визначення типу карти
	function getCardType(number) {
		const cleanNumber = number.replace(/\D/g, '')

		// Visa
		if (/^4/.test(cleanNumber)) return 'visa'
		// Mastercard
		if (/^5[1-5]/.test(cleanNumber)) return 'mastercard'
		// American Express
		if (/^3[47]/.test(cleanNumber)) return 'amex'
		// Discover
		if (/^6(?:011|5)/.test(cleanNumber)) return 'discover'

		return 'unknown'
	}

	cardInput.addEventListener('input', function (e) {
		// Видаляємо всі символи крім цифр
		let value = e.target.value.replace(/\D/g, '')

		// Обмежуємо довжину до 16 цифр
		if (value.length > 16) {
			value = value.slice(0, 16)
		}

		// Форматуємо номер карти з пробілами через кожні 4 цифри
		let formattedValue = ''
		for (let i = 0; i < value.length; i++) {
			if (i > 0 && i % 4 === 0) {
				formattedValue += ' '
			}
			formattedValue += value[i]
		}

		// Встановлюємо відформатоване значення
		e.target.value = formattedValue
	})

	// Запобігаємо вставці недопустимих символів
	cardInput.addEventListener('paste', function (e) {
		e.preventDefault()
		const pastedText = (e.clipboardData || window.clipboardData).getData('text')
		const numbersOnly = pastedText.replace(/\D/g, '').slice(0, 16)

		let formattedValue = ''
		for (let i = 0; i < numbersOnly.length; i++) {
			if (i > 0 && i % 4 === 0) {
				formattedValue += ' '
			}
			formattedValue += numbersOnly[i]
		}

		this.value = formattedValue
	})

	// Запобігаємо введенню недопустимих символів
	cardInput.addEventListener('keypress', function (e) {
		const char = String.fromCharCode(e.which)
		if (!/\d/.test(char)) {
			e.preventDefault()
		}
	})
}

// Глобальні змінні для попапів
let authModal, authModalClose, authForm, loginButton
let registerModal,
	registerModalClose,
	registerForm,
	showRegisterModal,
	showAuthModal

// Функція для відкриття попапу авторизації
function openAuthModal() {
	if (authModal) {
		authModal.classList.add('active')
		document.body.classList.add('no-scroll')

		// Фокус на перше поле
		setTimeout(() => {
			const emailInput = document.getElementById('authEmail')
			if (emailInput) {
				emailInput.focus()
			}
		}, 100)
	}
}

// Функція для закриття попапу авторизації
function closeAuthModal() {
	if (authModal) {
		authModal.classList.remove('active')
		document.body.classList.remove('no-scroll')

		// Очищаємо форму
		if (authForm) {
			authForm.reset()

			// Скидаємо стилі полів
			const inputs = authForm.querySelectorAll('.auth-modal__input')
			inputs.forEach(input => {
				input.style.borderColor = 'rgba(32, 41, 65, 0.1)'
				input.style.boxShadow = 'none'
			})
		}
	}
}

// Функція для роботи з попапом авторизації
function initAuthModal() {
	authModal = document.getElementById('authModal')
	authModalClose = document.getElementById('authModalClose')
	authForm = document.getElementById('authForm')
	loginButton = document.querySelector('.main__button')

	if (!authModal || !authModalClose || !authForm || !loginButton) {
		console.log('Не знайдено елементи для попапу авторизації')
		return
	}

	// Відкриття попапу при кліку на кнопку "Увійти"
	loginButton.addEventListener('click', function (e) {
		e.preventDefault()
		openAuthModal()
	})

	// Закриття попапу при кліку на кнопку закриття
	authModalClose.addEventListener('click', closeAuthModal)

	// Закриття попапу при кліку на overlay
	authModal.addEventListener('click', function (e) {
		if (
			e.target === authModal ||
			e.target.classList.contains('auth-modal__overlay')
		) {
			closeAuthModal()
		}
	})

	// Закриття попапу при натисканні Escape
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && authModal.classList.contains('active')) {
			closeAuthModal()
		}
	})

	// Обробка відправки форми
	authForm.addEventListener('submit', function (e) {
		e.preventDefault()

		const emailInput = document.getElementById('authEmail')
		const passwordInput = document.getElementById('authPassword')
		const rememberCheckbox = document.getElementById('authRemember')

		const email = emailInput.value.trim()
		const password = passwordInput.value.trim()
		const remember = rememberCheckbox.checked

		// Проста валідація
		if (!email) {
			showFieldError(emailInput, 'Введіть електронну пошту')
			return
		}

		if (!isValidEmail(email)) {
			showFieldError(emailInput, 'Введіть коректну електронну пошту')
			return
		}

		if (!password) {
			showFieldError(passwordInput, 'Введіть пароль')
			return
		}

		// Скидаємо помилки
		clearFieldError(emailInput)
		clearFieldError(passwordInput)

		// Імітація авторизації
		showLoadingState()

		setTimeout(() => {
			hideLoadingState()

			// Тут можна додати реальну логіку авторизації
			console.log('Спроба авторизації:', {
				email,
				password,
				remember,
			})

			// Показуємо повідомлення про успіх
			showSuccessMessage('Успішна авторизація!')

			// Імітуємо успішну авторизацію через 1.5 секунди
			setTimeout(() => {
				simulateSuccessfulLogin()
			}, 1500)
		}, 2000)
	})

	// Валідація email при введенні
	const emailInput = document.getElementById('authEmail')
	if (emailInput) {
		emailInput.addEventListener('blur', function () {
			const email = this.value.trim()
			if (email && !isValidEmail(email)) {
				showFieldError(this, 'Введіть коректну електронну пошту')
			} else {
				clearFieldError(this)
			}
		})
	}

	// Валідація пароля при введенні
	const passwordInput = document.getElementById('authPassword')
	if (passwordInput) {
		passwordInput.addEventListener('blur', function () {
			const password = this.value.trim()
			if (password && password.length < 6) {
				showFieldError(this, 'Пароль повинен містити мінімум 6 символів')
			} else {
				clearFieldError(this)
			}
		})
	}

	// Функція для показу помилки поля
	function showFieldError(input, message) {
		input.style.borderColor = '#dc3545'
		input.style.boxShadow = '0 0 0 4px rgba(220, 53, 69, 0.1)'

		// Видаляємо попередню помилку
		const existingError = input.parentNode.querySelector('.auth-modal__error')
		if (existingError) {
			existingError.remove()
		}

		// Додаємо нову помилку
		const errorElement = document.createElement('div')
		errorElement.className = 'auth-modal__error'
		errorElement.textContent = message
		errorElement.style.color = '#dc3545'
		errorElement.style.fontSize = '12px'
		errorElement.style.marginTop = '4px'
		errorElement.style.fontFamily = 'Montserrat, sans-serif'

		input.parentNode.appendChild(errorElement)
	}

	// Функція для очищення помилки поля
	function clearFieldError(input) {
		input.style.borderColor = 'rgba(32, 41, 65, 0.1)'
		input.style.boxShadow = 'none'

		const errorElement = input.parentNode.querySelector('.auth-modal__error')
		if (errorElement) {
			errorElement.remove()
		}
	}

	// Функція для показу стану завантаження
	function showLoadingState() {
		const submitButton = authForm.querySelector('.auth-modal__submit')
		if (submitButton) {
			submitButton.textContent = 'Вхід...'
			submitButton.disabled = true
			submitButton.style.opacity = '0.7'
		}
	}

	// Функція для приховування стану завантаження
	function hideLoadingState() {
		const submitButton = authForm.querySelector('.auth-modal__submit')
		if (submitButton) {
			submitButton.textContent = 'Увійти'
			submitButton.disabled = false
			submitButton.style.opacity = '1'
		}
	}

	// Функція для показу повідомлення про успіх
	function showSuccessMessage(message) {
		// Видаляємо попередні повідомлення
		const existingMessage = authModal.querySelector('.auth-modal__message')
		if (existingMessage) {
			existingMessage.remove()
		}

		// Створюємо повідомлення про успіх
		const messageElement = document.createElement('div')
		messageElement.className =
			'auth-modal__message auth-modal__message--success'
		messageElement.textContent = message
		messageElement.style.cssText = `
			background: #d4edda;
			color: #155724;
			padding: 12px 16px;
			border-radius: 8px;
			margin-bottom: 16px;
			font-family: Montserrat, sans-serif;
			font-size: 14px;
			font-weight: 500;
			text-align: center;
			border: 1px solid #c3e6cb;
		`

		// Вставляємо повідомлення перед формою
		authForm.parentNode.insertBefore(messageElement, authForm)
	}

	// Функція для імітації успішної авторизації
	function simulateSuccessfulLogin() {
		// Закриваємо попап авторизації
		closeAuthModal()

		// Замінюємо кнопку "Увійти" на dropdown меню користувача
		replaceLoginButtonWithUserDropdown()

		console.log('Користувач успішно авторизований')
	}

	console.log('Попап авторизації ініціалізований')
}

// Функція для роботи з попапом реєстрації
function initRegisterModal() {
	registerModal = document.getElementById('registerModal')
	registerModalClose = document.getElementById('registerModalClose')
	registerForm = document.getElementById('registerForm')
	showRegisterModal = document.getElementById('showRegisterModal')
	showAuthModal = document.getElementById('showAuthModal')

	if (
		!registerModal ||
		!registerModalClose ||
		!registerForm ||
		!showRegisterModal ||
		!showAuthModal
	) {
		console.log('Не знайдено елементи для попапу реєстрації')
		return
	}

	// Функція для відкриття попапу реєстрації
	function openRegisterModal() {
		registerModal.classList.add('active')
		document.body.classList.add('no-scroll')

		// Фокус на перше поле
		setTimeout(() => {
			const emailInput = document.getElementById('registerEmail')
			if (emailInput) {
				emailInput.focus()
			}
		}, 100)
	}

	// Функція для закриття попапу реєстрації
	function closeRegisterModal() {
		registerModal.classList.remove('active')
		document.body.classList.remove('no-scroll')

		// Очищаємо форму
		registerForm.reset()

		// Скидаємо стилі полів
		const inputs = registerForm.querySelectorAll('.register-modal__input')
		inputs.forEach(input => {
			input.style.borderColor = 'rgba(32, 41, 65, 0.1)'
			input.style.boxShadow = 'none'
		})

		// Приховуємо помилку
		const passwordError = document.getElementById('passwordError')
		if (passwordError) {
			passwordError.style.display = 'none'
		}
	}

	// Відкриття попапу реєстрації при кліку на посилання
	showRegisterModal.addEventListener('click', function (e) {
		e.preventDefault()
		closeAuthModal()
		openRegisterModal()
	})

	// Відкриття попапу авторизації при кліку на посилання
	showAuthModal.addEventListener('click', function (e) {
		e.preventDefault()
		closeRegisterModal()
		openAuthModal()
	})

	// Закриття попапу при кліку на кнопку закриття
	registerModalClose.addEventListener('click', closeRegisterModal)

	// Закриття попапу при кліку на overlay
	registerModal.addEventListener('click', function (e) {
		if (
			e.target === registerModal ||
			e.target.classList.contains('register-modal__overlay')
		) {
			closeRegisterModal()
		}
	})

	// Закриття попапу при натисканні Escape
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && registerModal.classList.contains('active')) {
			closeRegisterModal()
		}
	})

	// Обробка відправки форми реєстрації
	registerForm.addEventListener('submit', function (e) {
		e.preventDefault()

		const emailInput = document.getElementById('registerEmail')
		const passwordInput = document.getElementById('registerPassword')
		const passwordConfirmInput = document.getElementById(
			'registerPasswordConfirm'
		)

		const email = emailInput.value.trim()
		const password = passwordInput.value.trim()
		const passwordConfirm = passwordConfirmInput.value.trim()

		// Проста валідація
		if (!email) {
			showRegisterFieldError(emailInput, 'Введіть електронну пошту')
			return
		}

		if (!isValidEmail(email)) {
			showRegisterFieldError(emailInput, 'Введіть коректну електронну пошту')
			return
		}

		if (!password) {
			showRegisterFieldError(passwordInput, 'Введіть пароль')
			return
		}

		if (password.length < 6) {
			showRegisterFieldError(
				passwordInput,
				'Пароль повинен містити мінімум 6 символів'
			)
			return
		}

		if (!passwordConfirm) {
			showRegisterFieldError(passwordConfirmInput, 'Повторіть пароль')
			return
		}

		if (password !== passwordConfirm) {
			showRegisterFieldError(passwordInput, '')
			showPasswordMismatchError()
			return
		}

		// Скидаємо помилки
		clearRegisterFieldError(emailInput)
		clearRegisterFieldError(passwordInput)
		clearRegisterFieldError(passwordConfirmInput)
		hidePasswordMismatchError()

		// Імітація реєстрації
		showRegisterLoadingState()

		setTimeout(() => {
			hideRegisterLoadingState()

			// Тут можна додати реальну логіку реєстрації
			console.log('Спроба реєстрації:', {
				email,
				password,
			})

			// Показуємо повідомлення про успіх
			showRegisterSuccessMessage('Акаунт успішно створено!')

			// Імітуємо успішну авторизацію через 1.5 секунди
			setTimeout(() => {
				closeRegisterModal()
				simulateSuccessfulLogin()
			}, 1500)
		}, 2000)
	})

	// Валідація email при введенні
	const emailInput = document.getElementById('registerEmail')
	if (emailInput) {
		emailInput.addEventListener('blur', function () {
			const email = this.value.trim()
			if (email && !isValidEmail(email)) {
				showRegisterFieldError(this, 'Введіть коректну електронну пошту')
			} else {
				clearRegisterFieldError(this)
			}
		})
	}

	// Валідація паролів при введенні
	const passwordInput = document.getElementById('registerPassword')
	const passwordConfirmInput = document.getElementById(
		'registerPasswordConfirm'
	)

	if (passwordInput && passwordConfirmInput) {
		// Валідація першого пароля
		passwordInput.addEventListener('blur', function () {
			const password = this.value.trim()
			if (password && password.length < 6) {
				showRegisterFieldError(
					this,
					'Пароль повинен містити мінімум 6 символів'
				)
			} else {
				clearRegisterFieldError(this)
			}
		})

		// Валідація підтвердження пароля
		passwordConfirmInput.addEventListener('input', function () {
			const password = passwordInput.value.trim()
			const passwordConfirm = this.value.trim()

			if (passwordConfirm && password !== passwordConfirm) {
				showPasswordMismatchError()
			} else {
				hidePasswordMismatchError()
			}
		})

		passwordConfirmInput.addEventListener('blur', function () {
			const password = passwordInput.value.trim()
			const passwordConfirm = this.value.trim()

			if (passwordConfirm && password !== passwordConfirm) {
				showRegisterFieldError(this, 'Паролі не співпадають')
				showPasswordMismatchError()
			} else {
				clearRegisterFieldError(this)
				hidePasswordMismatchError()
			}
		})
	}

	// Функція для показу помилки поля реєстрації
	function showRegisterFieldError(input, message) {
		input.style.borderColor = '#dc3545'
		input.style.boxShadow = '0 0 0 4px rgba(220, 53, 69, 0.1)'

		// Видаляємо попередню помилку
		const existingError = input.parentNode.querySelector(
			'.register-modal__field-error'
		)
		if (existingError) {
			existingError.remove()
		}

		// Додаємо нову помилку, якщо є повідомлення
		if (message) {
			const errorElement = document.createElement('div')
			errorElement.className = 'register-modal__field-error'
			errorElement.textContent = message
			errorElement.style.color = '#dc3545'
			errorElement.style.fontSize = '12px'
			errorElement.style.marginTop = '4px'
			errorElement.style.fontFamily = 'Montserrat, sans-serif'

			input.parentNode.appendChild(errorElement)
		}
	}

	// Функція для очищення помилки поля реєстрації
	function clearRegisterFieldError(input) {
		input.style.borderColor = 'rgba(32, 41, 65, 0.1)'
		input.style.boxShadow = 'none'

		const errorElement = input.parentNode.querySelector(
			'.register-modal__field-error'
		)
		if (errorElement) {
			errorElement.remove()
		}
	}

	// Функція для показу помилки неспівпадіння паролів
	function showPasswordMismatchError() {
		const passwordError = document.getElementById('passwordError')
		if (passwordError) {
			passwordError.style.display = 'flex'
		}
	}

	// Функція для приховування помилки неспівпадіння паролів
	function hidePasswordMismatchError() {
		const passwordError = document.getElementById('passwordError')
		if (passwordError) {
			passwordError.style.display = 'none'
		}
	}

	// Функція для показу стану завантаження реєстрації
	function showRegisterLoadingState() {
		const submitButton = registerForm.querySelector('.register-modal__submit')
		if (submitButton) {
			submitButton.textContent = 'Створення акаунту...'
			submitButton.disabled = true
			submitButton.style.opacity = '0.7'
		}
	}

	// Функція для приховування стану завантаження реєстрації
	function hideRegisterLoadingState() {
		const submitButton = registerForm.querySelector('.register-modal__submit')
		if (submitButton) {
			submitButton.textContent = 'Створити акаунт'
			submitButton.disabled = false
			submitButton.style.opacity = '1'
		}
	}

	// Функція для показу повідомлення про успіх реєстрації
	function showRegisterSuccessMessage(message) {
		// Видаляємо попередні повідомлення
		const existingMessage = registerModal.querySelector(
			'.register-modal__message'
		)
		if (existingMessage) {
			existingMessage.remove()
		}

		// Створюємо повідомлення про успіх
		const messageElement = document.createElement('div')
		messageElement.className =
			'register-modal__message register-modal__message--success'
		messageElement.textContent = message
		messageElement.style.cssText = `
			background: #d4edda;
			color: #155724;
			padding: 12px 16px;
			border-radius: 8px;
			margin-bottom: 16px;
			font-family: Montserrat, sans-serif;
			font-size: 14px;
			font-weight: 500;
			text-align: center;
			border: 1px solid #c3e6cb;
		`

		// Вставляємо повідомлення перед формою
		registerForm.parentNode.insertBefore(messageElement, registerForm)
	}

	console.log('Попап реєстрації ініціалізований')
}

// Глобальні змінні для попапу відновлення паролю
let forgotModal, forgotModalClose, forgotForm, showForgotModal

// Функція для роботи з попапом відновлення паролю
function initForgotModal() {
	console.log('=== ІНІЦІАЛІЗАЦІЯ ПОПАПУ ВІДНОВЛЕННЯ ПАРОЛЯ ===')
	forgotModal = document.getElementById('forgotModal')
	forgotModalClose = document.getElementById('forgotModalClose')
	forgotForm = document.getElementById('forgotForm')
	showForgotModal = document.querySelector('.auth-modal__forgot')

	console.log('Знайдені елементи:', {
		forgotModal: !!forgotModal,
		forgotModalClose: !!forgotModalClose,
		forgotForm: !!forgotForm,
		showForgotModal: !!showForgotModal,
	})

	if (!forgotModal || !forgotModalClose || !forgotForm || !showForgotModal) {
		console.log('Не знайдено елементи для попапу відновлення паролю')
		return
	}

	// Функція для відкриття попапу відновлення паролю
	function openForgotModal() {
		forgotModal.classList.add('active')
		document.body.classList.add('no-scroll')

		// Фокус на поле email
		setTimeout(() => {
			const emailInput = document.getElementById('forgotEmail')
			if (emailInput) {
				emailInput.focus()
			}
		}, 100)
	}

	// Функція для закриття попапу відновлення паролю
	function closeForgotModal() {
		forgotModal.classList.remove('active')
		document.body.classList.remove('no-scroll')

		// Очищаємо форму
		forgotForm.reset()

		// Скидаємо стилі полів
		const inputs = forgotForm.querySelectorAll('.forgot-modal__input')
		inputs.forEach(input => {
			input.style.borderColor = 'rgba(32, 41, 65, 0.1)'
			input.style.boxShadow = 'none'
		})

		// Видаляємо повідомлення про успіх
		const existingMessage = forgotModal.querySelector('.forgot-modal__message')
		if (existingMessage) {
			existingMessage.remove()
		}
	}

	// Відкриття попапу при кліку на "Забули пароль?"
	showForgotModal.addEventListener('click', function (e) {
		e.preventDefault()
		closeAuthModal()
		openForgotModal()
	})

	// Закриття попапу при кліку на кнопку закриття
	forgotModalClose.addEventListener('click', closeForgotModal)

	// Закриття попапу при кліку на overlay
	forgotModal.addEventListener('click', function (e) {
		if (
			e.target === forgotModal ||
			e.target.classList.contains('forgot-modal__overlay')
		) {
			closeForgotModal()
		}
	})

	// Закриття попапу при натисканні Escape
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && forgotModal.classList.contains('active')) {
			closeForgotModal()
		}
	})

	// Повернення до авторизації
	const showAuthModalFromForgot = document.getElementById(
		'showAuthModalFromForgot'
	)
	if (showAuthModalFromForgot) {
		showAuthModalFromForgot.addEventListener('click', function (e) {
			e.preventDefault()
			closeForgotModal()
			openAuthModal()
		})
	}

	// Обробка відправки форми відновлення паролю
	forgotForm.addEventListener('submit', function (e) {
		e.preventDefault()
		console.log('Відправка форми відновлення пароля')

		const emailInput = document.getElementById('forgotEmail')
		const email = emailInput.value.trim()

		console.log('Email:', email)

		// Проста валідація
		if (!email) {
			console.log('Email порожній')
			showForgotFieldError(emailInput, 'Введіть електронну пошту')
			return
		}

		if (!isValidEmail(email)) {
			console.log('Email некоректний')
			showForgotFieldError(emailInput, 'Введіть коректну електронну пошту')
			return
		}

		console.log('Email валідний, починаємо обробку')

		// Скидаємо помилки
		clearForgotFieldError(emailInput)

		// Імітація відправки запиту на відновлення паролю
		showForgotLoadingState()

		setTimeout(() => {
			hideForgotLoadingState()

			// Тут можна додати реальну логіку відправки запиту
			console.log('Запит на відновлення паролю для:', email)

			// Закриваємо попап відновлення паролю
			closeForgotModal()

			// Відкриваємо попап зміни паролю
			setTimeout(() => {
				console.log('Спроба відкриття попапу зміни пароля...')
				if (typeof openChangePasswordModal === 'function') {
					openChangePasswordModal()
					console.log('Попап зміни пароля відкрито успішно')
				} else {
					console.error('Функція openChangePasswordModal не знайдена')
					// Резервний варіант - відкриваємо попап напряму
					const changePasswordModal = document.getElementById(
						'changePasswordModal'
					)
					if (changePasswordModal) {
						changePasswordModal.classList.add('active')
						document.body.classList.add('no-scroll')
						console.log('Попап зміни пароля відкрито через резервний метод')
					} else {
						console.error('Попап зміни пароля не знайдено в DOM')
					}
				}
			}, 300)
		}, 2000)
	})

	// Валідація email при введенні
	const emailInput = document.getElementById('forgotEmail')
	if (emailInput) {
		emailInput.addEventListener('blur', function () {
			const email = this.value.trim()
			if (email && !isValidEmail(email)) {
				showForgotFieldError(this, 'Введіть коректну електронну пошту')
			} else {
				clearForgotFieldError(this)
			}
		})
	}

	// Функція для показу помилки поля відновлення паролю
	function showForgotFieldError(input, message) {
		input.style.borderColor = '#dc3545'
		input.style.boxShadow = '0 0 0 4px rgba(220, 53, 69, 0.1)'

		// Видаляємо попередню помилку
		const existingError = input.parentNode.querySelector('.forgot-modal__error')
		if (existingError) {
			existingError.remove()
		}

		// Додаємо нову помилку
		const errorElement = document.createElement('div')
		errorElement.className = 'forgot-modal__error'
		errorElement.textContent = message
		errorElement.style.color = '#dc3545'
		errorElement.style.fontSize = '12px'
		errorElement.style.marginTop = '4px'
		errorElement.style.fontFamily = 'Montserrat, sans-serif'

		input.parentNode.appendChild(errorElement)
	}

	// Функція для очищення помилки поля відновлення паролю
	function clearForgotFieldError(input) {
		input.style.borderColor = 'rgba(32, 41, 65, 0.1)'
		input.style.boxShadow = 'none'

		const errorElement = input.parentNode.querySelector('.forgot-modal__error')
		if (errorElement) {
			errorElement.remove()
		}
	}

	// Функція для показу стану завантаження відновлення паролю
	function showForgotLoadingState() {
		const submitButton = forgotForm.querySelector('.forgot-modal__submit')
		if (submitButton) {
			submitButton.textContent = 'Відправка...'
			submitButton.disabled = true
			submitButton.style.opacity = '0.7'
		}
	}

	// Функція для приховування стану завантаження відновлення паролю
	function hideForgotLoadingState() {
		const submitButton = forgotForm.querySelector('.forgot-modal__submit')
		if (submitButton) {
			submitButton.textContent = 'Продовжити'
			submitButton.disabled = false
			submitButton.style.opacity = '1'
		}
	}

	// Функція для показу повідомлення про успіх відновлення паролю
	function showForgotSuccessMessage(message) {
		// Видаляємо попередні повідомлення
		const existingMessage = forgotModal.querySelector('.forgot-modal__message')
		if (existingMessage) {
			existingMessage.remove()
		}

		// Створюємо повідомлення про успіх
		const messageElement = document.createElement('div')
		messageElement.className =
			'forgot-modal__message forgot-modal__message--success'
		messageElement.textContent = message
		messageElement.style.cssText = `
			background: #d4edda;
			color: #155724;
			padding: 12px 16px;
			border-radius: 8px;
			margin-bottom: 16px;
			font-family: Montserrat, sans-serif;
			font-size: 14px;
			font-weight: 500;
			text-align: center;
			border: 1px solid #c3e6cb;
		`

		// Вставляємо повідомлення перед формою
		forgotForm.parentNode.insertBefore(messageElement, forgotForm)
	}

	console.log('=== ПОПАП ВІДНОВЛЕННЯ ПАРОЛЯ ІНІЦІАЛІЗОВАНО УСПІШНО ===')
}

// Глобальні змінні для попапу зміни паролю
let changePasswordModal, changePasswordModalClose, changePasswordForm

// Глобальна функція для відкриття попапу зміни паролю
function openChangePasswordModal() {
	console.log('Виклик функції openChangePasswordModal')
	const changePasswordModal = document.getElementById('changePasswordModal')
	if (changePasswordModal) {
		changePasswordModal.classList.add('active')
		document.body.classList.add('no-scroll')
		console.log('Попап зміни пароля відкрито')

		// Фокус на перше поле
		setTimeout(() => {
			const newPasswordInput = document.getElementById('newPassword')
			if (newPasswordInput) {
				newPasswordInput.focus()
				console.log('Фокус встановлено на поле нового пароля')
			}
		}, 100)
	} else {
		console.error('Попап зміни пароля не знайдено в DOM')
	}
}

// Робимо функцію глобальною для використання з інших місць
window.openChangePasswordModal = openChangePasswordModal

// Функція для роботи з попапом зміни паролю
function initChangePasswordModal() {
	console.log('=== ІНІЦІАЛІЗАЦІЯ ПОПАПУ ЗМІНИ ПАРОЛЯ ===')
	changePasswordModal = document.getElementById('changePasswordModal')
	changePasswordModalClose = document.getElementById('changePasswordModalClose')
	changePasswordForm = document.getElementById('changePasswordForm')

	if (
		!changePasswordModal ||
		!changePasswordModalClose ||
		!changePasswordForm
	) {
		console.log('Не знайдено елементи для попапу зміни паролю')
		return
	}

	// Функція для закриття попапу зміни паролю
	function closeChangePasswordModal() {
		changePasswordModal.classList.remove('active')
		document.body.classList.remove('no-scroll')

		// Очищаємо форму
		changePasswordForm.reset()

		// Скидаємо стилі полів
		const inputs = changePasswordForm.querySelectorAll(
			'.change-password-modal__input'
		)
		inputs.forEach(input => {
			input.style.borderColor = 'rgba(32, 41, 65, 0.1)'
			input.style.boxShadow = 'none'
		})

		// Видаляємо повідомлення про успіх
		const existingMessage = changePasswordModal.querySelector(
			'.change-password-modal__message'
		)
		if (existingMessage) {
			existingMessage.remove()
		}
	}

	// Закриття попапу при кліку на кнопку закриття
	changePasswordModalClose.addEventListener('click', closeChangePasswordModal)

	// Закриття попапу при кліку на overlay
	changePasswordModal.addEventListener('click', function (e) {
		if (
			e.target === changePasswordModal ||
			e.target.classList.contains('change-password-modal__overlay')
		) {
			closeChangePasswordModal()
		}
	})

	// Закриття попапу при натисканні Escape
	document.addEventListener('keydown', function (e) {
		if (
			e.key === 'Escape' &&
			changePasswordModal.classList.contains('active')
		) {
			closeChangePasswordModal()
		}
	})

	// Скасування зміни паролю
	const showAuthModalFromChangePassword = document.getElementById(
		'showAuthModalFromChangePassword'
	)
	if (showAuthModalFromChangePassword) {
		showAuthModalFromChangePassword.addEventListener('click', function (e) {
			e.preventDefault()
			closeChangePasswordModal()
		})
	}

	// Обробка відправки форми зміни паролю
	changePasswordForm.addEventListener('submit', function (e) {
		e.preventDefault()

		const newPasswordInput = document.getElementById('newPassword')
		const confirmNewPasswordInput =
			document.getElementById('confirmNewPassword')

		const newPassword = newPasswordInput.value.trim()
		const confirmNewPassword = confirmNewPasswordInput.value.trim()

		// Проста валідація
		if (!newPassword) {
			showChangePasswordFieldError(newPasswordInput, 'Введіть новий пароль')
			return
		}

		if (newPassword.length < 6) {
			showChangePasswordFieldError(
				newPasswordInput,
				'Пароль повинен містити мінімум 6 символів'
			)
			return
		}

		if (!confirmNewPassword) {
			showChangePasswordFieldError(
				confirmNewPasswordInput,
				'Повторіть новий пароль'
			)
			return
		}

		if (newPassword !== confirmNewPassword) {
			showChangePasswordFieldError(newPasswordInput, '')
			showChangePasswordFieldError(
				confirmNewPasswordInput,
				'Паролі не співпадають'
			)
			return
		}

		// Скидаємо помилки
		clearChangePasswordFieldError(newPasswordInput)
		clearChangePasswordFieldError(confirmNewPasswordInput)

		// Імітація зміни паролю
		showChangePasswordLoadingState()

		setTimeout(() => {
			hideChangePasswordLoadingState()

			// Тут можна додати реальну логіку зміни паролю
			console.log('Зміна паролю на:', newPassword)

			// Показуємо повідомлення про успіх
			showChangePasswordSuccessMessage(
				'Пароль успішно створено! Тепер ви можете увійти з новим паролем.'
			)

			// Закриваємо попап через 3 секунди і повертаємося до авторизації
			setTimeout(() => {
				closeChangePasswordModal()
				openAuthModal()
			}, 3000)
		}, 1500)
	})

	// Валідація паролів при введенні
	const newPasswordInput = document.getElementById('newPassword')
	const confirmNewPasswordInput = document.getElementById('confirmNewPassword')

	if (newPasswordInput && confirmNewPasswordInput) {
		// Валідація першого пароля
		newPasswordInput.addEventListener('blur', function () {
			const password = this.value.trim()
			if (password && password.length < 6) {
				showChangePasswordFieldError(
					this,
					'Пароль повинен містити мінімум 6 символів'
				)
			} else {
				clearChangePasswordFieldError(this)
			}
		})

		// Валідація підтвердження пароля
		confirmNewPasswordInput.addEventListener('input', function () {
			const password = newPasswordInput.value.trim()
			const passwordConfirm = this.value.trim()

			if (passwordConfirm && password !== passwordConfirm) {
				showChangePasswordFieldError(this, 'Паролі не співпадають')
			} else {
				clearChangePasswordFieldError(this)
			}
		})

		confirmNewPasswordInput.addEventListener('blur', function () {
			const password = newPasswordInput.value.trim()
			const passwordConfirm = this.value.trim()

			if (passwordConfirm && password !== passwordConfirm) {
				showChangePasswordFieldError(this, 'Паролі не співпадають')
			} else {
				clearChangePasswordFieldError(this)
			}
		})
	}

	// Функція для показу помилки поля зміни паролю
	function showChangePasswordFieldError(input, message) {
		input.style.borderColor = '#dc3545'
		input.style.boxShadow = '0 0 0 4px rgba(220, 53, 69, 0.1)'

		// Видаляємо попередню помилку
		const existingError = input.parentNode.querySelector(
			'.change-password-modal__error'
		)
		if (existingError) {
			existingError.remove()
		}

		// Додаємо нову помилку, якщо є повідомлення
		if (message) {
			const errorElement = document.createElement('div')
			errorElement.className = 'change-password-modal__error'
			errorElement.textContent = message
			errorElement.style.color = '#dc3545'
			errorElement.style.fontSize = '12px'
			errorElement.style.marginTop = '4px'
			errorElement.style.fontFamily = 'Montserrat, sans-serif'

			input.parentNode.appendChild(errorElement)
		}
	}

	// Функція для очищення помилки поля зміни паролю
	function clearChangePasswordFieldError(input) {
		input.style.borderColor = 'rgba(32, 41, 65, 0.1)'
		input.style.boxShadow = 'none'

		const errorElement = input.parentNode.querySelector(
			'.change-password-modal__error'
		)
		if (errorElement) {
			errorElement.remove()
		}
	}

	// Функція для показу стану завантаження зміни паролю
	function showChangePasswordLoadingState() {
		const submitButton = changePasswordForm.querySelector(
			'.change-password-modal__submit'
		)
		if (submitButton) {
			submitButton.textContent = 'Створення...'
			submitButton.disabled = true
			submitButton.style.opacity = '0.7'
		}
	}

	// Функція для приховування стану завантаження зміни паролю
	function hideChangePasswordLoadingState() {
		const submitButton = changePasswordForm.querySelector(
			'.change-password-modal__submit'
		)
		if (submitButton) {
			submitButton.textContent = 'Створити пароль'
			submitButton.disabled = false
			submitButton.style.opacity = '1'
		}
	}

	// Функція для показу повідомлення про успіх зміни паролю
	function showChangePasswordSuccessMessage(message) {
		// Видаляємо попередні повідомлення
		const existingMessage = changePasswordModal.querySelector(
			'.change-password-modal__message'
		)
		if (existingMessage) {
			existingMessage.remove()
		}

		// Створюємо повідомлення про успіх
		const messageElement = document.createElement('div')
		messageElement.className =
			'change-password-modal__message change-password-modal__message--success'
		messageElement.textContent = message
		messageElement.style.cssText = `
			background: #d4edda;
			color: #155724;
			padding: 12px 16px;
			border-radius: 8px;
			margin-bottom: 16px;
			font-family: Montserrat, sans-serif;
			font-size: 14px;
			font-weight: 500;
			text-align: center;
			border: 1px solid #c3e6cb;
		`

		// Вставляємо повідомлення перед формою
		changePasswordForm.parentNode.insertBefore(
			messageElement,
			changePasswordForm
		)
	}

	console.log('=== ПОПАП ЗМІНИ ПАРОЛЯ ІНІЦІАЛІЗОВАНО УСПІШНО ===')
}

console.log('=== ПОПАП ЗМІНИ ПАРОЛЯ ІНІЦІАЛІЗОВАНО УСПІШНО ===')

// Ініціалізація попапа зміни комісії мережі TRX TRC20
{
	const commissionModal = document.getElementById('commissionModal')
	const commissionModalClose = document.getElementById('commissionModalClose')
	const commissionModalCancel = document.getElementById('commissionModalCancel')
	const commissionModalConfirm = document.getElementById(
		'commissionModalConfirm'
	)
	const sliderThumb = document.getElementById('sliderThumb')
	const sliderFill = document.querySelector('.commission-modal__slider-fill')
	const sliderStops = document.querySelectorAll(
		'.commission-modal__slider-stop'
	)
	const sliderTrack = document.querySelector('.commission-modal__slider-track')

	let currentCommission = 1.0
	let isDragging = false

	// Функція для отримання поточного значення комісії з DOM
	function getCurrentCommissionFromDOM() {
		const commissionSpan = document.querySelector(
			'.swapper__rate-commission span'
		)
		if (commissionSpan) {
			const text = commissionSpan.textContent
			const match = text.match(/(\d+(?:\.\d+)?)/)
			if (match) {
				return parseFloat(match[1])
			}
		}
		return 1.0
	}

	// Ініціалізуємо поточне значення комісії
	currentCommission = getCurrentCommissionFromDOM()

	// Функція для відкриття попапа комісії
	function openCommissionModal() {
		// Оновлюємо поточне значення комісії з DOM
		currentCommission = getCurrentCommissionFromDOM()

		commissionModal.classList.add('active')
		document.body.classList.add('no-scroll')

		// Невелика затримка для коректного розрахунку розмірів
		setTimeout(() => {
			updateSliderPosition(currentCommission)
		}, 100)
	}

	// Функція для закриття попапа комісії
	function closeCommissionModal() {
		commissionModal.classList.remove('active')
		document.body.classList.remove('no-scroll')
	}

	// Функція для оновлення позиції слайдера
	function updateSliderPosition(commission) {
		const trackWidth = sliderTrack.offsetWidth
		let position = 0

		switch (commission) {
			case 1.0:
				position = 0
				break
			case 1.5:
				position = trackWidth / 2
				break
			case 2.0:
				position = trackWidth
				break
		}

		sliderThumb.style.left = `${position}px`
		sliderFill.style.width = `${position}px`

		// Оновлюємо активний стоп
		sliderStops.forEach(stop => {
			stop.classList.remove('active')
			if (parseFloat(stop.dataset.value) === commission) {
				stop.classList.add('active')
			}
		})
	}

	// Функція для отримання комісії за позицією
	function getCommissionByPosition(position) {
		const trackWidth = sliderTrack.offsetWidth
		const percentage = position / trackWidth

		if (percentage <= 0.25) return 1.0
		if (percentage <= 0.75) return 1.5
		return 2.0
	}

	// Обробники подій для кнопок закриття
	commissionModalClose.addEventListener('click', closeCommissionModal)
	commissionModalCancel.addEventListener('click', closeCommissionModal)

	// Закриття при кліку на оверлей
	commissionModal
		.querySelector('.commission-modal__overlay')
		.addEventListener('click', closeCommissionModal)

	// Закриття при натисканні клавіші Escape
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape' && commissionModal.classList.contains('active')) {
			closeCommissionModal()
		}
	})

	// Обробник для кліків на стопи слайдера
	sliderStops.forEach(stop => {
		stop.addEventListener('click', () => {
			const commission = parseFloat(stop.dataset.value)
			currentCommission = commission
			updateSliderPosition(commission)
		})
	})

	// Обробники для перетягування слайдера (миша)
	sliderThumb.addEventListener('mousedown', e => {
		isDragging = true
		e.preventDefault()
	})

	document.addEventListener('mousemove', e => {
		if (!isDragging) return

		const trackRect = sliderTrack.getBoundingClientRect()
		const position = Math.max(
			0,
			Math.min(e.clientX - trackRect.left, trackRect.width)
		)

		sliderThumb.style.left = `${position}px`
		sliderFill.style.width = `${position}px`

		const commission = getCommissionByPosition(position)
		currentCommission = commission

		// Оновлюємо активний стоп
		sliderStops.forEach(stop => {
			stop.classList.remove('active')
			if (parseFloat(stop.dataset.value) === commission) {
				stop.classList.add('active')
			}
		})
	})

	document.addEventListener('mouseup', () => {
		isDragging = false
	})

	// Обробники для перетягування слайдера (сенсорні пристрої)
	sliderThumb.addEventListener('touchstart', e => {
		isDragging = true
		e.preventDefault()
	})

	document.addEventListener('touchmove', e => {
		if (!isDragging) return

		const trackRect = sliderTrack.getBoundingClientRect()
		const touch = e.touches[0]
		const position = Math.max(
			0,
			Math.min(touch.clientX - trackRect.left, trackRect.width)
		)

		sliderThumb.style.left = `${position}px`
		sliderFill.style.width = `${position}px`

		const commission = getCommissionByPosition(position)
		currentCommission = commission

		// Оновлюємо активний стоп
		sliderStops.forEach(stop => {
			stop.classList.remove('active')
			if (parseFloat(stop.dataset.value) === commission) {
				stop.classList.add('active')
			}
		})
	})

	document.addEventListener('touchend', () => {
		isDragging = false
	})

	// Обробник для кліку на трек слайдера
	sliderTrack.addEventListener('click', e => {
		const trackRect = sliderTrack.getBoundingClientRect()
		const position = e.clientX - trackRect.left
		const commission = getCommissionByPosition(position)

		currentCommission = commission
		updateSliderPosition(commission)
	})

	// Обробник для сенсорних пристроїв на трек слайдера
	sliderTrack.addEventListener('touchstart', e => {
		const trackRect = sliderTrack.getBoundingClientRect()
		const touch = e.touches[0]
		const position = touch.clientX - trackRect.left
		const commission = getCommissionByPosition(position)

		currentCommission = commission
		updateSliderPosition(commission)
	})

	// Обробник для підтвердження зміни комісії
	commissionModalConfirm.addEventListener('click', () => {
		// Оновлюємо текст комісії в основному попапі
		const commissionSpans = document.querySelectorAll(
			'.swapper__rate-commission span'
		)
		commissionSpans.forEach(span => {
			span.textContent = `${currentCommission} USDT`
		})

		// Закриваємо попап
		closeCommissionModal()

		// Показуємо повідомлення про успішну зміну
		showCommissionChangeSuccess()
	})

	// Функція для показу повідомлення про успішну зміну комісії
	function showCommissionChangeSuccess() {
		// Створюємо повідомлення
		const message = document.createElement('div')
		message.className = 'commission-change-success'
		message.textContent = `Комісію мережі змінено на ${currentCommission} USDT`
		message.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: #10b981;
			color: white;
			padding: 12px 20px;
			border-radius: 8px;
			font-family: Montserrat, sans-serif;
			font-size: 14px;
			font-weight: 500;
			z-index: 10001;
			box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
			transform: translateX(100%);
			transition: transform 0.3s ease;
		`

		document.body.appendChild(message)

		// Показуємо повідомлення
		setTimeout(() => {
			message.style.transform = 'translateX(0)'
		}, 100)

		// Приховуємо повідомлення через 3 секунди
		setTimeout(() => {
			message.style.transform = 'translateX(100%)'
			setTimeout(() => {
				document.body.removeChild(message)
			}, 300)
		}, 3000)
	}

	// Додаємо обробник для span з комісією
	function initCommissionSpanHandlers() {
		const commissionSpans = document.querySelectorAll(
			'.swapper__rate-commission span'
		)
		commissionSpans.forEach(span => {
			span.style.cursor = 'pointer'
			span.style.textDecoration = 'underline'
			span.style.color = '#3b82f6'
			span.addEventListener('click', openCommissionModal)
		})
	}

	// Ініціалізуємо обробники після завантаження DOM
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initCommissionSpanHandlers)
	} else {
		initCommissionSpanHandlers()
	}

	// Ініціалізуємо обробники для динамічно створених елементів
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			mutation.addedNodes.forEach(node => {
				if (node.nodeType === 1) {
					// Element node
					const commissionSpans = node.querySelectorAll
						? node.querySelectorAll('.swapper__rate-commission span')
						: []
					commissionSpans.forEach(span => {
						if (!span.hasAttribute('data-commission-handler')) {
							span.setAttribute('data-commission-handler', 'true')
							span.style.cursor = 'pointer'
							span.style.textDecoration = 'underline'
							span.style.color = '#3b82f6'
							span.addEventListener('click', openCommissionModal)
						}
					})
				}
			})
		})
	})

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	})

	console.log('=== ПОПАП ЗМІНИ КОМІСІЇ ІНІЦІАЛІЗОВАНО УСПІШНО ===')
}

// Функція для роботи з dropdown меню користувача
function initUserDropdown() {
	const userSelector = document.querySelector('.main__user-selector')
	const userCurrent = document.querySelector('.main__user-current')
	const userDropdownMenu = document.querySelector('.main__user-dropdown-menu')
	const userOptions = document.querySelectorAll('.main__user-option')

	if (!userSelector) {
		console.log('Dropdown меню користувача не знайдено')
		return
	}

	// Відкриття/закриття dropdown при кліку
	userCurrent.addEventListener('click', e => {
		e.stopPropagation()

		// Закриваємо language dropdown якщо він відкритий
		const languageSelector = document.querySelector('.main__language-selector')
		if (languageSelector && languageSelector.classList.contains('active')) {
			languageSelector.classList.remove('active')
		}

		userSelector.classList.toggle('active')
	})

	// Закриття dropdown при кліку поза ним
	document.addEventListener('click', e => {
		if (!userSelector.contains(e.target)) {
			userSelector.classList.remove('active')
		}
	})

	// Закриття dropdown при натисканні Escape
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			if (userSelector.classList.contains('active')) {
				userSelector.classList.remove('active')
			}
			// Також закриваємо language dropdown якщо він відкритий
			const languageSelector = document.querySelector(
				'.main__language-selector'
			)
			if (languageSelector && languageSelector.classList.contains('active')) {
				languageSelector.classList.remove('active')
			}
		}
	})

	// Обробка вибору опцій меню
	userOptions.forEach(option => {
		option.addEventListener('click', e => {
			e.stopPropagation()
			const value = option.getAttribute('data-value')

			console.log('Вибрано опцію:', value)

			// Закриваємо dropdown
			userSelector.classList.remove('active')

			// Обробка різних опцій
			switch (value) {
				case 'applications':
					handleApplications()
					break
				case 'details':
					handleDetails()
					break
				case 'partners':
					handlePartners()
					break
				case 'profile':
					handleProfile()
					break
				case 'logout':
					handleLogout()
					break
			}
		})
	})

	// Функції обробки опцій меню
	function handleApplications() {
		console.log('Перехід до заявок')
		// Тут можна додати логіку переходу до сторінки заявок
		alert('Перехід до заявок')
	}

	function handleDetails() {
		console.log('Перехід до реквізитів')
		// Тут можна додати логіку переходу до сторінки реквізитів
		alert('Перехід до реквізитів')
	}

	function handlePartners() {
		console.log('Перехід до партнерів')
		// Тут можна додати логіку переходу до сторінки партнерів
		window.location.href = './partners.html'
	}

	function handleProfile() {
		console.log('Перехід до профілю')
		// Тут можна додати логіку переходу до сторінки профілю
		alert('Перехід до профілю')
	}

	function handleLogout() {
		console.log('Вихід з системи')
		// Тут можна додати логіку виходу з системи
		if (confirm('Ви дійсно хочете вийти з системи?')) {
			// Імітація виходу - замінюємо dropdown на кнопку "Увійти"
			replaceUserDropdownWithLoginButton()
		}
	}

	// Функція для заміни dropdown на кнопку "Увійти" (при виході)
	function replaceUserDropdownWithLoginButton() {
		const userDropdown = document.querySelector('.main__user-dropdown')
		if (userDropdown) {
			const loginButton = document.createElement('button')
			loginButton.className = 'main__button'
			loginButton.textContent = 'Увійти'

			// Додаємо обробник для кнопки "Увійти"
			loginButton.addEventListener('click', function (e) {
				e.preventDefault()
				openAuthModal()
			})

			userDropdown.replaceWith(loginButton)

			// Оновлюємо глобальну змінну
			window.loginButton = loginButton

			console.log('Користувач вийшов з системи')
		}
	}

	// Функція для заміни кнопки "Увійти" на dropdown меню користувача (при авторизації)
	function replaceLoginButtonWithUserDropdown() {
		const loginButton = document.querySelector('.main__button')
		if (loginButton) {
			const userDropdown = document.createElement('div')
			userDropdown.className = 'main__user-dropdown'
			userDropdown.innerHTML = `
				<div class="main__user-selector">
					<div class="main__user-current">
						<div class="main__user-avatar">
							<span class="main__user-avatar-text">D</span>
						</div>
						<span class="main__user-email">desi...@proton.me</span>
						<img src="./images/dropdown-arrow.svg" alt="dropdown" class="main__user-arrow">
					</div>
					<div class="main__user-dropdown-menu">
						<div class="main__user-option" data-value="applications">
							<span class="main__user-option-text">Мої заявки</span>
							<span class="main__user-option-text">0</span>
						</div>
						<div class="main__user-option" data-value="details">
							<span class="main__user-option-text">Мої реквізити</span>
						</div>
						<div class="main__user-option" data-value="partners">
							<span class="main__user-option-text">Партнерам</span>
						</div>
						<div class="main__user-option" data-value="profile">
							<span class="main__user-option-text">Профіль</span>
						</div>
						<div class="main__user-divider"></div>
						<div class="main__user-option" data-value="logout">
							<span class="main__user-option-text">Вийти</span>
						</div>
					</div>
				</div>
			`

			loginButton.replaceWith(userDropdown)

			// Ініціалізуємо dropdown меню для нового елемента
			initUserDropdown()

			console.log('Користувач успішно авторизований')
		}
	}

	console.log('Dropdown меню користувача ініціалізовано')
}

// Функціональність для плашки з уведомленням про cookies
function initCookieNotice() {
	const cookieNotice = document.getElementById('cookieNotice')
	const cookieCloseBtn = document.getElementById('cookieNoticeClose')

	if (!cookieNotice || !cookieCloseBtn) {
		console.log('Елементи плашки cookies не знайдено')
		return
	}

	// Перевіряємо, чи користувач вже прийняв cookies
	const cookiesAccepted = localStorage.getItem('cookiesAccepted')

	if (!cookiesAccepted) {
		// Показуємо плашку через 1 секунду після завантаження сторінки
		setTimeout(() => {
			cookieNotice.classList.add('active')
		}, 1000)
	}

	// Обробник для кнопки закриття
	cookieCloseBtn.addEventListener('click', function () {
		// Зберігаємо в localStorage, що користувач прийняв cookies
		localStorage.setItem('cookiesAccepted', 'true')

		// Приховуємо плашку з анімацією
		cookieNotice.classList.remove('active')

		console.log('Користувач прийняв cookies')
	})

	// Обробник для посилання на політику cookies
	const cookieLink = cookieNotice.querySelector('.cookie-notice__link')
	if (cookieLink) {
		cookieLink.addEventListener('click', function (e) {
			e.preventDefault()
			// Тут можна додати логіку переходу до сторінки політики cookies
			alert('Перехід до політики використання файлів cookies')
		})
	}

	console.log('Плашка cookies ініціалізована')
}

// Ініціалізуємо плашку cookies при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function () {
	initCookieNotice()
})

// Функція для ініціалізації бургер меню
function initBurgerMenu() {
	const burgerButton = document.querySelector('.main__burger')
	const mobileMenu = document.querySelector('.mobile-menu')
	const mobileMenuClose = document.querySelector('.mobile-menu__close')
	const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link')
	const mobileMenuLogout = document.querySelector('.mobile-menu__logout')
	const mobileMenuBurger = document.querySelector('.mobile-menu .main__burger')

	if (!burgerButton || !mobileMenu) {
		console.log('Елементи бургер меню не знайдено')
		return
	}

	// Відкриття мобільного меню при кліку на бургер
	burgerButton.addEventListener('click', function (e) {
		e.preventDefault()
		e.stopPropagation()

		if (mobileMenu.classList.contains('active')) {
			closeMobileMenu()
		} else {
			mobileMenu.classList.add('active')
			burgerButton.classList.add('active')
			document.body.classList.add('no-scroll')
			console.log('Мобільне меню відкрито')
		}
	})

	// Закриття мобільного меню при кліку на кнопку закриття
	if (mobileMenuClose) {
		mobileMenuClose.addEventListener('click', closeMobileMenu)
	}

	// Закриття мобільного меню при кліку на бургер в мобільному меню
	if (mobileMenuBurger) {
		mobileMenuBurger.addEventListener('click', function (e) {
			e.preventDefault()
			e.stopPropagation()
			closeMobileMenu()
		})
	}

	// Закриття мобільного меню при кліку на логотип
	const mobileMenuLogo = document.querySelector('.mobile-menu__logo')
	if (mobileMenuLogo) {
		mobileMenuLogo.addEventListener('click', function () {
			closeMobileMenu()
		})
	}

	// Закриття мобільного меню при кліку на посилання "Мій аккаунт"
	const mobileMenuAccount = document.querySelector('.mobile-menu__account')
	if (mobileMenuAccount) {
		mobileMenuAccount.addEventListener('click', function () {
			closeMobileMenu()
		})
	}

	// Закриття мобільного меню при кліку на посилання
	mobileMenuLinks.forEach(link => {
		link.addEventListener('click', function () {
			closeMobileMenu()
		})
	})

	// Закриття мобільного меню при кліку на кнопку "Вийти"
	if (mobileMenuLogout) {
		mobileMenuLogout.addEventListener('click', function () {
			if (confirm('Ви дійсно хочете вийти з системи?')) {
				closeMobileMenu()
				// Тут можна додати логіку виходу з системи
				console.log('Користувач вийшов з системи через мобільне меню')
			}
		})
	}

	// Закриття мобільного меню при кліку на будь-яку кнопку або посилання в мобільному меню
	const mobileMenuInteractiveElements = mobileMenu.querySelectorAll(
		'button, a, .mobile-menu__language-selector'
	)
	mobileMenuInteractiveElements.forEach(element => {
		element.addEventListener('click', function (e) {
			// Не закриваємо меню для елементів, які вже мають власні обробники
			if (
				!element.classList.contains('mobile-menu__language-selector') &&
				!element.classList.contains('mobile-menu__logout') &&
				!element.classList.contains('mobile-menu__account') &&
				!element.classList.contains('mobile-menu__link') &&
				!element.classList.contains('main__burger')
			) {
				closeMobileMenu()
			}
		})
	})

	// Закриття мобільного меню при кліку поза ним
	document.addEventListener('click', function (e) {
		if (
			mobileMenu.classList.contains('active') &&
			!mobileMenu.contains(e.target) &&
			!burgerButton.contains(e.target)
		) {
			closeMobileMenu()
		}
	})

	// Закриття мобільного меню при кліку на порожню область мобільного меню
	mobileMenu.addEventListener('click', function (e) {
		// Перевіряємо, чи клік був на порожню область (не на інтерактивні елементи)
		if (
			e.target === mobileMenu ||
			e.target.classList.contains('mobile-menu__main') ||
			e.target.classList.contains('mobile-menu__user') ||
			e.target.classList.contains('mobile-menu__nav') ||
			e.target.classList.contains('mobile-menu__footer')
		) {
			closeMobileMenu()
		}
	})

	// Закриття мобільного меню при натисканні Escape
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
			closeMobileMenu()
		}
	})

	// Закриття мобільного меню при свайпі вліво (для мобільних пристроїв)
	let touchStartX = 0
	let touchEndX = 0

	mobileMenu.addEventListener('touchstart', function (e) {
		touchStartX = e.changedTouches[0].screenX
	})

	mobileMenu.addEventListener('touchend', function (e) {
		touchEndX = e.changedTouches[0].screenX
		handleSwipe()
	})

	function handleSwipe() {
		const swipeThreshold = 50
		const swipeDistance = touchStartX - touchEndX

		if (swipeDistance > swipeThreshold) {
			// Свайп вліво - закриваємо меню
			closeMobileMenu()
		}
	}

	// Функція для закриття мобільного меню
	function closeMobileMenu() {
		mobileMenu.classList.remove('active')
		burgerButton.classList.remove('active')
		document.body.classList.remove('no-scroll')
		console.log('Мобільне меню закрито')
	}

	// Ініціалізація мобільного вибору мови
	initMobileLanguageDropdown()

	console.log('Бургер меню ініціалізовано')
}

// Функція для роботи з мобільним dropdown вибору мови
function initMobileLanguageDropdown() {
	const mobileLanguageSelector = document.querySelector(
		'.mobile-menu__language-selector'
	)
	const mobileLanguageCurrent = document.querySelector(
		'.mobile-menu__language-current'
	)
	const mobileLanguageDropdown = document.querySelector(
		'.mobile-menu__language-dropdown'
	)
	const mobileLanguageOptions = document.querySelectorAll(
		'.mobile-menu__language-option'
	)
	const mobileLanguageText = document.querySelector(
		'.mobile-menu__language-text'
	)

	if (!mobileLanguageSelector) {
		console.log('Мобільний вибір мови не знайдено')
		return
	}

	// Відкриття/закриття dropdown при кліку
	mobileLanguageCurrent.addEventListener('click', e => {
		e.stopPropagation()
		mobileLanguageSelector.classList.toggle('active')
	})

	// Закриття dropdown при кліку поза ним
	document.addEventListener('click', e => {
		if (!mobileLanguageSelector.contains(e.target)) {
			mobileLanguageSelector.classList.remove('active')
		}
	})

	// Закриття dropdown при натисканні Escape
	document.addEventListener('keydown', e => {
		if (
			e.key === 'Escape' &&
			mobileLanguageSelector.classList.contains('active')
		) {
			mobileLanguageSelector.classList.remove('active')
		}
	})

	// Обробка вибору мови
	mobileLanguageOptions.forEach(option => {
		option.addEventListener('click', () => {
			const value = option.getAttribute('data-value')
			const text = option.querySelector(
				'.mobile-menu__language-option-text'
			)?.textContent

			// Оновлюємо відображуваний текст
			if (mobileLanguageText) {
				mobileLanguageText.textContent = value.toUpperCase()
			}

			// Оновлюємо активний стан опцій
			mobileLanguageOptions.forEach(opt => opt.classList.remove('active'))
			option.classList.add('active')

			// Закриваємо dropdown
			mobileLanguageSelector.classList.remove('active')

			// Синхронізуємо з десктопним вибором мови
			const desktopLanguageText = document.querySelector('.main__language-text')
			if (desktopLanguageText) {
				desktopLanguageText.textContent = value.toUpperCase()
			}

			// Тут можна додати логіку для зміни мови на сайті
			changeLanguage(value)
		})
	})

	// Встановлюємо початковий активний стан для української мови
	const ukrainianOption = document.querySelector(
		'.mobile-menu__language-option[data-value="ua"]'
	)
	if (ukrainianOption) {
		ukrainianOption.classList.add('active')
	}

	console.log('Мобільний вибір мови ініціалізовано')
}

// Функція для роботи з модальним вікном повідомлення
function initNotificationModal() {
	const notificationModal = document.getElementById('notificationModal')
	const notificationModalClose = document.getElementById(
		'notificationModalClose'
	)
	const notificationModalOk = document.getElementById('notificationModalOk')
	const notificationModalOverlay = notificationModal?.querySelector(
		'.notification-modal__overlay'
	)

	if (!notificationModal) {
		console.log('Модальне вікно повідомлення не знайдено')
		return
	}

	// Функція для відкриття модального вікна
	function openNotificationModal() {
		notificationModal.classList.add('active')
		document.body.classList.add('no-scroll')
		console.log('Модальне вікно повідомлення відкрито')
	}

	// Функція для закриття модального вікна
	function closeNotificationModal() {
		notificationModal.classList.remove('active')
		document.body.classList.remove('no-scroll')
		console.log('Модальне вікно повідомлення закрито')
	}

	// Закриття при кліку на кнопку закриття
	if (notificationModalClose) {
		notificationModalClose.addEventListener('click', closeNotificationModal)
	}

	// Закриття при кліку на кнопку "Хорошо"
	if (notificationModalOk) {
		notificationModalOk.addEventListener('click', closeNotificationModal)
	}

	// Закриття при кліку на overlay
	if (notificationModalOverlay) {
		notificationModalOverlay.addEventListener('click', closeNotificationModal)
	}

	// Закриття при натисканні Escape
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape' && notificationModal.classList.contains('active')) {
			closeNotificationModal()
		}
	})

	// Робимо функції глобальними для використання в інших місцях
	window.openNotificationModal = openNotificationModal
	window.closeNotificationModal = closeNotificationModal

	console.log('Модальне вікно повідомлення ініціалізовано')
}

// Ініціалізація модального вікна повідомлення при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
	initNotificationModal()
	initAddAccountModal()
})

// Функція для роботи з модальним вікном додавання рахунку
function initAddAccountModal() {
	const addAccountModal = document.getElementById('addAccountModal')
	const addAccountModalClose = document.getElementById('addAccountModalClose')
	const addAccountForm = document.getElementById('addAccountForm')
	const addAccountStatus = document.getElementById('accountStatus')
	const addAccountModalOverlay = addAccountModal?.querySelector(
		'.add-account-modal__overlay'
	)

	if (!addAccountModal) {
		console.log('Модальне вікно додавання рахунку не знайдено')
		return
	}

	// Ініціалізуємо вибір валюти в попапі
	initAddAccountCurrencySelector()

	// Функція для відкриття модального вікна
	function openAddAccountModal() {
		addAccountModal.classList.add('active')
		document.body.classList.add('no-scroll')
		console.log('Модальне вікно додавання рахунку відкрито')
	}

	// Функція для закриття модального вікна
	function closeAddAccountModal() {
		addAccountModal.classList.remove('active')
		document.body.classList.remove('no-scroll')
		// Скидаємо форму та статус
		if (addAccountForm) {
			addAccountForm.reset()
		}
		if (addAccountStatus) {
			addAccountStatus.style.display = 'none'
		}
		console.log('Модальне вікно додавання рахунку закрито')
	}

	// Функція для ініціалізації вибору валюти
	function initAddAccountCurrencySelector() {
		const selectWrapper = addAccountModal.querySelector(
			'.add-account-modal__select-wrapper'
		)
		if (!selectWrapper) {
			console.log('Select wrapper не знайдено')
			return
		}

		const dropdown = selectWrapper.querySelector(
			'.add-account-modal__currency-dropdown'
		)
		const arrow = selectWrapper.querySelector(
			'.add-account-modal__select-arrow'
		)
		const searchInput = selectWrapper.querySelector(
			'.add-account-modal__currency-search-input'
		)
		const currencyItems = selectWrapper.querySelectorAll(
			'.add-account-modal__currency-item'
		)
		const iconImg = selectWrapper.querySelector(
			'.add-account-modal__currency-icon'
		)
		const selectedText = selectWrapper.querySelector(
			'.add-account-modal__select-text'
		)

		console.log('Знайдено елементи:', {
			selectWrapper: !!selectWrapper,
			dropdown: !!dropdown,
			arrow: !!arrow,
			searchInput: !!searchInput,
			currencyItems: currencyItems.length,
			iconImg: !!iconImg,
			selectedText: !!selectedText,
		})

		// Відкриття/закриття dropdown при кліку на wrapper
		selectWrapper.addEventListener('click', e => {
			e.preventDefault()
			e.stopPropagation()

			const isActive = dropdown.classList.contains('active')

			// Закриваємо всі інші dropdown
			document
				.querySelectorAll('.add-account-modal__currency-dropdown.active')
				.forEach(dd => {
					if (dd !== dropdown) {
						dd.classList.remove('active')
						// Повертаємо стрілки інших wrapper'ів
						const otherWrapper = dd.closest(
							'.add-account-modal__select-wrapper'
						)
						if (otherWrapper) {
							otherWrapper.classList.remove('active')
						}
					}
				})

			// Переключаємо поточний dropdown
			if (isActive) {
				dropdown.classList.remove('active')
				selectWrapper.classList.remove('active')
			} else {
				dropdown.classList.add('active')
				selectWrapper.classList.add('active')
			}

			// Фокус на пошукове поле при відкритті
			if (!isActive && searchInput) {
				setTimeout(() => searchInput.focus(), 100)
			}
		})

		// Запобігаємо закриттю dropdown при кліку всередині нього
		dropdown.addEventListener('click', e => {
			e.stopPropagation()
		})

		// Пошук валют
		if (searchInput) {
			searchInput.addEventListener('input', e => {
				const searchTerm = e.target.value.toLowerCase()
				currencyItems.forEach(item => {
					const text = item
						.querySelector('.add-account-modal__currency-item-text')
						.textContent.toLowerCase()
					if (text.includes(searchTerm)) {
						item.style.display = 'flex'
					} else {
						item.style.display = 'none'
					}
				})
			})
		}

		// Вибір валюти
		currencyItems.forEach(item => {
			item.addEventListener('click', () => {
				const value = item.dataset.value
				const text = item.dataset.text
				const iconSrc = item.dataset.icon

				// Видаляємо виділення з усіх елементів
				currencyItems.forEach(i => i.classList.remove('selected'))

				// Додаємо виділення до поточного елемента
				item.classList.add('selected')

				// Оновлюємо іконку та текст
				if (iconImg) {
					iconImg.src = iconSrc
					iconImg.alt = value.toUpperCase()
				}
				if (selectedText) {
					selectedText.textContent = text
				}

				// Закриваємо dropdown
				dropdown.classList.remove('active')
				selectWrapper.classList.remove('active')

				// Зберігаємо вибрану валюту в localStorage
				localStorage.setItem(
					'selectedCurrency',
					JSON.stringify({ value, text, icon: iconSrc })
				)

				console.log('Вибрано валюту:', { value, text })
			})
		})

		// Відновлюємо вибрану валюту при завантаженні
		const savedCurrency = localStorage.getItem('selectedCurrency')
		if (savedCurrency && iconImg && selectedText) {
			try {
				const currency = JSON.parse(savedCurrency)
				iconImg.src = currency.icon
				iconImg.alt = currency.value.toUpperCase()
				selectedText.textContent = currency.text

				// Знаходимо та виділяємо відповідний елемент валюти
				currencyItems.forEach(item => {
					if (item.dataset.value === currency.value) {
						item.classList.add('selected')
					}
				})
			} catch (e) {
				console.log('Помилка відновлення валюти:', e)
			}
		} else {
			// Якщо немає збереженої валюти, виділяємо першу (USDT TRC20)
			if (currencyItems.length > 0) {
				currencyItems[0].classList.add('selected')
			}
		}

		// Закриття dropdown при кліку поза ним
		document.addEventListener('click', e => {
			if (!selectWrapper.contains(e.target)) {
				dropdown.classList.remove('active')
				selectWrapper.classList.remove('active')
			}
		})

		// Закриття dropdown при натисканні Escape
		document.addEventListener('keydown', e => {
			if (e.key === 'Escape' && dropdown.classList.contains('active')) {
				dropdown.classList.remove('active')
				selectWrapper.classList.remove('active')
			}
		})
	}

	// Обробник відправки форми
	if (addAccountForm) {
		addAccountForm.addEventListener('submit', function (e) {
			e.preventDefault()

			const formData = new FormData(this)
			const accountNumber = formData.get('accountNumber')
			const accountComment = formData.get('accountComment')
			const selectedCurrencyText = document.getElementById(
				'selectedCurrencyText'
			)

			// Валідація форми
			if (!accountNumber || accountNumber.trim() === '') {
				alert('Будь ласка, введіть номер рахунку')
				return
			}

			if (!selectedCurrencyText || !selectedCurrencyText.textContent) {
				alert('Будь ласка, виберіть валюту')
				return
			}

			// Тут можна додати додаткову валідацію та відправку даних на сервер
			console.log('Дані форми:', {
				accountNumber: accountNumber.trim(),
				accountComment: accountComment ? accountComment.trim() : '',
				currency: selectedCurrencyText.textContent,
			})

			// Показуємо статус успіху
			if (addAccountStatus) {
				addAccountStatus.style.display = 'block'
			}

			// Закриваємо модальне вікно через 2 секунди
			setTimeout(() => {
				closeAddAccountModal()
			}, 2000)
		})
	}

	// Закриття при кліку на кнопку закриття
	if (addAccountModalClose) {
		addAccountModalClose.addEventListener('click', closeAddAccountModal)
	}

	// Закриття при кліку на overlay
	if (addAccountModalOverlay) {
		addAccountModalOverlay.addEventListener('click', closeAddAccountModal)
	}

	// Закриття при натисканні Escape
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape' && addAccountModal.classList.contains('active')) {
			closeAddAccountModal()
		}
	})

	// Робимо функції глобальними для використання в інших місцях
	window.openAddAccountModal = openAddAccountModal
	window.closeAddAccountModal = closeAddAccountModal

	console.log('Модальне вікно додавання рахунку ініціалізовано')
}

// Функціональність для exchange rate tooltip
function initExchangeRateTooltip() {
	console.log('Ініціалізація exchange rate tooltip...')

	const exchangeRateBtn = document.getElementById('exchangeRateBtn')
	const tooltip = document.getElementById('exchangeRateTooltip')

	console.log('Знайдені елементи:', { exchangeRateBtn, tooltip })

	if (!exchangeRateBtn || !tooltip) {
		console.log('Exchange rate tooltip елементи не знайдено')
		return
	}

	// Показ tooltip при кліку
	exchangeRateBtn.addEventListener('click', function (e) {
		console.log('Клік на exchange rate кнопку')
		e.preventDefault()
		e.stopPropagation()

		// Переключаємо видимість tooltip
		const isVisible = tooltip.classList.contains('show')
		console.log('Tooltip видимий:', isVisible)

		if (isVisible) {
			tooltip.classList.remove('show')
			console.log('Tooltip приховано')
		} else {
			// Закриваємо всі інші tooltip'и
			document.querySelectorAll('.exchange-rate-tooltip.show').forEach(t => {
				if (t !== tooltip) {
					t.classList.remove('show')
				}
			})

			// Показуємо tooltip з невеликою затримкою для плавності
			setTimeout(() => {
				tooltip.classList.add('show')
				console.log('Tooltip показано')
			}, 50)
		}
	})

	// Закриття tooltip при кліку поза ним або на нього
	document.addEventListener('click', function (e) {
		if (!exchangeRateBtn.contains(e.target)) {
			tooltip.classList.remove('show')
		}
	})

	// Закриття tooltip при натисканні Escape
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && tooltip.classList.contains('show')) {
			tooltip.classList.remove('show')
		}
	})

	console.log('Exchange rate tooltip ініціалізовано успішно')
}

// Ініціалізація tooltip при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function () {
	console.log('DOM завантажено, ініціалізую tooltip...')
	initExchangeRateTooltip()
})

// Також спробуємо ініціалізувати після завантаження всіх ресурсів
window.addEventListener('load', function () {
	console.log('Всі ресурси завантажено, перевіряю tooltip...')
	if (!document.getElementById('exchangeRateBtn')) {
		console.log('Кнопка все ще не знайдена, спробую ще раз...')
		setTimeout(initExchangeRateTooltip, 100)
	}
})

// Простий тест - додаємо alert для перевірки
console.log('=== ТЕСТ TOOLTIP ===')
console.log('Кнопка знайдена:', !!document.getElementById('exchangeRateBtn'))
console.log(
	'Tooltip знайдено:',
	!!document.getElementById('exchangeRateTooltip')
)

// Додаємо простий тестовий tooltip
setTimeout(function () {
	const btn = document.getElementById('exchangeRateBtn')
	const tooltip = document.getElementById('exchangeRateTooltip')

	if (btn && tooltip) {
		console.log('✅ Елементи знайдено!')
		btn.style.border = '2px solid red'
		tooltip.style.border = '2px solid blue'
		console.log('Додано червоні рамки для тестування')

		// Активуємо тестовий режим tooltip
		tooltip.classList.add('test-mode')
		console.log('🎯 ТЕСТОВИЙ TOOLTIP АКТИВОВАНО!')
		console.log(
			'Тепер tooltip має бути видимий завжди (червоний з жовтою рамкою)'
		)
	} else {
		console.log('❌ Елементи НЕ знайдено!')
		console.log('btn:', btn)
		console.log('tooltip:', tooltip)
	}
}, 1000)

// Функціональність для QR попапу
function initQRModal() {
	const qrModal = document.getElementById('qrModal')
	const qrModalClose = document.getElementById('qrModalClose')
	const qrButtons = document.querySelectorAll('.qr-btn')
	const copyBtn = document.querySelector('.qr-modal__copy-btn')
	const walletAddress = document.querySelector('.qr-modal__wallet-address')

	if (!qrModal || !qrModalClose) {
		console.log('QR modal елементи не знайдено')
		return
	}

	// Функція для відкриття QR попапу
	function openQRModal() {
		qrModal.classList.add('active')
		document.body.classList.add('no-scroll')
		console.log('QR modal відкрито')
	}

	// Функція для закриття QR попапу
	function closeQRModal() {
		qrModal.classList.remove('active')
		document.body.classList.remove('no-scroll')
		console.log('QR modal закрито')
	}

	// Відкриття попапу при кліку на кнопки з класом qr-btn
	qrButtons.forEach(button => {
		button.addEventListener('click', function (e) {
			e.preventDefault()
			e.stopPropagation()
			openQRModal()
		})
	})

	// Закриття попапу при кліку на кнопку закриття
	qrModalClose.addEventListener('click', closeQRModal)

	// Закриття попапу при кліку на overlay
	qrModal.addEventListener('click', function (e) {
		if (
			e.target === qrModal ||
			e.target.classList.contains('qr-modal__overlay')
		) {
			closeQRModal()
		}
	})

	// Закриття попапу при натисканні Escape
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && qrModal.classList.contains('active')) {
			closeQRModal()
		}
	})

	// Функціональність копіювання адреси гаманця
	if (copyBtn && walletAddress) {
		// Функція для обрізання адреси посередині
		function truncateAddress(address) {
			if (address.length <= 20) return address
			const start = address.substring(0, 10)
			const end = address.substring(address.length - 10)
			return `${start}...${end}`
		}

		// Встановлюємо обрізану адресу
		const fullAddress = walletAddress.textContent
		walletAddress.textContent = truncateAddress(fullAddress)

		copyBtn.addEventListener('click', function () {
			// Копіюємо в буфер обміну повну адресу
			navigator.clipboard
				.writeText(fullAddress)
				.then(function () {
					console.log('Адресу скопійовано:', fullAddress)

					// Показуємо візуальний фідбек
					const originalText = copyBtn.innerHTML
					copyBtn.innerHTML = `
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="#28a745"/>
					</svg>
				`

					// Повертаємо оригінальну іконку через 2 секунди
					setTimeout(() => {
						copyBtn.innerHTML = originalText
					}, 2000)
				})
				.catch(function (err) {
					console.error('Помилка копіювання:', err)
				})
		})
	}

	console.log('QR modal ініціалізовано успішно')
}

// Ініціалізація QR modal при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function () {
	console.log('DOM завантажено, ініціалізую QR modal...')
	initQRModal()
})

// Також спробуємо ініціалізувати після завантаження всіх ресурсів
window.addEventListener('load', function () {
	console.log('Всі ресурси завантажено, перевіряю QR modal...')
	if (!document.getElementById('qrModal')) {
		console.log('QR modal все ще не знайдено, спробую ще раз...')
		setTimeout(initQRModal, 100)
	}
})

// Ініціалізація функціональності сторінки "Мої заявки"
function initOrdersPage() {
	console.log('Ініціалізую сторінку "Мої заявки"...')

	// Елементи табів
	const ordersTabs = document.querySelectorAll('.orders-tab')
	const ordersContents = document.querySelectorAll('.orders-content')

	// Функція переключення між табами
	function switchTab(tabName) {
		console.log('Переключаю на таб:', tabName)

		// Видаляємо активний клас з усіх табів
		ordersTabs.forEach(tab => {
			tab.classList.remove('orders-tab--active')
		})

		// Приховуємо всі контенти
		ordersContents.forEach(content => {
			content.classList.remove('orders-content--active')
		})

		// Активуємо потрібний таб та контент
		const activeTab = document.querySelector(`[data-tab="${tabName}"]`)
		const activeContent = document.querySelector(`[data-content="${tabName}"]`)

		if (activeTab && activeContent) {
			activeTab.classList.add('orders-tab--active')
			activeContent.classList.add('orders-content--active')
		}
	}

	// Додаємо обробники подій для табів
	ordersTabs.forEach(tab => {
		tab.addEventListener('click', function () {
			const tabName = this.getAttribute('data-tab')
			switchTab(tabName)
		})
	})

	// Функціональність пошуку
	const searchInput = document.querySelector('.orders-search-input')
	const searchBtn = document.querySelector('.orders-search-btn')

	if (searchInput && searchBtn) {
		function performSearch() {
			const searchTerm = searchInput.value.trim().toLowerCase()
			console.log('Виконую пошук:', searchTerm)

			if (searchTerm === '') {
				// Показуємо всі рядки, якщо пошук порожній
				document.querySelectorAll('.orders-table-row').forEach(row => {
					row.style.display = ''
				})
				return
			}

			// Шукаємо по номеру заявки
			document.querySelectorAll('.orders-table-row').forEach(row => {
				const orderId = row.querySelector('.orders-table-order-id')
				if (orderId) {
					const orderIdText = orderId.textContent.toLowerCase()
					if (orderIdText.includes(searchTerm)) {
						row.style.display = ''
					} else {
						row.style.display = 'none'
					}
				}
			})
		}

		// Пошук при натисканні Enter
		searchInput.addEventListener('keypress', function (e) {
			if (e.key === 'Enter') {
				performSearch()
			}
		})

		// Пошук при кліку на кнопку
		searchBtn.addEventListener('click', performSearch)

		// Пошук при введенні тексту (з затримкою)
		let searchTimeout
		searchInput.addEventListener('input', function () {
			clearTimeout(searchTimeout)
			searchTimeout = setTimeout(performSearch, 300)
		})
	}

	// Функціональність сортування таблиці
	const sortableHeaders = document.querySelectorAll(
		'.orders-table-header--sortable'
	)

	sortableHeaders.forEach(header => {
		header.addEventListener('click', function () {
			const columnIndex = Array.from(this.parentElement.children).indexOf(this)
			const tableBody = this.closest('table').querySelector('tbody')
			const rows = Array.from(tableBody.querySelectorAll('tr'))

			// Визначаємо тип даних для сортування
			const isDate = this.textContent.includes('Дата')
			const isAmount =
				this.textContent.includes('Відправляєте') ||
				this.textContent.includes('Отримуєте')

			// Сортуємо рядки
			rows.sort((a, b) => {
				const aValue = a.children[columnIndex].textContent.trim()
				const bValue = b.children[columnIndex].textContent.trim()

				if (isDate) {
					// Сортування по даті
					const aDate = new Date(aValue)
					const bDate = new Date(bValue)
					return aDate - bDate
				} else if (isAmount) {
					// Сортування по сумі
					const aNum = parseFloat(aValue.replace(/[^\d.-]/g, ''))
					const bNum = parseFloat(bValue.replace(/[^\d.-]/g, ''))
					return aNum - bNum
				} else {
					// Звичайне текстове сортування
					return aValue.localeCompare(bValue, 'uk')
				}
			})

			// Переставляємо рядки в таблиці
			rows.forEach(row => tableBody.appendChild(row))
		})
	})

	// Функціональність кнопки "Більше опцій" (•••)
	const moreButtons = document.querySelectorAll('.orders-table-more')

	moreButtons.forEach(button => {
		button.addEventListener('click', function (e) {
			e.stopPropagation()
			const row = this.closest('tr')
			const orderId = row.querySelector('.orders-table-order-id').textContent
			console.log('Відкриваю меню для заявки:', orderId)

			// Тут можна додати логіку відкриття контекстного меню
			// Наприклад, показ dropdown з опціями: "Переглянути", "Скасувати", тощо
		})
	})

	console.log('Сторінка "Мої заявки" ініціалізована успішно')
}

// Функціональність для перемикання між станом "немає даних" та таблицею
function initOrdersTableToggle() {
	const emptyState = document.querySelector('.orders-table__empty')
	const table = document.querySelector('.orders-table')
	const summaryText = document.querySelector('.orders__summary-text')
	const pagination = document.querySelector('.orders__pagination')

	if (!emptyState || !table || !summaryText) {
		console.log('Елементи таблиці не знайдено')
		return
	}

	// Функція для показу стану "немає даних"
	function showEmptyState() {
		emptyState.classList.add('orders-table__empty--active')
		table.classList.add('orders-table--hidden')
		if (pagination) {
			pagination.classList.add('orders__pagination--hidden')
		}
		summaryText.textContent = ' 0'
		console.log('Показано стан "немає даних"')
	}

	// Функція для показу таблиці з даними
	function showTableWithData() {
		emptyState.classList.remove('orders-table__empty--active')
		table.classList.remove('orders-table--hidden')
		if (pagination) {
			pagination.classList.remove('orders__pagination--hidden')
		}
		summaryText.textContent = ' 7'
		console.log('Показано таблицю з даними')
	}

	// Додаємо кнопку для демонстрації (можна видалити в продакшені)
	const demoButton = document.createElement('button')
	demoButton.textContent = 'Перемкнути стан'
	demoButton.className = 'orders__demo-toggle'
	demoButton.style.cssText = `
		position: fixed;
		top: 100px;
		right: 20px;
		z-index: 1000;
		padding: 10px 16px;
		background: #202941;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-family: Montserrat, sans-serif;
		font-size: 14px;
		transition: background 0.2s;
	`

	demoButton.addEventListener('mouseenter', () => {
		demoButton.style.background = '#374151'
	})

	demoButton.addEventListener('mouseleave', () => {
		demoButton.style.background = '#202941'
	})

	let isTableVisible = false
	demoButton.addEventListener('click', () => {
		if (isTableVisible) {
			showEmptyState()
			isTableVisible = false
		} else {
			showTableWithData()
			isTableVisible = true
		}
	})

	document.body.appendChild(demoButton)

	// За замовчуванням показуємо стан "немає даних"
	showEmptyState()

	// Ініціалізація пагінації
	initPagination()
}

// Функціональність пагінації
function initPagination() {
	const paginationPages = document.querySelectorAll('.orders__pagination-page')
	const prevBtn = document.querySelector('.orders__pagination-btn--prev')
	const nextBtn = document.querySelector('.orders__pagination-btn--next')

	if (paginationPages.length > 0) {
		function goToPage(pageNumber) {
			console.log('Переходжу на сторінку:', pageNumber)

			// Оновлюємо активну сторінку
			paginationPages.forEach(page => {
				page.classList.remove('orders__pagination-page--active')
			})

			const activePage = document.querySelector(`[data-page="${pageNumber}"]`)
			if (activePage) {
				activePage.classList.add('orders__pagination-page--active')
			}

			// Тут можна додати логіку завантаження даних для конкретної сторінки
			// Наприклад, AJAX запит до сервера
		}

		// Додаємо обробники для кнопок пагінації
		paginationPages.forEach(page => {
			page.addEventListener('click', function () {
				const pageNumber = this.textContent
				goToPage(pageNumber)
			})
		})

		// Кнопки "Попередня" та "Наступна"
		if (prevBtn) {
			prevBtn.addEventListener('click', function () {
				const currentPage = document.querySelector(
					'.orders__pagination-page--active'
				)
				if (currentPage) {
					const currentPageNum = parseInt(currentPage.textContent)
					if (currentPageNum > 1) {
						goToPage(currentPageNum - 1)
					}
				}
			})
		}

		if (nextBtn) {
			nextBtn.addEventListener('click', function () {
				const currentPage = document.querySelector(
					'.orders__pagination-page--active'
				)
				if (currentPage) {
					const currentPageNum = parseInt(currentPage.textContent)
					const maxPage = Math.max(
						...Array.from(paginationPages).map(p => parseInt(p.textContent))
					)
					if (currentPageNum < maxPage) {
						goToPage(currentPageNum + 1)
					}
				}
			})
		}
	}
}

// Ініціалізація сторінки orders при завантаженні DOM
document.addEventListener('DOMContentLoaded', function () {
	// Перевіряємо, чи знаходимося на сторінці orders
	if (document.querySelector('.orders__page')) {
		console.log('Знайдено сторінку orders, ініціалізую...')
		initOrdersPage()
		initOrdersTabs()
		initOrdersTableToggle()
	}
})

// Також спробуємо ініціалізувати після завантаження всіх ресурсів
window.addEventListener('load', function () {
	if (
		document.querySelector('.orders__page') &&
		!document.querySelector('.orders__tab--active')
	) {
		console.log('Сторінка orders завантажена, перевіряю ініціалізацію...')
		setTimeout(initOrdersPage, 100)
		initOrdersTabs()
		initOrdersTableToggle()
	}
})

// Функції для роботи з попапом пошуку заявок
function openOrdersSearchModal() {
	console.log('Функція openOrdersSearchModal викликана')
	const modal = document.getElementById('ordersSearchModal')
	console.log('Знайдено модальне вікно для відкриття:', modal)

	if (modal) {
		console.log('Додаю клас orders-search-modal--active')
		modal.classList.add('orders-search-modal--active')
		document.body.style.overflow = 'hidden'

		// Перевіряємо поточний стан
		console.log('Класи модального вікна:', modal.className)
		console.log('Computed display:', window.getComputedStyle(modal).display)

		// Фокус на поле вводу
		const input = modal.querySelector('.orders-search-modal__input')
		if (input) {
			setTimeout(() => input.focus(), 100)
		}
	} else {
		console.error('Модальне вікно не знайдено!')
	}
}

function closeOrdersSearchModal() {
	const modal = document.getElementById('ordersSearchModal')
	if (modal) {
		modal.classList.remove('orders-search-modal--active')
		document.body.style.overflow = ''

		// Очищаємо поле вводу
		const input = modal.querySelector('.orders-search-modal__input')
		if (input) {
			input.value = ''
		}
	}
}

function applyOrdersSearch() {
	const modal = document.getElementById('ordersSearchModal')
	if (modal) {
		const input = modal.querySelector('.orders-search-modal__input')
		const searchValue = input ? input.value.trim() : ''

		if (searchValue) {
			console.log('Пошук заявки:', searchValue)
			// Тут можна додати логіку пошуку заявок
			// Наприклад, фільтрація таблиці або AJAX запит
		}

		closeOrdersSearchModal()
	}
}

// Ініціалізація попапу пошуку при завантаженні DOM
document.addEventListener('DOMContentLoaded', function () {
	console.log('DOM завантажено, ініціалізую попап пошуку...')

	// Додаємо обробник для кнопки пошуку на мобільних пристроях
	const searchBtn = document.querySelector('.orders__search-btn')
	console.log('Знайдено кнопку пошуку:', searchBtn)

	if (searchBtn) {
		// Тестовий обробник для всіх кліків
		searchBtn.addEventListener('click', function (e) {
			console.log('Клік на кнопку пошуку (загальний)')
			console.log('Ширина екрану:', window.innerWidth)
			console.log('Умова window.innerWidth <= 650:', window.innerWidth <= 650)
		})

		searchBtn.addEventListener('click', function () {
			console.log('Клік на кнопку пошуку, ширина екрану:', window.innerWidth)
			// Перевіряємо ширину екрану
			if (window.innerWidth <= 650) {
				console.log('Відкриваю попап пошуку...')
				openOrdersSearchModal()
			} else {
				console.log('Екран занадто широкий для попапу')
			}
		})
	}

	// Закриття попапу при кліку на overlay
	const modal = document.getElementById('ordersSearchModal')
	console.log('Знайдено модальне вікно:', modal)

	if (modal) {
		// Додаємо тестовий клас для перевірки
		console.log('Початковий стан модального вікна:')
		console.log('- Класи:', modal.className)
		console.log('- Display:', window.getComputedStyle(modal).display)
		console.log('- Z-index:', window.getComputedStyle(modal).zIndex)

		const overlay = modal.querySelector('.orders-search-modal__overlay')
		if (overlay) {
			overlay.addEventListener('click', closeOrdersSearchModal)
		}

		// Закриття по Escape
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') {
				closeOrdersSearchModal()
			}
		})
	} else {
		console.error('Модальне вікно ordersSearchModal не знайдено!')
	}

	// Тестовий виклик функції через 2 секунди
	setTimeout(() => {
		console.log('Тестовий виклик функції відкриття попапу...')
		openOrdersSearchModal()
	}, 2000)
})

// Функціональність копіювання для сторінки referal
function initReferalCopyButtons() {
	const copyButtons = document.querySelectorAll('.referal__bottom-btn.copy-btn')

	copyButtons.forEach(button => {
		button.addEventListener('click', function () {
			// Знаходимо текст для копіювання (значення з referal__bottom-value)
			const valueElement = button
				.closest('.referal__bottom-text')
				.querySelector('.referal__bottom-value')
			const textToCopy = valueElement ? valueElement.textContent : ''

			if (textToCopy) {
				// Копіюємо в буфер обміну
				navigator.clipboard
					.writeText(textToCopy)
					.then(function () {
						console.log('Текст скопійовано:', textToCopy)

						// Показуємо візуальний фідбек
						const originalHTML = button.innerHTML
						button.innerHTML = `
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="#28a745"/>
							</svg>
						`

						// Повертаємо оригінальну іконку через 2 секунди
						setTimeout(() => {
							button.innerHTML = originalHTML
						}, 2000)
					})
					.catch(function (err) {
						console.error('Помилка копіювання:', err)
					})
			}
		})
	})
}

// Ініціалізація кнопок копіювання на сторінці referal
document.addEventListener('DOMContentLoaded', function () {
	// Перевіряємо, чи ми на сторінці referal
	if (document.querySelector('.referal__bottom-text')) {
		initReferalCopyButtons()
	}
})
