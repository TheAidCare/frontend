import styles from './LoadingToast.module.css';

const LoadingToast = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.toast}>
      <div className={styles.spinner} />
      <span className={styles.message}>Processing new information...</span>
    </div>
  );
};

export default LoadingToast; 