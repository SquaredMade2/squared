import styles from "./SquaredLoading.module.css";

const SquaredLoader = () => {
	return (
		<div
			className={`w-[60px] aspect-square grid grid-cols-2 grid-rows-2 text-primary ${styles.loader}`}
		>
			<div className={styles.loaderBefore} />
		</div>
	);
};

export default SquaredLoader;
