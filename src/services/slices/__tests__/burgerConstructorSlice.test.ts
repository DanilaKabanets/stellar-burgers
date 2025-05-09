import {
  constructorReduce,
  addIngredient,
  removeIngredient,
  moveIngredientPosition,
  initialState
} from '../burgerConstructorSlice';
import { TIngredient } from '@utils-types';

describe('constructorReduce', () => {
  const mockIngredient: TIngredient = {
    _id: '123',
    name: 'Тестовый ингредиент',
    type: 'main',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 100,
    price: 50,
    image: 'url',
    image_mobile: 'url',
    image_large: 'url'
  };

  const mockBun: TIngredient = {
    ...mockIngredient,
    _id: '456',
    name: 'Тестовая булка',
    type: 'bun',
    price: 100
  };

  it('должен вернуть начальное состояние', () => {
    expect(constructorReduce(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('addIngredient', () => {
    it('должен добавить булку в конструктор', () => {
      const action = addIngredient(mockBun);
      const state = constructorReduce(initialState, action);

      expect(state.bun).toEqual({
        ...mockBun,
        id: expect.any(String) // nanoid генерирует уникальный ID
      });
    });

    it('должен добавить ингредиент в конструктор', () => {
      const action = addIngredient(mockIngredient);
      const state = constructorReduce(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({
        ...mockIngredient,
        id: expect.any(String)
      });
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент из конструктора', () => {
      // Сначала добавляем ингредиент
      const addAction = addIngredient(mockIngredient);
      let state = constructorReduce(initialState, addAction);
      const ingredientId = state.ingredients[0].id;

      // Затем удаляем ингредиент
      const removeAction = removeIngredient(ingredientId);
      state = constructorReduce(state, removeAction);

      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('moveIngredientPosition', () => {
    it('должен изменить порядок ингредиентов в конструкторе', () => {
      // Добавляем три ингредиента
      let state = initialState;
      const ingredient1 = addIngredient({ ...mockIngredient, _id: '1' });
      const ingredient2 = addIngredient({ ...mockIngredient, _id: '2' });
      const ingredient3 = addIngredient({ ...mockIngredient, _id: '3' });

      state = constructorReduce(state, ingredient1);
      state = constructorReduce(state, ingredient2);
      state = constructorReduce(state, ingredient3);

      // Запоминаем порядок ингредиентов
      const initialIngredients = [...state.ingredients];

      // Меняем позицию ингредиента (перемещаем с индекса 0 на индекс 2)
      const moveAction = moveIngredientPosition({ index: 0, newIndex: 2 });
      state = constructorReduce(state, moveAction);

      // Проверяем, что порядок изменился
      expect(state.ingredients[2]._id).toEqual(initialIngredients[0]._id);
      expect(state.ingredients[0]._id).toEqual(initialIngredients[1]._id);
      expect(state.ingredients[1]._id).toEqual(initialIngredients[2]._id);
    });
  });
});
