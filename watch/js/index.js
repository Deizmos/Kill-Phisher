$(document).ready(function(){
// Мобильное меню
    const menu = $('.mobile-menu');
    const bg = $('.background-mobile');
    const body = $('body');
    const burger = $('.burger');
    const closeMobileMenu = $('.navbar-mobile-exit');
    const navbar = $('.navbar');

    let owl2;
    const activeMobileOwl = () => {
        const sliderContainer = $("#potential-threats-carousel");
        if(window.outerWidth <= 900 && !owl2) {
            sliderContainer.addClass('owl-carousel')
            owl2 = sliderContainer.owlCarousel({
                loop: true,
                dots: false,
                responsive: {
                    0: {
                        items: 1.3,
                        margin: 15,
                    },

                    600: {
                        items: 2.3,
                        margin: 15,
                    },

                    900: {
                        items: 2.3,
                        margin: 20,
                    },
                }
            });
        } else if (window.outerWidth > 900 && owl2) {
            sliderContainer.removeClass('owl-carousel')
            owl2.trigger('destroy.owl.carousel');
            owl2 = null;
        }
    }

// карусель

    const owl = $("#system-advantages-carousel").owlCarousel({
        loop: true,
        dots: false,
        responsive: {
            0: {
                items: 1.3,
                margin: 15,
            },

            600: {
                items: 2.3,
                margin: 15,
            },

            1024: {
                items: 3,
                margin: 44,
            },
        }
    });

    $('.customNextBtn').click(function() {
        owl.trigger('next.owl.carousel');
    })
// Go to the previous item
    $('.customPrevBtn').click(function() {
        // With optional speed parameter
        // Parameters has to be in square bracket '[]'
        owl.trigger('prev.owl.carousel', [300]);
    })

    $('.potentialNextBtn').click(function() {
        owl2.trigger('next.owl.carousel');
    })
// Go to the previous item
    $('.potentialPrevBtn').click(function() {
        // With optional speed parameter
        // Parameters has to be in square bracket '[]'
        owl2.trigger('prev.owl.carousel', [300]);
    })

    activeMobileOwl();

    $(window).on("resize", activeMobileOwl);


//Маска для номера телефона
    $('#tel').inputmask("+7(999)999-99-99");

// Скрытие алерта при нажатии на кнопку выхода
    $('.contacts-message-exit').on('click', () => {
        $('#alert-success, #alert-failed').css('display', 'none');
    });

// Запрет на ввод цифр в поле ФИО
    $('#name').on('input', function() {
        const inputValue = $(this).val();
        const sanitizedValue = inputValue.replace(/[^A-Za-zА-Яа-яЁё\s]/g, '');

        if (inputValue !== sanitizedValue) {
            $(this).val(sanitizedValue);
        }
    });

    const handleCloseMobileMenu = () => {
        body.css('overflow', 'visible');
        bg.css('display', 'none');
        menu.removeClass("active");
        burger.removeClass("active");
        closeMobileMenu.removeClass("active");
        navbar.removeClass("active");
    }

    $('.navbar-list-mobile-line').on('click', handleCloseMobileMenu)

    bg.on('click', handleCloseMobileMenu);

    closeMobileMenu.on('click', handleCloseMobileMenu);

    burger.on('click', () => {
        if (menu.hasClass('active')) {
            handleCloseMobileMenu();
        } else {
            body.css('overflow', 'hidden');
            bg.css('display', 'block');
            menu.addClass("active");
            burger.addClass("active");
            closeMobileMenu.addClass("active")
            navbar.addClass("active")
        }
    });

// FORM

// Очистка формы после отправки
    const clearForm = () => {
        $('#name').val('');
        $('#company').val('');
        $('#tel').val('');
        $('#email').val('');
        $('#message').val('');
        $('.contacts-input-error').removeClass('contacts-input-error');
    };
    const showAlert = (type) => {
        // отображать алерт в зависимости от успеха/ошибки
        type === 'success'? $('#alert-success').css('display', 'block') : $('#alert-failed').css('display', 'block')

        // Если успех очистить форму
        clearForm();

        // Закрытие алерта через 3 секунды
        setTimeout(() => {
            $('#alert-success, #alert-failed').css('display', 'none');
        }, 3000);
    }

    const validatePhoneNumber = (phoneNumber) => {
        const regex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
        return regex.test(phoneNumber);
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isNonEmptyText = (text) => text.trim() !== '';

    const handleSendForm = () => {
        const name = $('#name');
        const company = $('#company');
        const tel = $('#tel');
        const email = $('#email');
        const message = $('#message');


        // ТУТ написать валидацию!
        if (!validatePhoneNumber(tel.val())) {
            tel.addClass('contacts-input-error');
        } else {
            tel.removeClass('contacts-input-error');
        }

        if (!isValidEmail(email.val())) {
            email.addClass('contacts-input-error');
        } else {
            email.removeClass('contacts-input-error');
        }

        if (!isNonEmptyText(name.val())) {
            name.addClass('contacts-input-error');
        } else {
            name.removeClass('contacts-input-error');
        }

        if (!isNonEmptyText(company.val())) {
            company.addClass('contacts-input-error');
        } else {
            company.removeClass('contacts-input-error');
        }

        const validationErrors = $('.contacts-input-error');
        if (validationErrors.length > 0) {
            return;
        }


        const body = `<html>
        <p>Имя: ${name[0].value}</p>
        <p>Компания: ${company[0].value}</p>
        <p>Телефон: ${tel[0].value}</p>
        <p>Email: ${email[0].value}</p>
        <p>Комментарий: ${message[0].value}</p>
    </html>`;

        Email.send({
            SecureToken: "6e2a3207-9f12-4b9d-89af-5d6106f56a1f",
            To : "info@anti-phishing.ru",
            From : "info@anti-phishing.ru",
            Subject : "Заявка от Kill Phisher",
            Body : body
        }).then((message) => {
            showAlert(message === "OK" ? 'success' : 'error');
        });
    }

    const btnForm = $('.btn-contacts');

    btnForm.on('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        handleSendForm();
    });

    const onScroll = (e, scrollTop) => {
        e.preventDefault();
        $('html, body').animate({
            scrollTop,
        }, 1000);
    }

    // Плавный скролл
    $(".phishing-scroll").click((e) => onScroll(e, $(".phishing-container").offset().top - 100));
    $(".interaction-algorithm-scroll").click((e) => onScroll(e, $(".interaction-algorithm-group").offset().top - 100));
    $(".about-us-scroll").click((e) => onScroll(e, $(".about-us-container").offset().top - 100));
    $(".partners-scroll").click((e) => onScroll(e, $(".partners-container").offset().top - 100));
    $(".contacts-scroll").click((e) => onScroll(e, $(".contacts").offset().top - 100));
    $(".footer-logo").click((e) => onScroll(e, 0));
    $(".navbar-logo").click((e) => onScroll(e, 0));
});
