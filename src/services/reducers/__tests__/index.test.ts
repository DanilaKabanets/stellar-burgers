import { rootReducer } from '../index';

describe('rootReducer', () => {
  it('должен правильно инициализировать rootReducer со всеми слайсами', () => {
    // Получаем начальное состояние rootReducer
    const initialState = rootReducer(undefined, { type: 'INIT' });

    // Проверяем наличие доступа к слайсам
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('constructorBurger');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('order');
  });
});
