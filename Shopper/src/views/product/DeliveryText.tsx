import styles from '@/styles/ProductCard.module.css';
import { Typography } from '@mui/material';

interface DeliveryDateProps {
  deliveryDate: string;
}

const convertDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}`;
  return formattedDate;
};

export default function DeliveryText({ deliveryDate }: DeliveryDateProps) {
  return (
    <Typography variant="body2">
      FREE delivery{' '}
      <span className={styles.deliveryDate}>{convertDate(deliveryDate)}</span>
    </Typography>
  );
}
