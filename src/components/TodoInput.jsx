import styles from './TodoInput.module.css';

export const TodoInput = ({ title, setTitle, requestAddTodo, handleKeyPress }) => {
	return (
		<input
			className={styles.input}
			value={title}
			onChange={(event) => setTitle(event.target.value)}
			type="text"
			name="title"
			placeholder="Введите задачу"
			onKeyDown={handleKeyPress}
		/>
	);
};
