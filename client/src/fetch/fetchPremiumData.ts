export const fetchPremiumData = async (token: string) => {
  const response = await fetch("http://localhost:3000/premium-data", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log(data);
  return data;
};
