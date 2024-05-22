import PropTypes from 'prop-types';
import styles from '@/styles/cart.module.css';

export default function Subtotal({
  numberOfProducts,
  subtotal,
}: {
  numberOfProducts: number;
  subtotal: number;
}) {
  return (
    <span className={styles.subtotal}>
      Subtotal ({numberOfProducts} {numberOfProducts > 1 ? 'items' : 'item'}): $
      {subtotal}
    </span>
  );
}

Subtotal.propTypes = {
  numberOfProducts: PropTypes.number.isRequired,
  subtotal: PropTypes.number.isRequired,
};
