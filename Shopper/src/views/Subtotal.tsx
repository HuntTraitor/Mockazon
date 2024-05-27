import PropTypes from 'prop-types';
import styles from '@/styles/cart.module.css';
import { useTranslation } from 'next-i18next';

export default function Subtotal({
  numberOfProducts,
  subtotal,
}: {
  numberOfProducts: number;
  subtotal: number;
}) {
  const { t } = useTranslation(['products', 'cart']);

  return (
    <span className={styles.subtotal}>
      {t('cart:subtotal')}: ({numberOfProducts}{' '}
      {numberOfProducts > 1 ? t('cart:items') : t('cart:item')}):{' '}
      <strong>${subtotal}</strong>
    </span>
  );
}

Subtotal.propTypes = {
  numberOfProducts: PropTypes.number.isRequired,
  subtotal: PropTypes.number.isRequired,
};
