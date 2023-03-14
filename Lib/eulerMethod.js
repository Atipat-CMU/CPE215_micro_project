export const eulerMethod = (points) => {
  const result = [{ x: 0, y: 0 }];
  for (let i = 0; i < points.length - 1; i++) {
    const yi = points.at(i).y;
    const yi_1 = points.at(i + 1).y;
    const xi = points.at(i).x;
    const xi_1 = points.at(i + 1).x;
    const y = result.at(i).y + ((yi + yi_1) / 2) * (xi_1 - xi);
    result.push({ x: xi_1, y: y });
  }
  return result;
};
