async function fetchProducts(data:any) {
    const response = await fetch('http://localhost:3001/shop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    console.log(result);
  }
  
  fetchProducts({ title: 'Нова картка', description: 'Опис картки' });