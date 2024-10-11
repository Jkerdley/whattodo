import styles from './Item.module.css';

export const Item = ({ title, deleteTodoItem, id }) => {
	return (
		<li className={styles.wrapper}>
			<div className={styles.container}>
				<div className={styles.title}>{title}</div>
				<button className={styles.button} onClick={() => deleteTodoItem(id)}>
					X
				</button>
			</div>
		</li>
	);
};
