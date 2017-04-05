/**
 * Calculate body mass index (BMI)
 *
 * @param weight kg
 * @param height cm
 */
module.exports = (weight, height) => {
  const meterHeight = height / 100;
  const bmi = weight / Math.pow(meterHeight, 2);

  return Math.round(bmi * 10) / 10;
};
