import { Item } from '../Item';
import { useState, useEffect, useCallback } from 'react';
import styles from './Todo.module.css';

const API_URL = 'http://localhost:3004/todos';

const debounce = (func, wait) => {
	let timeout;

	return function (...args) {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			func(...args);
		}, wait);
	};
};

export const TodoList = () => {
	const [title, setTitle] = useState('');
	const [todos, setTodos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchItem, setSearchItem] = useState('');
	const [filteredTodos, setFilteredTodos] = useState([]);
	const [sortAlphabetically, setSortAlphabetically] = useState(false);
	const [sortedTodos, setSortedTodos] = useState([]);

	const loadTodos = useCallback(() => {
		setLoading(true);
		fetch(API_URL)
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		loadTodos();
	}, [loadTodos]);

	useEffect(() => {
		if (sortAlphabetically) {
			setSortedTodos([...todos].sort((a, b) => a.title.localeCompare(b.title)));
		} else {
			setSortedTodos(todos);
		}
	}, [todos, sortAlphabetically]);

	const requestAddTodo = () => {
		if (title) {
			fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-type': 'application/json; charset=utf-8' },
				body: JSON.stringify({
					title: title,
					completed: false,
				}),
			})
				.then((raw) => raw.json())
				.then((response) => {
					console.log('Задача добавлена', response);
					loadTodos();
				});
			setTitle('');
		} else if (!title) {
			alert('Пожалуйста введите текст задачи');
		}
	};

	const requestDeleteTodoItem = (id) => {
		if (!id) {
			console.error('Идентификатор задачи не указан');
			return;
		}
		fetch(`${API_URL}/${id}`, {
			method: 'DELETE',
		})
			.then((raw) => raw.json())
			.then((response) => {
				console.log('Задача удалена', response);
				loadTodos();
			});
	};

	const requestEditTodoItem = (id, title) => {
		if (!id) {
			console.error('Идентификатор задачи не указан');
			return;
		}
		const newTitle = prompt('Введите новую задачу', title);

		if (newTitle === null || newTitle === '') {
			return;
		} else {
			fetch(`${API_URL}/${id}`, {
				method: 'PATCH',
				headers: { 'Content-type': 'application/json; charset=utf-8' },
				body: JSON.stringify({
					title: newTitle,
				}),
			})
				.then((raw) => raw.json())
				.then((response) => {
					console.log('Задача изменена', response);
					loadTodos();
				});
		}
	};

	const debouncedSearch = useCallback(
		debounce((searchItem) => {
			if (searchItem) {
				fetch(API_URL)
					.then((response) => response.json())
					.then((todos) => {
						const filteredTodos = todos.filter((todo) =>
							todo.title.toLowerCase().includes(searchItem.toLowerCase()),
						);
						setFilteredTodos(filteredTodos);
					});
			} else {
				setFilteredTodos([]);
			}
		}, 300),
		[searchItem],
	);

	useEffect(() => {
		debouncedSearch(searchItem);
	}, [searchItem, debouncedSearch]);

	const onBlurClearItem = () => {
		setSearchItem('');
	};

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			requestAddTodo();
		}
	};

	const toggleSortAlphabetically = () => {
		setSortAlphabetically(!sortAlphabetically);
	};

	return (
		<div className={styles.wrapper}>
			<input
				className={styles.searchItem}
				value={searchItem}
				onChange={(event) => setSearchItem(event.target.value)}
				type="text"
				name="search"
				placeholder="Поиск"
				onKeyDown={handleKeyPress}
				onBlur={onBlurClearItem}
			/>
			<input
				className={styles.input}
				value={title}
				onChange={(event) => setTitle(event.target.value)}
				type="text"
				name="title"
				placeholder="Введите задачу"
				onKeyDown={handleKeyPress}
			/>

			<button onClick={requestAddTodo} className={styles.button}>
				Добавить
			</button>
			<button onClick={''} className={styles.alphabetButton}>
				A->Я
			</button>
			<ul>
				{loading ? (
					<div className={styles.loader} />
				) : searchItem.trim() !== '' && filteredTodos.length === 0 ? (
					<p className={styles.nothing}>Ничего не найдено</p>
				) : filteredTodos.length > 0 ? (
					filteredTodos.map((todo) => (
						<Item
							key={todo.id}
							title={todo.title}
							id={todo.id}
							deleteTodoItem={requestDeleteTodoItem}
							editTodoItem={requestEditTodoItem}
						/>
					))
				) : (
					todos.map((todo) => (
						<Item
							key={todo.id}
							title={todo.title}
							id={todo.id}
							deleteTodoItem={requestDeleteTodoItem}
							editTodoItem={requestEditTodoItem}
						/>
					))
				)}
			</ul>
		</div>
	);
};
