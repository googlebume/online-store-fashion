import { useState, useMemo } from 'react';

type TextInputFilterProps<T> = {

  data: T[];

  field: keyof T;

  searchValue: string;
};

type TextInputFilterResult<T> = {

  filtered: T[];

  error: string | null;

  count: number;
};

export const useTextInputFilter = <T extends Record<string, any>>({
  data,
  field,
  searchValue,
}: TextInputFilterProps<T>): TextInputFilterResult<T> => {

  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);

    if (!data || !Array.isArray(data)) {
      setError('Дані для фільтрації не є масивом');
      return { filtered: [], count: 0 };
    }

    if (!searchValue || searchValue.trim() === '') {
      return { filtered: data, count: data.length };
    }

    const normalizedSearchValue = searchValue.toLowerCase().trim();

    try {

      const searchWords = normalizedSearchValue.split(/\s+/).filter(word => word.length > 0);
      const searchChars = Array.from(new Set(normalizedSearchValue.replace(/\s+/g, '')));

      const filtered = data.filter(item => {
        if (item === null || item === undefined || typeof item !== 'object') {
          return false;
        }

        const fieldValue = item[field];
        if (fieldValue === null || fieldValue === undefined) {
          return false;
        }

        const fieldValueStr = String(fieldValue).toLowerCase();

        // точний збіг
        if (fieldValueStr === normalizedSearchValue) {
          return true;
        }

        // перевірка, чи містить значення поля всі пошукові слова
        const containsAllWords = searchWords.every(word => fieldValueStr.includes(word));

        // перевірка, чи містить значення поля всі символи пошуку
        const containsAllChars = searchChars.every(char => fieldValueStr.includes(char));

        // елемент проходить фільтр, якщо виконується хоча б одна з умов
        return containsAllWords || containsAllChars;
      });

      return { filtered, count: filtered.length };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Сталася помилка під час фільтрації';
      setError(errorMessage);
      return { filtered: [], count: 0 };
    }
  }, [data, field, searchValue]);

  return {
    filtered: result.filtered,
    error,
    count: result.count
  };
};