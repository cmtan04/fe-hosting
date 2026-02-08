// Format hh:mm:dd
export const formatMinutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes % 1) * 60);

  const hh = String(hours).padStart(2, "0");
  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
};

export const formatMoney = (value: string) => {
  if (Number(value) === 0) return "";

  const number = Number(value.replace(/,/g, ""));
  return number.toLocaleString("en-US");
};

export const formatCurrencyVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
};
