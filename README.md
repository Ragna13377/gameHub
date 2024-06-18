# Поиск игры с наименьшей ценой в каталогах Steam, Epic Games, Origin

## Stack
* React
* Typescript
* Expess
* Mongo

## Steam 
В API Steam отсутствует поиск по названию, поэтому получаем полный каталог SteamApps. _~ 200к записей `fetchSteamAppList`_  
**Оптимизация:**  
Каталог фильтруется по первым двум буквам каждого слова в названии игры - `filterSteamAppByTwoLetter`  
Сложность `O(n*m)`, где `n` - количество игр в каталоге, m - среднее количество слов в названии игр  
Исключены из совпадений наиболее встречающиеся артикли и предлоги, что снизило максимальные размеры массивов на 10к 
Результирующее количество вариаций: 21000 с размером от 10 до 20000

**Пользовательский запрос:**
1. Запрашиваем из БД массивы, соответствующие первым 2 буквам каждого слова в запросе `fetchByFilteredIndex`  
2. С помощью `Fuse.js` (алгоритм нечеткого поиска) ищем совпадения и фильтруем повторяющиеся результаты `fuseSearch`  
Количество операций сравнения: средний пользовательский запрос - 2 слова.  
   * Худший случай: 40к сравнений  
   * Средний случай: 20к сравнений
   * Лучший случай: 20 сравнений
3. 6 наиболее точных совпадений отправляются клиенту
**Результаты дополнительно сортируются на клиентской части**

## Планируемая доработка
1. Кэширование пользовательских запросов в Redux в пределах сеанса
2. Ленивая дозагрузка новых результатов по прокрутке страницы до конца или по интервалу
3. Присвоение токена каждому пользователю для отмены запросов