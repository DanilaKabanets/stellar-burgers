describe('Интеграционные тесты для страницы конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/auth/tokens', { fixture: 'token.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
    cy.visit('http://localhost:4000/');
    cy.contains('Соберите бургер').should('be.visible');
  });

  describe('Тестирование загрузки ингредиентов', () => {
    it('Проверка загрузки ингредиентов', () => {
      // Проверяем, что разделы ингредиентов видны
      cy.contains('Булки').should('be.visible');
      cy.contains('Начинки').should('be.visible');
      cy.contains('Соусы').should('be.visible');

      // Проверяем загрузку ингредиентов в каждой категории
      cy.contains('Булки').click({ force: true });
      cy.contains('Краторная булка N-200i').should('be.visible');

      cy.contains('Начинки').click({ force: true });
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');

      cy.contains('Соусы').click({ force: true });
      cy.contains('Соус фирменный Space Sauce').should('be.visible');
    });
  });

  describe('Тестирование работы модального окна', () => {
    it('Проверка закрытия модального окна по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').parent().find('img').click();
      cy.contains('Детали ингредиента').should('be.visible');
      cy.get('#modals > div:first-child').find('button').click();
      cy.contains('Детали ингредиента').should('not.exist');
      cy.get('#modals > div:first-child').should('not.exist');
    });

    it('Проверка закрытия модального окна по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').parent().find('img').click();
      cy.contains('Детали ингредиента').should('be.visible');
      cy.get('body').click(0, 0);
      cy.contains('Детали ингредиента').should('not.exist');
      cy.get('#modals > div:first-child').should('not.exist');
    });
  });

  describe('Проверяем, что конструктор умничка', () => {
    it('Добавление ингредиентов в конструктор', () => {
      // Добавляем булку
      cy.contains('Булки').click({ force: true });
      cy.contains('Краторная булка N-200i').parent().find('button').click();

      // Добавляем начинку
      cy.contains('Начинки').click({ force: true });
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .click();

      // Добавляем соус
      cy.contains('Соусы').click({ force: true });
      cy.contains('Соус фирменный Space Sauce').parent().find('button').click();

      // Проверяем, что ингредиенты добавлены в конструктор
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('Соус фирменный Space Sauce').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    });
  });

  describe('Тестирование оформления заказа', () => {
    beforeEach(() => {
      // Подготавливаем моки для запросов
      cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
        fixture: 'order.json'
      }).as('postOrder');

      cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
        fixture: 'token.json'
      }).as('getUser');

      // Устанавливаем токены в localStorage
      cy.window().then((window) => {
        window.localStorage.setItem('accessToken', 'Bearer test_access_token');
        window.localStorage.setItem('refreshToken', 'test_refresh_token');
      });
    });

    it('Проверка создания заказа', () => {
      // Добавляем булку
      cy.contains('Булки').click({ force: true });
      cy.contains('Краторная булка N-200i').parent().find('button').click();

      // Добавляем начинку
      cy.contains('Начинки').click({ force: true });
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .click();

      // Добавляем соус
      cy.contains('Соусы').click({ force: true });
      cy.contains('Соус фирменный Space Sauce').parent().find('button').click();

      // Нажимаем кнопку оформления заказа
      cy.contains('Оформить заказ').click();

      // Ждем отправки запроса
      cy.wait('@postOrder');

      // Проверяем, что модальное окно с информацией о заказе отображается
      cy.contains('идентификатор заказа', { matchCase: false }).should(
        'be.visible'
      );

      // Закрываем модальное окно
      cy.get('#modals > div:first-child').find('button').click();
      cy.contains('идентификатор заказа', { matchCase: false }).should(
        'not.exist'
      );
    });

    afterEach(() => {
      // Очистка localStorage после каждого теста
      cy.window().then((window) => {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('refreshToken');
      });

      // Очистка cookies
      cy.clearCookies();
      cy.clearLocalStorage();
    });
  });
});
