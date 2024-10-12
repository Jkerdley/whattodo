import styles from './Item.module.css';

export const Item = ({ title, deleteTodoItem, id, editTodoItem }) => {
	return (
		<li className={styles.wrapper}>
			<div className={styles.container}>
				<div className={styles.title}>{title}</div>

				<button className={styles.editButton} onClick={() => editTodoItem(id, title)}>
					Ред.
				</button>
				<button className={styles.button} onClick={() => deleteTodoItem(id)}>
					X
				</button>
			</div>
		</li>
	);
};
