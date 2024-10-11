import { Item } from '../Item';
import { useEffect, useState } from 'react';
import styles from './Todo.module.css';

export const TodoList = () => {
	const [title, setTitle] = useState('');
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		fetch('https://mocki.io/v1/dfd2d0b1-46be-4be3-b976-254fc2da22a3').then((data) => {
			data.json().then((todosData) => {
				setTodos([...todos, ...todosData]);
			});
		});
	}, []);

	const addTodo = () => {
		if (title) {
			let newTodo = {
				id: Date.now(),
				title: title,
			};
			setTodos([...todos, newTodo]);
			setTitle('');
		} else if (!title) {
			alert('Пожалуйста введите текст задачи');
		}
	};

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			addTodo();
		}
	};

	const deleteTodoItem = (deletedItemId) => {
		setTodos(todos.filter((todo) => todo.id !== deletedItemId));
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
			<button onClick={addTodo} className={styles.button}>
				{' '}
				Добавить{' '}
			</button>

			<ul>
				{todos.map((todo) => (
					<Item key={todo.id} title={todo.title} id={todo.id} date={todo.id} deleteTodoItem={deleteTodoItem} />
				))}
			</ul>
		</div>
	);
};
