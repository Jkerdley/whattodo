import styles from './SearchInput.module.css';

export const SearchInput = ({ searchItem, setSearchItem, handleKeyPress, onBlurClearItem }) => {
	return (
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
	);
};
