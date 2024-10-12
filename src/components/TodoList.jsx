import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { db } from '../firebase';
import { debounce } from './Debounce';
import { TodoInput } from './TodoInput';
import { SearchInput } from './SearchInput';
import { ItemList } from './ItemList';
import styles from './TodoList.module.css';

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
			() => {
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
		} else {
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
			<SearchInput
				searchItem={searchItem}
				setSearchItem={setSearchItem}
				handleKeyPress={handleKeyPress}
				onBlurClearItem={onBlurClearItem}
			/>
			<TodoInput
				title={title}
				setTitle={setTitle}
				handleKeyPress={handleKeyPress}
				requestAddTodo={requestAddTodo}
			/>
			<button onClick={requestAddTodo} className={styles.button}>
				Добавить
			</button>
			<button onClick={togglealphabetSort} className={styles.alphabetButton}>
				{alphabetSort ? 'Сортировать по умолчанию' : 'Сортировать А->Я'}
			</button>
			<ItemList
				todos={sortedTodos}
				filteredTodos={filteredTodos}
				searchItem={searchItem}
				loading={loading}
				requestDeleteTodoItem={requestDeleteTodoItem}
				requestEditTodoItem={requestEditTodoItem}
			/>
		</div>
	);
};
