import { Item } from './Item';
import styles from './ItemList.module.css';

export const ItemList = ({ todos, filteredTodos, searchItem, loading, requestDeleteTodoItem, requestEditTodoItem }) => {
	if (loading) {
		return <div className={styles.loader} />;
	}

	if (searchItem.trim() !== '' && filteredTodos.length === 0) {
		return <p className={styles.nothing}>Ничего не найдено</p>;
	}

	const displayTodos = searchItem.trim() === '' ? todos : filteredTodos;

	return (
		<ul>
			{displayTodos.map((todo) => (
				<Item
					key={todo.id}
					title={todo.title}
					id={todo.id}
					deleteTodoItem={requestDeleteTodoItem}
					editTodoItem={requestEditTodoItem}
				/>
			))}
		</ul>
	);
};
