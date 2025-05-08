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
      // Проверяем отсутствие модального окна перед кликом
      cy.get('#modals > div:first-child').should('not.exist');

      // Открываем модальное окно с деталями ингредиента
      cy.contains('Булки').click({ force: true });
      cy.contains('Краторная булка N-200i').parent().find('img').click();

      // Проверяем, что модальное окно открылось
      cy.contains('Детали ингредиента').should('be.visible');

      // Проверяем, что в модальном окне отображается информация о правильном ингредиенте
      cy.contains('Краторная булка N-200i').should('be.visible');

      // Закрываем модальное окно по клику на крестик
      cy.get('#modals > div:first-child').find('button').click();

      // Проверяем, что модальное окно закрылось
      cy.contains('Детали ингредиента').should('not.exist');
      cy.get('#modals > div:first-child').should('not.exist');
    });

    it('Проверка закрытия модального окна по клику на оверлей', () => {
      // Проверяем отсутствие модального окна перед кликом
      cy.get('#modals > div:first-child').should('not.exist');

      // Открываем модальное окно с деталями ингредиента
      cy.contains('Соусы').click({ force: true });
      cy.contains('Соус фирменный Space Sauce').parent().find('img').click();

      // Проверяем, что модальное окно открылось
      cy.contains('Детали ингредиента').should('be.visible');

      // Проверяем, что в модальном окне отображается информация о правильном ингредиенте
      cy.contains('Соус фирменный Space Sauce').should('be.visible');

      // Закрываем модальное окно по клику на оверлей
      cy.get('body').click(0, 0);

      // Проверяем, что модальное окно закрылось
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

      // Проверяем, что ингредиенты добавлены именно в конструктор
      cy.get('div[class^=constructor-element]').each(($element) => {
        cy.wrap($element).within(() => {
          if ($element.text().includes('Краторная булка N-200i (верх)')) {
            cy.contains('Краторная булка N-200i (верх)').should('be.visible');
          }
          if ($element.text().includes('Краторная булка N-200i (низ)')) {
            cy.contains('Краторная булка N-200i (низ)').should('be.visible');
          }
          if ($element.text().includes('Биокотлета из марсианской Магнолии')) {
            cy.contains('Биокотлета из марсианской Магнолии').should(
              'be.visible'
            );
          }
          if ($element.text().includes('Соус фирменный Space Sauce')) {
            cy.contains('Соус фирменный Space Sauce').should('be.visible');
          }
        });
      });
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

    it('Проверка создания заказа и очистки конструктора', () => {
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

      // Проверяем наличие ингредиентов в конструкторе перед оформлением заказа
      cy.get('div[class^=constructor-element]').should(
        'have.length.at.least',
        3
      );
      cy.get('div[class^=constructor-element]').each(($element) => {
        cy.wrap($element).should('be.visible');
      });

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

      // Проверяем, что конструктор очистился после оформления заказа
      cy.get('div[class^=constructor-element]').should('not.exist');
      // Проверяем наличие заглушек для пустого конструктора
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
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
