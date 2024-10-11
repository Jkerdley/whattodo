import { Item } from '../Item';
import { useEffect, useState } from 'react';
import styles from './Todo.module.css';

export const TodoList = () => {
	const [title, setTitle] = useState('');
	const [todos, setTodos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [deleteItem, setDeleteItem] = useState(false);
	const [refreshTodos, setRefreshTodos] = useState(false);

	const refreshTodoList = () => setRefreshTodos(!refreshTodos);

	useEffect(() => {
		setLoading(true);
		fetch('http://localhost:3004/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
			})
			.finally(() => setLoading(false));
	}, [refreshTodos]);

	const requestAddTodo = () => {
		if (title) {
			fetch(`http://localhost:3004/todos`, {
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
					refreshTodoList();
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
		setDeleteItem(true);
		fetch(`http://localhost:3004/todos/${id}`, {
			method: 'DELETE',
		})
			.then((raw) => raw.json())
			.then((response) => {
				console.log('Задача удалена', response);
				refreshTodoList();
			})
			.finally(() => setDeleteItem(false));
	};

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			requestAddTodo();
		}
	};

	return (
		<div className={styles.wrapper}>
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
				) : (
					todos.map((todo) => (
						<Item key={todo.id} title={todo.title} id={todo.id} deleteTodoItem={requestDeleteTodoItem} />
					))
				)}
			</ul>
		</div>
	);
};
