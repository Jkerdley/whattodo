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
				{' '}
				Добавить{' '}
			</button>

			<ul>
				{loading ? (
					<div className={styles.loader} />
				) : searchItem.trim() !== '' && filteredTodos.length === 0 ? (
					<p className={styles.nothing}>Ничего не найдено</p>
				) : filteredTodos.length > 0 ? (
					filteredTodos.map((todo) => (
						<Item key={todo.id} title={todo.title} id={todo.id} deleteTodoItem={requestDeleteTodoItem} />
					))
				) : (
					todos.map((todo) => (
						<Item key={todo.id} title={todo.title} id={todo.id} deleteTodoItem={requestDeleteTodoItem} />
					))
				)}
			</ul>
		</div>
	);
};

// export const TodoList = () => {
// 	const [title, setTitle] = useState('');
// 	const [todos, setTodos] = useState([]);
// 	const [loading, setLoading] = useState(false);
// 	const [deleteItem, setDeleteItem] = useState(false);
// 	const [refreshTodos, setRefreshTodos] = useState(false);
// 	const [searchItem, setSearchItem] = useState('');

// 	const refreshTodoList = () => setRefreshTodos(!refreshTodos);

// 	useEffect(() => {
// 		setLoading(true);
// 		fetch('http://localhost:3004/todos')
// 			.then((loadedData) => loadedData.json())
// 			.then((loadedTodos) => {
// 				setTodos(loadedTodos);
// 			})
// 			.finally(() => setLoading(false));
// 	}, [refreshTodos]);

// 	const requestAddTodo = () => {
// 		if (title) {
// 			fetch(`http://localhost:3004/todos`, {
// 				method: 'POST',
// 				headers: { 'Content-type': 'application/json; charset=utf-8' },
// 				body: JSON.stringify({
// 					title: title,
// 					completed: false,
// 				}),
// 			})
// 				.then((raw) => raw.json())
// 				.then((response) => {
// 					console.log('Задача добавлена', response);
// 					refreshTodoList();
// 				});
// 			setTitle('');
// 		} else if (!title) {
// 			alert('Пожалуйста введите текст задачи');
// 		}
// 	};

// 	const requestDeleteTodoItem = (id) => {
// 		if (!id) {
// 			console.error('Идентификатор задачи не указан');
// 			return;
// 		}
// 		setDeleteItem(true);
// 		fetch(`http://localhost:3004/todos/${id}`, {
// 			method: 'DELETE',
// 		})
// 			.then((raw) => raw.json())
// 			.then((response) => {
// 				console.log('Задача удалена', response);
// 				refreshTodoList();
// 			})
// 			.finally(() => setDeleteItem(false));
// 	};

// 	const handleKeyPress = (event) => {
// 		if (event.key === 'Enter') {
// 			requestAddTodo();
// 		}
// 	};

// 	return (
// 		<div className={styles.wrapper}>
// 			<input
// 				className={styles.searchItem}
// 				value={searchItem}
// 				onChange={(event) => setSearchItem(event.target.value)}
// 				type="text"
// 				name="find"
// 				placeholder="Поиск"
// 				onKeyDown={handleKeyPress}
// 			/>
// 			<input
// 				className={styles.input}
// 				value={title}
// 				onChange={(event) => setTitle(event.target.value)}
// 				type="text"
// 				name="title"
// 				placeholder="Введите задачу"
// 				onKeyDown={handleKeyPress}
// 			/>

// 			<button onClick={requestAddTodo} className={styles.button}>
// 				{' '}
// 				Добавить{' '}
// 			</button>

// 			<ul>
// 				{loading ? (
// 					<div className={styles.loader} />
// 				) : (
// 					todos.map((todo) => (
// 						<Item key={todo.id} title={todo.title} id={todo.id} deleteTodoItem={requestDeleteTodoItem} />
// 					))
// 				)}
// 			</ul>
// 		</div>
// 	);
// };
