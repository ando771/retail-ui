# Локальные функции

Функции валидации выполняются при каждом вычислении валидаций модели.
Такой подход может быть неудобным, если для валидации требуется сделать запрос на сервер.
Кроме того, ответ сервера может содержать информацию для валидации двух полей.
В таком случае хотелось бы обойтись только одинм запросом.

Для оптимизации асинхронных вычислений сделано кеширование результатов асинхронных вычисений.

    const validation = createValidation<string>(b => {
      const isValid = b.local('name', x => x.replace(/\s+/g, ""), x => getFromServer(x));
      b.invalid(async x => !await isValid(), 'Ошибка', 'lostfocus');
    });

Нужно создать локальную функцию с помощью метода `local(...)`.
Первым аргументом задается имя, которое должно быть уникальным для узла, на котором вызывается метод `local(...)`.
Вторым аргументом задается функция, которая принимает значение узла, а возвращает объект-зависимость.
Третьим аргументом задается функция-вычисление, коорая принимает объект-зависимость.

Вычисление запустится при мервом вызове локальной функции `isValid`.
При последующих вызовах будет возвращаться Promise, который разресолвится с помощью Promise от первого вызова.
Если объект-зависимость изменится, то текущее вычисление прервется, а новое запустится при следующем вызове локальной функции.

### Пример

    !!DemoWithCode!!./Locals

## Использование одной переменной в нескольких узлах

пояснения

    пример кода

пояснения

### Пример

    !!DemoWithCode!!./Locals