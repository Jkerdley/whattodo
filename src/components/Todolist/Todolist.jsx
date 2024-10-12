import { Item } from '../Item';
import { useState, useEffect, useCallback } from 'react';
import { debounce } from '../Debounce';
import styles from './Todo.module.css';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { db } from '../../firebase';

export const TodoList = () => {
	const [title, setTitle] = useState('');
	const [todos, setTodos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchItem, setSearchItem] = useState('');
	const [filteredTodos, setFilteredTodos] = useState([]);
	const [alphabetSort, setalphabetSort] = useState(false);
	const [sortedTodos, setSortedTodos] = useState([]);

	const loadTodos = useCallback(() => {
		setLoading(true);
		const todosDbRef = ref(db, 'todos');
		onValue(
			todosDbRef,
			(snap) => {
				const loadedData = snap.val();
				if (loadedData) {
					const todoArray = Object.keys(loadedData).map((key) => ({ id: key, ...loadedData[key] }));
					setTodos(todoArray);
				} else {
					setTodos([]);
				}
				setLoading(false);
			},
			(error) => {
				setLoading(false);
			},
		);
	}, []);

	useEffect(() => {
		loadTodos();
	}, [loadTodos]);

	useEffect(() => {
		let updatedTodos = searchItem.trim() !== '' ? filteredTodos : todos;
		if (alphabetSort) {
			updatedTodos = [...updatedTodos].sort((a, b) => a.title.localeCompare(b.title));
		}
		setSortedTodos(updatedTodos);
	}, [todos, alphabetSort, searchItem, filteredTodos]);

	const requestAddTodo = () => {
		if (title) {
			const todosRef = ref(db, 'todos');
			const newTodoItem = {
				title: title,
				completed: false,
			};

			push(todosRef, newTodoItem).then(() => {
				loadTodos();
			});
			setTitle('');
		} else if (!title) {
			alert('Пожалуйста введите текст задачи');
		}
	};

	const requestDeleteTodoItem = (id) => {
		const todosRef = ref(db, `todos/${id}`);
		remove(todosRef).then(() => {
			loadTodos();
		});
	};

	const requestEditTodoItem = (id, title) => {
		const newTitle = prompt('Введите новую задачу', title);
		if (newTitle) {
			const todoRef = ref(db, `todos/${id}`);
			update(todoRef, { title: newTitle }).then(() => {
				loadTodos();
			});
		}
	};

	const debouncedSearch = useCallback(
		debounce((searchItem) => {
			if (searchItem) {
				const filtered = todos.filter((todo) => todo.title.toLowerCase().includes(searchItem.toLowerCase()));
				setFilteredTodos(filtered);
			} else {
				setFilteredTodos([]);
			}
		}, 300),
		[todos],
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

	const togglealphabetSort = () => {
		setalphabetSort(!alphabetSort);
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
			<button onClick={togglealphabetSort} className={styles.alphabetButton}>
				{alphabetSort ? 'Сортировать по умолчанию.' : 'Сортировать А->Я'}
			</button>
			<ul>
				{loading ? (
					<div className={styles.loader} />
				) : searchItem.trim() !== '' && filteredTodos.length === 0 ? (
					<p className={styles.nothing}>Ничего не найдено</p>
				) : searchItem.trim() === '' ? (
					sortedTodos.map((todo) => (
						<Item
							key={todo.id}
							title={todo.title}
							id={todo.id}
							deleteTodoItem={requestDeleteTodoItem}
							editTodoItem={requestEditTodoItem}
						/>
					))
				) : (
					filteredTodos.map((todo) => (
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
